WEEK 7 — AI CHATBOT TUNING, REPOSITORY CLEANUP & UI UNSLOPPING

TASKS ACHIEVED

1. Chatbot Informal Query & Entity Resolution Fix
   • Fixed issue where informal shorthand queries like "neeraj mail" returned
     "no email listed" because the entity matcher required exact full names.
   • Upgraded match_faculty() in rag_service.py to recognize:
     - Single/first-name queries (e.g. "neeraj", "seema", "shalini").
     - Intent keywords: "mail", "email", "contact", "phone", "office", "id".
   • Updated Gemini system instructions to always output verified emails and
     disambiguate multiple professors sharing a common name.

2. Gemini Model Latency & Fallback Optimization
   • Identified that the RAG service was attempting a rate-limited preview model
     first, sleeping 2 seconds on 429 status codes and taking ~19s per response.
   • Reordered active production models:
     1. gemini-3.1-flash-lite (~1.2s response time)
     2. gemini-2.5-flash (~1.3s response time)
   • Set 429 errors to skip to the next model instantly without sleeping.
   • Response times dropped from ~19s to 3–8s.

3. Repository Optimization & Heavy File Removal
   • Deleted 214 raw scraped PDF files (428 MB) from ThaparInfo/tiet_pdfs/.
   • Their text was already extracted into JSONL and indexed into SQLite FTS5,
     making the raw PDFs dead weight.
   • Reduced total project size from 1.1 GB to 703 MB.
   • Production frontend bundle reduced to 346 KB JS / 27 KB CSS.

4. UI Unslopping & Collegiate Design System via Skills Repo (9 Passes)
   • Integrated and utilized the specialized unslop skill from the agents skills
     Git repository to systematically audit and overhaul the frontend interface:
     - Spacing: Standardized strictly on a 4px grid (16px headers, 20px cards).
     - Color: Swapped generic blue/gold pastel pills for a warm archival paper
       palette (#f8f7f4 light / #121316 dark) with collegiate red-brick accent
       (#991b1b / #ef4444).
     - Typography: Configured Inter with tabular numerals (tnum) for credits,
       GPAs, dates, and course codes; converted shouty uppercase labels to
       sentence case.
     - Icons: Removed all emojis from interface chips (such as 📄, 📌, 📋);
       unified line icons at 16px / 1.75 stroke.
     - Layout: Redesigned landing page into an asymmetric split hero with a live
       curriculum ledger preview.
     - Details: Applied nested radius math (12px cards, 8px inputs, 4px tags).
     - Motion: Removed hover:scale-105 transforms and bouncy animations.
     - Dock: Replaced competing floating balls with a unified collegiate dock
       (Campus Map + Ask Athena with ⌘K shortcut).

5. Automated Desktop & Mobile Browser Verification
   • Created and executed an automated Playwright verification suite testing:
     - Desktop (1440×900) and Mobile (375×812) viewports.
     - End-to-end login flow (admin@thapar.edu), dashboard, and academics ledger.
     - Live Ask Athena drawer query resolution with verified emails.
   • Confirmed zero horizontal overflow on mobile and verified all visual layouts.


PROBLEMS / DIFFICULTIES FACED

1. Achieving the Perfect Look & Eliminating AI Template Aesthetics
   • Problem: The interface had accumulated common vibecoded/AI-generated tells
     (inconsistent blue/gold pastel pills, greeting headlines, emoji chips, and
     bouncy floating action buttons). It looked like a generic starter template
     rather than a credible, scholarly university workspace. Striking the balance
     between modern minimalism and an authentic collegiate feel without making
     it look sterile was a significant design challenge.
   • Solution: Leveraged the unslop skill repository to conduct a disciplined
     redline audit and establish a clear 5-line direction ("academic, exact, calm").
     Derived the palette directly from campus materials (warm archival paper and
     Thapar red-brick terracotta) and enforced strict rules across spacing,
     typography, and nested radii to achieve a clean, cohesive, and professional
     finish.

2. Chatbot Failing on First-Name Inquiries
   • Problem: Querying "What is the email of Dr. Neeraj Kumar?" succeeded, but
     typing "neeraj mail" returned zero matches because the matcher only checked
     for full names or titles like "Dr." / "Prof.".
   • Solution: Enhanced the tokenizer with an intent keyword set (mail, contact,
     phone, etc.) and enabled first-name matching against the faculty registry.

3. Vite PostCSS Build Error (EPERM Sandbox Check)
   • Problem: During dev server launch and build, Vite's PostCSS/browserslist
     attempted to inspect /Users/arman/package.json, triggering an EPERM error.
   • Solution: Added a local "browserslist" configuration to code/frontend/package.json
     so browserslist resolves within the frontend root and never climbs parents.

4. Process Port Collisions on Port 8000
   • Problem: Starting Django runserver occasionally failed with "port already in use"
     when background tasks held the socket.
   • Solution: Terminated lingering task processes and verified port availability
     using lsof -ti :8000.


FINAL OUTCOME

• Athena chatbot accurately resolves single-name and shorthand email queries in 3–8s.
• Project storage slimmed down by ~430 MB without loss of functionality.
• Entire application interface transformed into a cohesive, scholarly collegiate portal.
• Successfully verified across desktop and mobile viewports with zero build or runtime errors.
