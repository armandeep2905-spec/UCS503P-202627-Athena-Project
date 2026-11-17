import os
import re
import json
import time
import sqlite3
import requests
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path

# Paths
CORE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CORE_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
THAPAR_INFO_DIR = PROJECT_ROOT / "ThaparInfo"
KB_JSONL_PATH = THAPAR_INFO_DIR / "tiet_chatbot_knowledge_base.jsonl"
FACULTY_JSON_PATH = THAPAR_INFO_DIR / "faculty.json"
COURSES_JSON_PATH = THAPAR_INFO_DIR / "tiet_courses_cgpa.json"
FTS_DB_PATH = BACKEND_DIR / "tiet_kb_fts.db"

# Location keywords mapping for campus navigation
LOCATION_KEYWORDS = {
    1: ["computer science", "csed", "cs block", "computer lab", "software lab", "ai lab"],
    2: ["auditorium", "audi", "main stage", "convocation hall"],
    3: ["library", "central library", "reading hall", "books", "journal", "digital library"],
    4: ["admin", "administrative block", "registrar", "examination branch", "student affairs", "dosa", "doaa"],
    5: ["mechanical", "workshop", "cad lab", "thermal lab", "med"],
    6: ["hostel", "boys hostel", "girls hostel", "mess", "residential", "warden", "curfew"],
    7: ["sports", "gym", "gymnasium", "ground", "swimming pool", "basketball", "cricket"]
}

# Words indicating user is explicitly asking for document/source references
SOURCE_REQUEST_KEYWORDS = [
    "source", "sources", "document", "documents", "citation", "citations",
    "reference", "references", "where is it written", "proof", "pdf", "circular",
    "which notice", "which regulation", "show source", "show document"
]


class TIETRAGService:
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = str(db_path or FTS_DB_PATH)
        self.api_key = self._get_gemini_api_key()
        
        # In-memory structured knowledge
        self.faculty_list: List[Dict[str, Any]] = []
        self.courses_list: List[Dict[str, Any]] = []
        self._load_structured_data()
        
        # FTS5 index for full-text regulations and documents
        self._ensure_index()

    def _get_gemini_api_key(self) -> str:
        key = os.getenv("GEMINI_API_KEY", "")
        if not key:
            env_file = BACKEND_DIR / ".env"
            if env_file.exists():
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line.startswith("GEMINI_API_KEY=") and not line.startswith("#"):
                            key = line.split("=", 1)[1].strip().strip("\"'")
                            break
        return key

    def _load_structured_data(self):
        """Load faculty records and courses directly from PostgreSQL database first, with file fallback."""
        self.faculty_list = []
        self.courses_list = []

        dept_code_map = {
            "Computer Science & Engineering": "CSED",
            "Electronics & Communication Engineering": "ECED",
            "Electrical & Instrumentation Engineering": "EIED",
            "Mechanical Engineering": "MED",
            "Civil Engineering": "CED",
            "Chemical Engineering": "CHED",
            "Biotechnology": "BTD",
        }

        # 1. Load Faculty from live PostgreSQL database FIRST
        try:
            from core.models import Faculty
            db_faculty = list(Faculty.objects.select_related("department").all())
            if db_faculty:
                for fac in db_faculty:
                    full_dept = fac.department.department_name if fac.department else "Computer Science & Engineering"
                    code_dept = dept_code_map.get(full_dept, full_dept)
                    email_val = fac.email or fac.contact or "N/A"
                    contact_val = fac.contact or fac.email or "N/A"
                    office_val = fac.office or "TIET Campus"
                    self.faculty_list.append({
                        "name": fac.name,
                        "designation": fac.designation or "Faculty",
                        "department": code_dept,
                        "department_name": full_dept,
                        "email": email_val,
                        "contact": contact_val,
                        "office_no": office_val,
                    })
                print(f"[TIETRAGService] Loaded {len(self.faculty_list)} faculty members from live database.")
        except Exception as e:
            print(f"[TIETRAGService] Database faculty query failed, using fallback: {e}")

        # Fallback to faculty.json if database was empty or unreachable
        if not self.faculty_list and FACULTY_JSON_PATH.exists():
            try:
                with open(FACULTY_JSON_PATH, "r", encoding="utf-8") as f:
                    self.faculty_list = json.load(f)
                print(f"[TIETRAGService] Loaded {len(self.faculty_list)} faculty from faculty.json fallback.")
            except Exception as e:
                print(f"[TIETRAGService] Error loading faculty.json: {e}")

        # 2. Load Courses from live PostgreSQL database FIRST
        try:
            from core.models import Course
            db_courses = list(Course.objects.all())
            if db_courses:
                for c in db_courses:
                    self.courses_list.append({
                        "code": c.course_code,
                        "name": c.course_name,
                        "credits": c.credits or 0.0,
                        "semester": c.semester or "Core",
                    })
                print(f"[TIETRAGService] Loaded {len(self.courses_list)} courses from live database.")
        except Exception as e:
            print(f"[TIETRAGService] Database courses query failed, using fallback: {e}")

        # Fallback to tiet_courses_cgpa.json if database was empty or unreachable
        if not self.courses_list and COURSES_JSON_PATH.exists():
            try:
                with open(COURSES_JSON_PATH, "r", encoding="utf-8") as f:
                    self.courses_list = json.load(f)
                print(f"[TIETRAGService] Loaded {len(self.courses_list)} courses from json fallback.")
            except Exception as e:
                print(f"[TIETRAGService] Error loading tiet_courses_cgpa.json: {e}")

    def _ensure_index(self):
        """Build SQLite FTS5 index from JSONL knowledge chunks if missing or empty."""
        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='tiet_chunks'")
        table_exists = cur.fetchone() is not None
        
        chunk_count = 0
        if table_exists:
            cur.execute("SELECT count(*) FROM tiet_chunks")
            chunk_count = cur.fetchone()[0]

        if not table_exists or chunk_count == 0:
            print("[TIETRAGService] Building FTS5 index from ThaparInfo...")
            cur.execute("DROP TABLE IF EXISTS tiet_chunks")
            cur.execute("""
                CREATE VIRTUAL TABLE tiet_chunks USING fts5(
                    chunk_id UNINDEXED,
                    source_title,
                    source_url UNINDEXED,
                    page UNINDEXED,
                    content,
                    tokenize = 'porter unicode61'
                )
            """)
            
            if KB_JSONL_PATH.exists():
                with open(KB_JSONL_PATH, "r", encoding="utf-8") as f:
                    batch = []
                    for line in f:
                        if not line.strip():
                            continue
                        try:
                            rec = json.loads(line)
                            batch.append((
                                str(rec.get("id", "")),
                                str(rec.get("source_title", "Official TIET Document")),
                                str(rec.get("source_url", "")),
                                str(rec.get("page", 1)),
                                str(rec.get("content", ""))
                            ))
                            if len(batch) >= 1000:
                                cur.executemany("INSERT INTO tiet_chunks VALUES (?, ?, ?, ?, ?)", batch)
                                batch = []
                        except Exception:
                            continue
                    if batch:
                        cur.executemany("INSERT INTO tiet_chunks VALUES (?, ?, ?, ?, ?)", batch)

            conn.commit()
            cur.execute("SELECT count(*) FROM tiet_chunks")
            print(f"[TIETRAGService] Index ready with {cur.fetchone()[0]} entries.")

        conn.close()

    # ---------------------------------------------------------
    # Specialized Entity Matchers
    # ---------------------------------------------------------

    COMMON_NON_NAMES = {
        "the", "and", "for", "with", "from", "that", "this", "what", "which", "where", "when",
        "how", "who", "why", "can", "tell", "give", "show", "about", "please", "all", "any",
        "some", "details", "info", "information", "thapar", "tiet", "campus", "course", "courses",
        "subject", "subjects", "semester", "sem", "exam", "exams", "result", "grade", "grades",
        "cgpa", "sgpa", "hostel", "mess", "fees", "fee", "scholarship", "library", "sports",
        "mail", "email", "contact", "phone", "number", "office", "cabin", "room", "profile",
        "faculty", "prof", "dr", "teacher", "sir", "maam", "head", "dean", "hod", "department",
        "dept", "is", "in", "at", "to", "of", "a", "an", "do", "does", "send", "get"
    }

    FACULTY_INTENT_KEYWORDS = {
        "faculty", "dr", "prof", "professor", "teacher", "sir", "maam", "hod", "head", "dean",
        "instructor", "mail", "email", "contact", "phone", "number", "office", "cabin", "room",
        "profile", "reach", "id", "details", "info", "who", "address"
    }

    def match_faculty(self, query: str) -> List[Dict[str, Any]]:
        """Identify faculty members mentioned by name, department, or title."""
        q_lower = query.lower()
        cleaned = re.sub(r"[^\w\s]", " ", q_lower)
        words = set(cleaned.split())
        has_intent = any(k in words for k in self.FACULTY_INTENT_KEYWORDS)

        matched = []

        # 1. Direct name match & partial parts matching
        for fac in self.faculty_list:
            name = fac.get("name", "")
            raw_name = re.sub(r"^(dr\.|mr\.|ms\.|prof\.)\s*", "", name.lower()).strip()
            name_parts = [p for p in raw_name.split() if len(p) > 2]
            if not name_parts:
                continue

            # Full raw name exact substring (e.g. 'neeraj kumar', 'seema bawa')
            if raw_name in q_lower:
                matched.append((fac, 10))
                continue

            # All distinctive parts present in query words
            if len(name_parts) >= 2 and all(p in words for p in name_parts):
                matched.append((fac, 9))
                continue

            # First name match against query words (e.g. 'neeraj mail', 'seema email')
            first_name = name_parts[0]
            if first_name in words and first_name not in self.COMMON_NON_NAMES:
                score = 8 if has_intent else 6
                matched.append((fac, score))
                continue

            # Distinctive surname/middle name match
            for p in name_parts[1:]:
                if p in words and p not in self.COMMON_NON_NAMES:
                    if p in {"kumar", "singh", "sharma", "kaur", "verma", "gupta"}:
                        if has_intent and len(words - self.COMMON_NON_NAMES) <= 2:
                            matched.append((fac, 4))
                    else:
                        score = 7 if has_intent else 5
                        matched.append((fac, score))
                    break

        # 2. Department match if query asks for faculty in a department
        dept_keywords = {
            "CSED": ["csed", "cse", "computer science", "computer"],
            "ECED": ["eced", "ece", "electronics", "communication"],
            "EIED": ["eied", "eie", "electrical", "instrumentation"],
            "MED": ["med", "mechanical"],
            "CED": ["ced", "civil"],
            "CHED": ["ched", "chemical"],
            "BTD": ["btd", "biotech", "biotechnology"]
        }

        if any(w in words for w in ["faculty", "professors", "teachers", "staff", "hod", "head", "dean"]):
            for dept, kws in dept_keywords.items():
                if any(kw in q_lower for kw in kws):
                    dept_facs = [f for f in self.faculty_list if f.get("department") == dept]
                    for df in dept_facs[:8]:
                        matched.append((df, 4))
                    break

        # Sort by score descending and deduplicate
        matched.sort(key=lambda x: x[1], reverse=True)
        seen = set()
        results = []
        for fac, _ in matched:
            fid = f"{fac.get('name')}_{fac.get('department')}"
            if fid not in seen:
                seen.add(fid)
                results.append(fac)
            if len(results) >= 6:
                break

        return results

    def match_courses_and_cgpa(self, query: str) -> Tuple[List[Dict[str, Any]], bool]:
        """
        Identify if query asks about semester-wise subjects, course codes, or CGPA calculator.
        Returns (matched_courses, is_cgpa_calculation_query)
        """
        q_lower = query.lower()
        matched = []
        is_cgpa_query = any(k in q_lower for k in [
            "cgpa", "sgpa", "gpa", "grade point", "grading system", "calculate cgpa",
            "calculator", "credits", "formula"
        ])

        # 1. Semester matching (Semester 1 to 8, or Semester I to VIII)
        sem_map = {
            "semester 1": "Semester I", "sem 1": "Semester I", "first sem": "Semester I", "1st sem": "Semester I",
            "semester 2": "Semester II", "sem 2": "Semester II", "second sem": "Semester II", "2nd sem": "Semester II",
            "semester 3": "Semester III", "sem 3": "Semester III", "third sem": "Semester III", "3rd sem": "Semester III",
            "semester 4": "Semester IV", "sem 4": "Semester IV", "fourth sem": "Semester IV", "4th sem": "Semester IV",
            "semester 5": "Semester V", "sem 5": "Semester V", "fifth sem": "Semester V", "5th sem": "Semester V",
            "semester 6": "Semester VI", "sem 6": "Semester VI", "sixth sem": "Semester VI", "6th sem": "Semester VI",
            "semester 7": "Semester VII", "sem 7": "Semester VII", "seventh sem": "Semester VII", "7th sem": "Semester VII",
            "semester 8": "Semester VIII", "sem 8": "Semester VIII", "eighth sem": "Semester VIII", "8th sem": "Semester VIII",
        }

        matched_sem = None
        for key, target_sem in sem_map.items():
            if key in q_lower:
                matched_sem = target_sem
                break

        if matched_sem:
            for c in self.courses_list:
                if matched_sem in c.get("semester", ""):
                    matched.append(c)

        # 2. Specific course code or course name matching
        words = re.findall(r"\b[A-Za-z]{3}\d{3}\b", query.upper())
        for code in words:
            for c in self.courses_list:
                if c.get("code") == code and c not in matched:
                    matched.append(c)

        # Check for course names like 'Data Structures', 'Operating System', etc.
        for c in self.courses_list:
            c_name = c.get("name", "").lower()
            if len(c_name) > 4 and c_name in q_lower and c not in matched:
                matched.append(c)

        # 3. Electives matching
        if "elective" in q_lower:
            for c in self.courses_list:
                if "elective" in c.get("semester", "").lower() and c not in matched:
                    matched.append(c)

        return matched, is_cgpa_query

    # ---------------------------------------------------------
    # Regulations & Documents FTS5 Retrieval
    # ---------------------------------------------------------

    STOP_WORDS = {
        "what", "is", "the", "are", "and", "or", "to", "in", "at", "for",
        "of", "a", "an", "this", "that", "it", "how", "can", "do", "does",
        "i", "my", "me", "we", "our", "you", "your", "who", "whom", "tell",
        "about", "please", "give", "show", "details", "information", "thapar", "tiet"
    }

    def retrieve_documents(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant institutional regulations & policy chunks via BM25."""
        clean_query = re.sub(r"[^\w\s]", " ", query.lower())
        all_words = clean_query.split()
        
        terms = [w for w in all_words if len(w) > 2 and w not in self.STOP_WORDS]
        if not terms:
            terms = [w for w in all_words if len(w) > 2]
        if not terms:
            terms = all_words
        if not terms:
            return []

        conn = sqlite3.connect(self.db_path)
        cur = conn.cursor()
        rows = []
        seen_ids = set()

        # Step 1: Specific AND match
        if len(terms) >= 2:
            and_query = " AND ".join(f'"{t}"' for t in terms[:6])
            try:
                cur.execute("""
                    SELECT chunk_id, source_title, source_url, page, content, bm25(tiet_chunks) AS score
                    FROM tiet_chunks
                    WHERE tiet_chunks MATCH ?
                    ORDER BY score
                    LIMIT ?
                """, (and_query, top_k))
                for r in cur.fetchall():
                    if r[0] not in seen_ids:
                        seen_ids.add(r[0])
                        rows.append(r)
            except sqlite3.OperationalError:
                pass

        # Step 2: OR match for recall
        if len(rows) < top_k:
            or_query = " OR ".join(f'"{t}"' for t in terms[:8])
            try:
                cur.execute("""
                    SELECT chunk_id, source_title, source_url, page, content, bm25(tiet_chunks) AS score
                    FROM tiet_chunks
                    WHERE tiet_chunks MATCH ?
                    ORDER BY score
                    LIMIT ?
                """, (or_query, top_k * 2))
                for r in cur.fetchall():
                    if r[0] not in seen_ids:
                        seen_ids.add(r[0])
                        rows.append(r)
                        if len(rows) >= top_k:
                            break
            except sqlite3.OperationalError:
                pass

        conn.close()

        results = []
        for r in rows:
            results.append({
                "id": r[0],
                "title": r[1],
                "url": r[2],
                "page": r[3],
                "content": r[4],
                "score": r[5]
            })
        return results

    def detect_location(self, query: str) -> Optional[int]:
        """Detect campus building mentioned in query for 2D map navigation."""
        q = query.lower()
        for loc_id, kws in LOCATION_KEYWORDS.items():
            for kw in kws:
                if kw in q:
                    return loc_id
        return None

    # ---------------------------------------------------------
    # Gemini Grounding & Prompt Assembly
    # ---------------------------------------------------------

    def query_gemini(
        self,
        question: str,
        faculty_matches: List[Dict[str, Any]],
        courses_matched: List[Dict[str, Any]],
        is_cgpa_query: bool,
        doc_chunks: List[Dict[str, Any]],
        sources_requested: bool
    ) -> str:
        """Ground answer using Gemini with strict instructions to answer directly."""
        api_key = self.api_key or self._get_gemini_api_key()

        # Build context sections
        context_parts = []

        # 1. Faculty Context
        if faculty_matches:
            fac_lines = []
            for f in faculty_matches:
                fac_lines.append(
                    f"• {f.get('name')}: {f.get('designation')}, Department of {f.get('department')}. Email: {f.get('email', 'N/A')}, Contact: {f.get('contact', 'N/A')}, Office: {f.get('office_no', 'N/A')}"
                )
            context_parts.append("VERIFIED FACULTY DIRECTORY:\n" + "\n".join(fac_lines))

        # 2. Courses & CGPA Calculator Context
        if courses_matched or is_cgpa_query:
            course_lines = []
            total_sem_credits = 0.0
            for c in courses_matched:
                credits = c.get("credits", 0)
                total_sem_credits += credits
                course_lines.append(f"• {c.get('code')} — {c.get('name')} ({credits} credits, {c.get('semester')})")

            cgpa_info = (
                "THAPAR CGPA CALCULATOR & GRADING SCALE:\n"
                "• Formula: SGPA / CGPA = (Sum of Credits × Grade Points) / Total Registered Credits\n"
                "• Grade Point Scale: A+ (10), A (10), A- (9), B (8), B- (7), C (6), C- (5), E (2), F (0)\n"
                "• Passing Grades: A+, A, A-, B, B-, C\n"
                "• Backlog / Fail Grades: E (Exposed, eligible for auxiliary exam without repeating semester), F (Fail, repeat course), X (Inadequate attendance, detained and repeat course)\n"
                "• Minimum Attendance: 75% mandatory attendance in every course (lectures, tutorials, practicals)."
            )
            courses_context = ""
            if course_lines:
                courses_context = f"OFFICIAL B.E. COMPUTER SCIENCE & ENGINEERING (CSE) CURRICULUM (From CGPA Calculator - Total Credits: {total_sem_credits:.1f}):\n" + "\n".join(course_lines)
            
            context_parts.append(f"{courses_context}\n\n{cgpa_info}".strip())

        # 3. Document Regulations Context
        if doc_chunks:
            doc_blocks = []
            for i, c in enumerate(doc_chunks, 1):
                doc_blocks.append(f"[{i}] {c['title']} (Page {c['page']}):\n{c['content']}")
            context_parts.append("OFFICIAL REGULATIONS & INSTITUTIONAL CIRCULARS:\n" + "\n\n".join(doc_blocks))

        context_text = "\n\n====================\n\n".join(context_parts)

        # Persona and strict instructions
        if sources_requested:
            citation_instruction = "The user has explicitly asked for sources/documents. State the official document name and page number at the end."
        else:
            citation_instruction = (
                "CRITICAL MANDATORY INSTRUCTION: GIVE THE DIRECT ANSWER ONLY. "
                "DO NOT mention document names, circulars, file names, or page numbers (NEVER say 'According to Academic Regulations...', 'Based on the documents...', 'Page 6 says...', etc.). "
                "State the facts directly as authoritative campus knowledge."
            )

        system_instruction = (
            "You are Athena, the official campus assistant for Thapar Institute of Engineering & Technology (TIET), Patiala. "
            "You possess authoritative knowledge of all TIET faculty members, course curricula, academic regulations, and CGPA calculation rules.\n\n"
            f"{citation_instruction}\n\n"
            "Answering Rules:\n"
            "1. Answer concisely, cleanly, and directly.\n"
            "2. When faculty or their contact details/emails are asked (e.g., 'neeraj mail', 'email of seema'), provide their full name, official designation, department, and official email address directly from the verified faculty directory. If multiple faculty share the same name, list all matching faculty members with their respective departments and email addresses.\n"
            "3. When subjects or semester courses are asked (e.g., 'What subjects in semester 3?'), list the exact course codes, subject names, and credit values directly from the curriculum without asking the user for clarification.\n"
            "4. When CGPA/SGPA is asked, provide the exact formula and the Thapar grade point table.\n"
            "5. When academic regulations are asked, state exact numbers (e.g. 75% minimum attendance requirement, 'X' grade for detention/repeat, pass grades A+ to C, fail grades E/F/X).\n"
            "6. If a specific detail is not in the knowledge base, state the known facts clearly and advise contacting the relevant office (DoAA, DoSA, or CoE) without inventing details."
        )

        user_prompt = f"Knowledge Context:\n\n{context_text}\n\nStudent Query: {question}\n\nAnswer:"

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_instruction}\n\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048,
                "thinkingConfig": {"thinkingBudget": 0}
            }
        }

        # Try high-speed active models with fallbacks
        models_to_try = [
            "gemini-3.1-flash-lite",
            "gemini-2.5-flash",
            "gemini-3-flash-preview",
            "gemini-3.1-flash-lite-preview",
        ]

        for model_name in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            for attempt in range(2):
                try:
                    resp = requests.post(url, json=payload, timeout=25)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                    elif resp.status_code == 429:
                        print(f"[TIETRAGService] {model_name} rate limit (429), trying next model...")
                        break
                    elif resp.status_code == 503:
                        print(f"[TIETRAGService] {model_name} 503 spike, trying fallback...")
                        break
                    else:
                        print(f"[TIETRAGService] {model_name} returned status {resp.status_code}: {resp.text[:200]}")
                        break
                except Exception as e:
                    print(f"[TIETRAGService] Error calling {model_name}: {e}")
                    break

        # Extractive fallback
        return self._build_direct_fallback(faculty_matches, courses_matched, is_cgpa_query, doc_chunks)

    def _build_direct_fallback(
        self,
        faculty: List[Dict[str, Any]],
        courses: List[Dict[str, Any]],
        is_cgpa: bool,
        chunks: List[Dict[str, Any]]
    ) -> str:
        """Direct answer fallback if API is unreachable."""
        if faculty:
            lines = []
            for f in faculty[:3]:
                email = f.get('email', 'N/A')
                contact = f.get('contact', 'N/A')
                contact_str = f", Contact: {contact}" if contact and contact != 'N/A' else ""
                email_str = f", Email: {email}" if email and email != 'N/A' else ""
                lines.append(
                    f"{f.get('name')} — {f.get('designation')}, Department of {f.get('department')}{email_str}{contact_str}"
                )
            return "\n".join(lines)
        if courses:
            lines = [f"{c.get('code')} — {c.get('name')} ({c.get('credits')} credits)" for c in courses[:6]]
            return "Courses:\n" + "\n".join(lines)
        if is_cgpa:
            return (
                "CGPA is calculated as: SGPA / CGPA = (Sum of Credits × Grade Points) / Total Registered Credits. "
                "Grade points: A+ (10), A (10), A- (9), B (8), B- (7), C (6), C- (5), E (2), F (0)."
            )
        if chunks:
            return chunks[0]["content"]
        return "Please contact the Dean of Academic Affairs (DoAA) or Dean of Student Affairs (DoSA) office for details."

    def answer_query(self, question: str) -> Dict[str, Any]:
        """
        Full enhanced RAG workflow:
        - Resolves faculty by name
        - Resolves semester courses and CGPA calculator data
        - Retrieves academic regulations
        - Answers directly without document clutter unless requested
        - Detects map locations
        """
        # Determine if user explicitly requested sources/documents
        q_lower = question.lower()
        sources_requested = any(kw in q_lower for kw in SOURCE_REQUEST_KEYWORDS)

        # 1. Specialized entity matching
        faculty_matches = self.match_faculty(question)
        courses_matched, is_cgpa_query = self.match_courses_and_cgpa(question)
        
        # 2. General document chunk retrieval
        doc_chunks = self.retrieve_documents(question, top_k=5)
        
        # 3. Detect campus location
        location_id = self.detect_location(question)

        # 4. Generate answer
        answer = self.query_gemini(
            question=question,
            faculty_matches=faculty_matches,
            courses_matched=courses_matched,
            is_cgpa_query=is_cgpa_query,
            doc_chunks=doc_chunks,
            sources_requested=sources_requested
        )

        # 5. Format sources ONLY if explicitly requested
        sources = []
        if sources_requested:
            seen_titles = set()
            for c in doc_chunks:
                key = f"{c['title']}_p{c['page']}"
                if key not in seen_titles:
                    seen_titles.add(key)
                    doc_type = "PDF"
                    title = c["title"]
                    if "scholarship" in title.lower() or "notice" in title.lower():
                        doc_type = "Notice"
                    elif "regulation" in title.lower() or "ordinance" in title.lower():
                        doc_type = "Circular"
                    sources.append({
                        "title": f"{c['title']} (p. {c['page']})",
                        "type": doc_type,
                        "url": c.get("url", "")
                    })
            if faculty_matches:
                sources.append({
                    "title": "TIET Faculty Directory",
                    "type": "PDF",
                    "url": "https://www.thapar.edu/faculty"
                })
            if courses_matched or is_cgpa_query:
                sources.append({
                    "title": "TIET Course Scheme & CGPA Calculator",
                    "type": "PDF",
                    "url": "https://www.thapar.edu/academics"
                })

        return {
            "answer": answer,
            "sources": sources[:4],
            "locationId": location_id
        }


# Singleton instance
_rag_service = None

def get_rag_service() -> TIETRAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = TIETRAGService()
    return _rag_service
