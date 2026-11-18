WEEK 6 — DATA SCRAPING, DATABASE INTEGRATION & RAG SEARCH PIPELINE

TASKS ACHIEVED

1. Web Scraping & Campus Data Extraction
   • Extracted comprehensive academic and institutional data from official
     Thapar Institute (TIET) web pages and circular portals:
     - 478 faculty profiles across 7 engineering departments (CSED, ECED,
       EIED, MED, CED, CHED, BTD), scraping names, designations, departments,
       official emails, and campus offices.
     - 102 curriculum courses covering 8 semesters with subject codes,
       titles, credit weights, lecture/lab tracks, and official syllabus PDF URLs.
     - Over 200 institutional PDF circulars, scholarship rules, academic
       regulations, and grading ordinances parsed into 7,594 structured text chunks.

2. Database Schema Expansion & PostgreSQL Migration
   • Shifted data storage from raw CSV/JSON files into the live Neon PostgreSQL
     cloud database.
   • Created and applied Django migrations:
     - Course model updated with credits, semester, and syllabus_link.
     - New Faculty model created with department relations and contact fields.
   • Developed a bulk-loading utility (load_all_data.py) using psycopg2
     execute_batch for rapid atomic ingestion.

3. Live Database REST API Endpoints
   • Registered CourseViewSet and FacultyViewSet under /api/courses/ and
     /api/faculty/.
   • Disabled default DRF pagination (pagination_class = None) so the full
     catalogs (102 courses, 474+ faculty) load in a single fast query.
   • Configured CORS and serializers to expose camelCase fields for seamless
     frontend consumption.

4. SQLite FTS5 Knowledge Base Search Index
   • Indexed 8,072 text chunks into a local SQLite FTS5 full-text search
     database (tiet_kb_fts.db).
   • Implemented BM25 document ranking with tokenized search for sub-second
     retrieval of official TIET policies and notices.

5. Database-First RAG Service
   • Re-architected TIETRAGService in rag_service.py to load faculty and
     courses directly from live PostgreSQL at startup.
   • Kept small JSON files solely as offline fallbacks, ensuring database
     edits (such as newly added emails) reflect directly in the RAG pipeline.


PROBLEMS / DIFFICULTIES FACED

1. DRF Pagination Restricting Frontend Data
   • Initially, /api/faculty/ and /api/courses/ only returned 20 records
     because Django REST Framework applies PAGE_SIZE=20 by default.
   • The frontend expected the complete directory array, causing empty screens.
   • Solution: Explicitly set pagination_class = None on both viewsets to
     return the complete datasets.

2. Migration Conflicts on Pre-existing Columns
   • When creating migration 0002 for course credits and semester, PostgreSQL
     threw DuplicateColumn errors because columns had already been created.
   • Solution: Used python manage.py migrate --fake for migration 0002,
     then created a clean migration 0003 for the Faculty table.

3. RAG Service Static Fallback Shadowing Live DB
   • The AI chatbot was unable to fetch newly updated faculty emails because
     the RAG service loaded static fallback files first, ignoring the live DB.
   • Solution: Flipped the loading order in _load_structured_data() to query
     PostgreSQL core_faculty and core_course first, using files only if the DB
     is unreachable.


FINAL OUTCOME

• All scraped TIET data (478 faculty, 102 courses) successfully migrated
  to PostgreSQL.
• Fast DRF endpoints established returning full catalogs without crashes.
• 8,072 regulation chunks indexed in SQLite FTS5 for AI search.
• Grounded RAG backend reads live database records as its primary source.
