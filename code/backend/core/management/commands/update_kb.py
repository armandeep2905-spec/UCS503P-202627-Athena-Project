import os
import re
import json
import sqlite3
from pathlib import Path
from django.core.management.base import BaseCommand
from core.rag_service import (
    FTS_DB_PATH,
    KB_JSONL_PATH,
    FACULTY_JSON_PATH,
    get_rag_service
)


class Command(BaseCommand):
    help = "Manage, rebuild, add, or remove documents in the Athena TIET Knowledge Base."

    def add_arguments(self, parser):
        parser.add_argument(
            "--rebuild",
            action="store_true",
            help="Completely rebuild FTS5 index from ThaparInfo/tiet_chatbot_knowledge_base.jsonl and faculty.json"
        )
        parser.add_argument(
            "--add-pdf",
            type=str,
            help="Path to a new PDF document to parse and ingest into the knowledge base"
        )
        parser.add_argument(
            "--title",
            type=str,
            default="",
            help="Title for the newly ingested PDF"
        )
        parser.add_argument(
            "--remove-doc",
            type=str,
            help="Remove all chunks matching this document title or filename"
        )
        parser.add_argument(
            "--stats",
            action="store_true",
            help="Show current knowledge base statistics"
        )

    def handle(self, *args, **options):
        conn = sqlite3.connect(FTS_DB_PATH)
        cur = conn.cursor()

        if options["stats"]:
            cur.execute("SELECT count(*) FROM tiet_chunks")
            total = cur.fetchone()[0]
            cur.execute("SELECT DISTINCT source_title FROM tiet_chunks LIMIT 20")
            titles = [r[0] for r in cur.fetchall()]
            self.stdout.write(self.style.SUCCESS(f"Total knowledge chunks in index: {total}"))
            self.stdout.write("Sample indexed documents:")
            for t in titles:
                self.stdout.write(f"  - {t}")
            conn.close()
            return

        if options["remove_doc"]:
            target = options["remove_doc"]
            self.stdout.write(f"Removing chunks matching: {target}...")
            cur.execute("""
                DELETE FROM tiet_chunks 
                WHERE source_title LIKE ? OR chunk_id LIKE ?
            """, (f"%{target}%", f"%{target}%"))
            deleted = conn.total_changes
            conn.commit()
            self.stdout.write(self.style.SUCCESS(f"Successfully removed {deleted} chunk(s) from knowledge base."))
            conn.close()
            return

        if options["add_pdf"]:
            pdf_path = Path(options["add_pdf"])
            if not pdf_path.exists():
                self.stderr.write(self.style.ERROR(f"File not found: {pdf_path}"))
                conn.close()
                return

            try:
                from pypdf import PdfReader
            except ImportError:
                self.stderr.write(self.style.ERROR("pypdf is required to ingest PDFs. Run: pip install pypdf"))
                conn.close()
                return

            doc_title = options["title"] or pdf_path.stem
            self.stdout.write(f"Ingesting PDF: {pdf_path.name} as '{doc_title}'...")

            reader = PdfReader(str(pdf_path))
            new_chunks = []
            safe_name = re.sub(r"[^a-zA-Z0-9_.-]", "_", pdf_path.name)

            for page_num, page in enumerate(reader.pages, 1):
                raw_text = page.extract_text() or ""
                clean_text = re.sub(r"\s+", " ", raw_text).strip()
                words = clean_text.split()
                step = 850
                for i in range(0, len(words), step):
                    chunk = " ".join(words[i:i + 1000])
                    if len(chunk) > 80:
                        new_chunks.append((
                            f"{safe_name}_p{page_num}_c{i}",
                            doc_title,
                            f"file://{pdf_path.resolve()}",
                            str(page_num),
                            chunk
                        ))

            if new_chunks:
                cur.executemany("INSERT INTO tiet_chunks VALUES (?, ?, ?, ?, ?)", new_chunks)
                conn.commit()
                self.stdout.write(self.style.SUCCESS(f"Successfully added {len(new_chunks)} chunks for '{doc_title}'."))
            else:
                self.stdout.write(self.style.WARNING("No extractable text found in PDF."))
            conn.close()
            return

        # Default action or --rebuild:
        self.stdout.write("Rebuilding full knowledge base index...")
        conn.close()
        if FTS_DB_PATH.exists():
            FTS_DB_PATH.unlink()
        service = get_rag_service()
        service._ensure_index()
        self.stdout.write(self.style.SUCCESS("Knowledge base rebuild complete!"))
