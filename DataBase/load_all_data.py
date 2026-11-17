#!/usr/bin/env python3
"""
Athena Unified Data Loader
===========================
Uploads all CSV and JSON data into PostgreSQL (Neon DB).
Populates:
  1. Institution (Thapar Institute of Engineering & Technology)
  2. Departments (CSED, ECED, EIED, MED, CED, CHED, BTD)
  3. Courses / Subjects (102 courses from tiet_courses_cgpa.json)
  4. Campus Buildings, Floors, & Rooms (from buildings.json with coordinates)
  5. Events (from events.json)
  6. Student Societies (from societies.json)
  7. Knowledge Documents (from ThaparInfo/tiet_pdfs)

Run from project root:
  ./.venv/bin/python DataBase/load_all_data.py
"""

import os
import re
import json
import psycopg2
from psycopg2.extras import execute_batch
from pathlib import Path
from dotenv import load_dotenv

# Resolve paths
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
THAPAR_INFO_DIR = PROJECT_ROOT / "ThaparInfo"
MOCKS_DIR = PROJECT_ROOT / "code" / "frontend" / "src" / "mocks"

# Load environment
load_dotenv(PROJECT_ROOT / "code" / "backend" / ".env")
load_dotenv(BASE_DIR / ".env")

db_url = os.getenv("DATABASE_URL")
if not db_url:
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    dbname = os.getenv("DB_NAME", "athena")
    user = os.getenv("DB_USER", "athena")
    password = os.getenv("DB_PASSWORD", "athena")
    db_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}?sslmode=require"

print(f"Connecting to PostgreSQL database...")
conn = psycopg2.connect(db_url)
conn.autocommit = False
cur = conn.cursor()

try:
    # -------------------------------------------------------------
    # 1. INSTITUTION
    # -------------------------------------------------------------
    print("\n[1/7] Syncing Institution (Thapar)...")
    inst_name = "Thapar Institute of Engineering & Technology"
    inst_domain = "thapar.edu"
    inst_addr = "Patiala, Punjab, India"

    # Raw SQL table
    cur.execute("""
        INSERT INTO institutions (institution_id, name, email_domain, address)
        VALUES (1, %s, %s, %s)
        ON CONFLICT (institution_id) DO UPDATE SET
            name = EXCLUDED.name,
            email_domain = EXCLUDED.email_domain,
            address = EXCLUDED.address;
    """, (inst_name, inst_domain, inst_addr))

    # Django ORM table
    cur.execute("""
        INSERT INTO core_institution (id, name, email_domain, address)
        VALUES (1, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email_domain = EXCLUDED.email_domain,
            address = EXCLUDED.address;
    """, (inst_name, inst_domain, inst_addr))
    conn.commit()
    print("  ✓ Institution synced.")

    # -------------------------------------------------------------
    # 2. DEPARTMENTS
    # -------------------------------------------------------------
    print("\n[2/7] Ingesting Departments...")
    departments = [
        ("Computer Science & Engineering", "CSED"),
        ("Electronics & Communication Engineering", "ECED"),
        ("Electrical & Instrumentation Engineering", "EIED"),
        ("Mechanical Engineering", "MED"),
        ("Civil Engineering", "CED"),
        ("Chemical Engineering", "CHED"),
        ("Biotechnology", "BTD"),
    ]

    dept_map = {}
    for idx, (dept_name, dept_code) in enumerate(departments, 1):
        cur.execute("""
            INSERT INTO departments (department_id, institution_id, department_name)
            VALUES (%s, 1, %s)
            ON CONFLICT (department_id) DO UPDATE SET department_name = EXCLUDED.department_name;
        """, (idx, dept_name))

        cur.execute("""
            INSERT INTO core_department (id, institution_id, department_name)
            VALUES (%s, 1, %s)
            ON CONFLICT (id) DO UPDATE SET department_name = EXCLUDED.department_name;
        """, (idx, dept_name))

        dept_map[dept_code] = idx
        dept_map[dept_name] = idx

    conn.commit()
    print(f"  ✓ {len(departments)} departments synced.")

    # -------------------------------------------------------------
    # 3. COURSES / SUBJECTS (With credits, semester & syllabus)
    # -------------------------------------------------------------
    print("\n[3/8] Ingesting Subjects from tiet_courses_cgpa.json...")
    courses_file = THAPAR_INFO_DIR / "tiet_courses_cgpa.json"
    if not courses_file.exists():
        courses_file = MOCKS_DIR / "courses.json"

    if courses_file.exists():
        with open(courses_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            courses_list = data if isinstance(data, list) else data.get("results", [])

            core_rows = []
            raw_rows = []
            for idx, c in enumerate(courses_list, 1):
                code = c.get("code", "") or c.get("course_code", "")
                name = c.get("name", "") or c.get("course_name", "")
                credits = c.get("credits")
                semester = c.get("semester") or c.get("faculty")
                syllabus_link = c.get("syllabusLink") or "https://www.thapar.edu/upload/files/BECSE_2024.pdf"
                
                # Assign department
                dept_id = dept_map.get("CSED", 1)
                if code.startswith("UEE") or code.startswith("UEI"):
                    dept_id = dept_map.get("EIED", 1)
                elif code.startswith("UEC"):
                    dept_id = dept_map.get("ECED", 1)
                elif code.startswith("UME"):
                    dept_id = dept_map.get("MED", 1)
                elif code.startswith("UCE"):
                    dept_id = dept_map.get("CED", 1)
                elif code.startswith("UCH"):
                    dept_id = dept_map.get("CHED", 1)
                elif code.startswith("UBT"):
                    dept_id = dept_map.get("BTD", 1)

                raw_rows.append((idx, dept_id, code, name))
                core_rows.append((idx, dept_id, code, name, credits, semester, syllabus_link))

            execute_batch(cur, """
                INSERT INTO courses (course_id, department_id, course_code, course_name)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (course_id) DO UPDATE SET
                    department_id = EXCLUDED.department_id,
                    course_code = EXCLUDED.course_code,
                    course_name = EXCLUDED.course_name;
            """, raw_rows, page_size=100)

            execute_batch(cur, """
                INSERT INTO core_course (id, department_id, course_code, course_name, credits, semester, syllabus_link)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    department_id = EXCLUDED.department_id,
                    course_code = EXCLUDED.course_code,
                    course_name = EXCLUDED.course_name,
                    credits = EXCLUDED.credits,
                    semester = EXCLUDED.semester,
                    syllabus_link = EXCLUDED.syllabus_link;
            """, core_rows, page_size=100)

        conn.commit()
        print(f"  ✓ {len(core_rows)} subjects ingested into PostgreSQL.")

    # -------------------------------------------------------------
    # 4. FACULTY DIRECTORY (All 478 faculty members)
    # -------------------------------------------------------------
    print("\n[4/8] Ingesting 478 Faculty Members from faculty.json...")
    faculty_file = THAPAR_INFO_DIR / "faculty.json"
    if faculty_file.exists():
        with open(faculty_file, "r", encoding="utf-8") as f:
            fac_list = json.load(f)

        fac_rows = []
        for idx, fac in enumerate(fac_list, 1):
            name = fac.get("name", "")
            designation = fac.get("designation", "")
            dept_code = fac.get("department", "CSED")
            dept_id = dept_map.get(dept_code, 1)
            email = fac.get("email") or ""
            contact = fac.get("contact") or fac.get("email") or ""
            office = fac.get("office_no") or fac.get("office") or ""
            fac_rows.append((idx, dept_id, name, designation, email, contact, office))

        execute_batch(cur, """
            INSERT INTO core_faculty (id, department_id, name, designation, email, contact, office)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                department_id = EXCLUDED.department_id,
                name = EXCLUDED.name,
                designation = EXCLUDED.designation,
                email = EXCLUDED.email,
                contact = EXCLUDED.contact,
                office = EXCLUDED.office;
        """, fac_rows, page_size=100)

        conn.commit()
        print(f"  ✓ {len(fac_rows)} faculty members ingested into PostgreSQL.")

    # -------------------------------------------------------------
    # 4. CAMPUS BUILDINGS, FLOORS & ROOMS (2D Navigation)
    # -------------------------------------------------------------
    print("\n[4/7] Ingesting Campus Buildings & Coordinates...")
    buildings_file = MOCKS_DIR / "buildings.json"
    if buildings_file.exists():
        with open(buildings_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            buildings = data.get("results", [])

            room_idx = 1
            floor_idx = 1
            for b in buildings:
                b_id = b["id"]
                b_name = b["name"]
                coords = b.get("coordinates", {})
                x_coord = coords.get("x", 50.0)
                y_coord = coords.get("y", 50.0)

                cur.execute("""
                    INSERT INTO buildings (building_id, institution_id, building_name)
                    VALUES (%s, 1, %s)
                    ON CONFLICT (building_id) DO UPDATE SET building_name = EXCLUDED.building_name;
                """, (b_id, b_name))

                cur.execute("""
                    INSERT INTO core_building (id, institution_id, building_name)
                    VALUES (%s, 1, %s)
                    ON CONFLICT (id) DO UPDATE SET building_name = EXCLUDED.building_name;
                """, (b_id, b_name))

                # Insert standard floors & rooms
                for f_num in [0, 1, 2]:
                    cur.execute("""
                        INSERT INTO floors (floor_id, building_id, floor_number)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (floor_id) DO UPDATE SET floor_number = EXCLUDED.floor_number;
                    """, (floor_idx, b_id, f_num))

                    cur.execute("""
                        INSERT INTO core_floor (id, building_id, floor_number)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET floor_number = EXCLUDED.floor_number;
                    """, (floor_idx, b_id, f_num))

                    # Room
                    room_num = f"{f_num}01" if f_num > 0 else "G01"
                    cur.execute("""
                        INSERT INTO rooms (room_id, floor_id, room_number, room_name, room_type, x_coordinate, y_coordinate, z_coordinate)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (room_id) DO UPDATE SET
                            room_name = EXCLUDED.room_name,
                            x_coordinate = EXCLUDED.x_coordinate,
                            y_coordinate = EXCLUDED.y_coordinate;
                    """, (room_idx, floor_idx, room_num, f"{b_name} Room {room_num}", "Facility", x_coord, y_coord, 0.0))

                    cur.execute("""
                        INSERT INTO core_room (id, floor_id, room_number, room_name, room_type, x_coordinate, y_coordinate, z_coordinate)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            room_name = EXCLUDED.room_name,
                            x_coordinate = EXCLUDED.x_coordinate,
                            y_coordinate = EXCLUDED.y_coordinate;
                    """, (room_idx, floor_idx, room_num, f"{b_name} Room {room_num}", "Facility", x_coord, y_coord, 0.0))

                    floor_idx += 1
                    room_idx += 1

        conn.commit()
        print(f"  ✓ {len(buildings)} buildings with floors & coordinates ingested.")

    # -------------------------------------------------------------
    # 5. EVENTS
    # -------------------------------------------------------------
    print("\n[5/7] Ingesting Campus Events...")
    events_file = MOCKS_DIR / "events.json"
    if events_file.exists():
        with open(events_file, "r", encoding="utf-8") as f:
            events = json.load(f).get("results", [])
            for e in events:
                e_id = e["id"]
                cur.execute("""
                    INSERT INTO events (event_id, institution_id, event_name, event_date, location)
                    VALUES (%s, 1, %s, %s, %s)
                    ON CONFLICT (event_id) DO UPDATE SET
                        event_name = EXCLUDED.event_name,
                        event_date = EXCLUDED.event_date,
                        location = EXCLUDED.location;
                """, (e_id, e["title"], e.get("date", "2026-09-20"), e.get("location", "Main Auditorium")))

                cur.execute("""
                    INSERT INTO core_event (id, institution_id, event_name, event_date, location)
                    VALUES (%s, 1, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        event_name = EXCLUDED.event_name,
                        event_date = EXCLUDED.event_date,
                        location = EXCLUDED.location;
                """, (e_id, e["title"], e.get("date", "2026-09-20"), e.get("location", "Main Auditorium")))

        conn.commit()
        print(f"  ✓ {len(events)} events ingested.")

    # -------------------------------------------------------------
    # 6. SOCIETIES
    # -------------------------------------------------------------
    print("\n[6/7] Ingesting Student Societies...")
    societies_file = MOCKS_DIR / "societies.json"
    if societies_file.exists():
        with open(societies_file, "r", encoding="utf-8") as f:
            socs = json.load(f).get("results", [])
            for s in socs:
                s_id = s["id"]
                cur.execute("""
                    INSERT INTO societies (society_id, institution_id, society_name, description, faculty_coordinator)
                    VALUES (%s, 1, %s, %s, %s)
                    ON CONFLICT (society_id) DO UPDATE SET
                        society_name = EXCLUDED.society_name,
                        description = EXCLUDED.description,
                        faculty_coordinator = EXCLUDED.faculty_coordinator;
                """, (s_id, s["name"], s.get("description", ""), s.get("lead", "Faculty Advisor")))

                cur.execute("""
                    INSERT INTO core_society (id, institution_id, society_name, description, faculty_coordinator)
                    VALUES (%s, 1, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        society_name = EXCLUDED.society_name,
                        description = EXCLUDED.description,
                        faculty_coordinator = EXCLUDED.faculty_coordinator;
                """, (s_id, s["name"], s.get("description", ""), s.get("lead", "Faculty Advisor")))

        conn.commit()
        print(f"  ✓ {len(socs)} student societies ingested.")

    # -------------------------------------------------------------
    # 7. KNOWLEDGE DOCUMENTS (Official PDFs)
    # -------------------------------------------------------------
    print("\n[7/7] Registering Knowledge Documents...")
    pdfs_dir = THAPAR_INFO_DIR / "tiet_pdfs"
    doc_count = 0
    if pdfs_dir.exists():
        pdf_files = sorted(list(pdfs_dir.glob("*.pdf")))
        for idx, pdf in enumerate(pdf_files, 1):
            clean_title = pdf.stem.replace("_", " ")
            file_url = f"https://www.thapar.edu/upload/files/{pdf.name}"

            cur.execute("""
                INSERT INTO knowledge_documents (document_id, institution_id, title, file_path)
                VALUES (%s, 1, %s, %s)
                ON CONFLICT (document_id) DO UPDATE SET
                    title = EXCLUDED.title,
                    file_path = EXCLUDED.file_path;
            """, (idx, clean_title, file_url))

            cur.execute("""
                INSERT INTO core_knowledgedocument (id, institution_id, title, file_path, uploaded_at)
                VALUES (%s, 1, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    file_path = EXCLUDED.file_path;
            """, (idx, clean_title, file_url))
            doc_count += 1

        conn.commit()
        print(f"  ✓ {doc_count} official knowledge documents registered.")

    print("\n==========================================")
    print("All JSON and CSV data successfully uploaded to PostgreSQL!")
    print("==========================================")

except Exception as err:
    conn.rollback()
    print(f"\n❌ Error uploading data: {err}")
    raise
finally:
    cur.close()
    conn.close()
