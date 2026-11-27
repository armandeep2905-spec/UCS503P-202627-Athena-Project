import re
import pandas as pd
import psycopg2
from collections import defaultdict
from psycopg2.extras import execute_values

# ---- edit these ----
DB_URL = "postgresql://neondb_owner:npg_WG1ZRLmS3cnw@ep-hidden-hall-b4wll3gz-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
CSV_FILE = "faculty_departments.csv"
DRY_RUN = False        # set False to commit
# --------------------

# CSV department -> core_faculty.department_id (taken from your table dump)
DEPT_ID = {
    "Department of Computer Science & Engineering": 1,
    "Department of Electronics & Communication Engineering": 2,
    "Department of Electrical & Instrumentation Engineering": 3,
    "Department of Civil Engineering": 5,
    "Department of Chemical Engineering": 6,
    "Department of Biotechnology": 7,
}


def norm(s):
    s = str(s).lower()
    s = re.sub(r"\b(dr|prof|professor|mr|mrs|ms|miss)\b\.?", " ", s)
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def missing(v):
    return v is None or str(v).strip() == "" or str(v).strip().lower() in ("n/a", "nan")


# ---- load CSV, group by (department_id, normalized name), keep site order ----
df = pd.read_csv("DataBase/faculty_departments.csv")
df["dept_id"] = df["department"].map(DEPT_ID)
df = df.dropna(subset=["dept_id"])
df["key"] = df["professor"].map(norm)

csv_groups = defaultdict(list)
for r in df.itertuples():
    email = str(r.email).strip().lower() if isinstance(r.email, str) and "@" in r.email else None
    spec = str(r.specialization).strip() if isinstance(r.specialization, str) and r.specialization.strip() else None
    csv_groups[(int(r.dept_id), r.key)].append((email, spec))

conn = psycopg2.connect(DB_URL)
try:
    with conn.cursor() as cur:
        cur.execute('SELECT id, name, email, "Specialization", department_id FROM core_faculty ORDER BY id')
        db_rows = cur.fetchall()

        db_groups = defaultdict(list)
        for row in db_rows:
            db_groups[(row[4], norm(row[1]))].append(row)

        updates, unmatched = [], []
        n_email = n_spec = 0

        for key, rows in db_groups.items():
            cands = csv_groups.get(key)
            # pair duplicates by order of appearance; skip if counts disagree
            if not cands or len(cands) != len(rows):
                if key[0] in DEPT_ID.values():
                    unmatched += [(r[0], r[1], r[4]) for r in rows]
                continue
            for (fid, name, db_email, db_spec, _), (c_email, c_spec) in zip(rows, cands):
                new_email = c_email if (missing(db_email) and c_email) else None
                new_spec = c_spec if (missing(db_spec) and c_spec) else None
                if new_email or new_spec:
                    updates.append((fid, new_email, new_spec))
                    n_email += bool(new_email)
                    n_spec += bool(new_spec)

        print(f"{len(db_rows)} DB rows | {len(updates)} rows to update "
              f"({n_email} emails, {n_spec} specializations) | {len(unmatched)} unmatched")

        if updates:
            execute_values(cur, """
                UPDATE core_faculty f
                   SET email            = COALESCE(v.email, f.email),
                       "Specialization" = COALESCE(v.spec,  f."Specialization")
                  FROM (VALUES %s) AS v(id, email, spec)
                 WHERE f.id = v.id
            """, updates, template="(%s::bigint, %s::text, %s::text)")

        # fill the text "Department" column from core_department (assumes columns: id, name)
        cur.execute("""
            UPDATE core_faculty f
               SET "Department" = d.department_name
              FROM core_department d
             WHERE d.id = f.department_id
               AND (f."Department" IS NULL OR trim(f."Department") = '' OR upper(f."Department") = 'N/A')
        """)
        print(f"{cur.rowcount} Department values filled")

        if unmatched:
            pd.DataFrame(unmatched, columns=["id", "name", "department_id"]).to_csv(
                "unmatched_faculty.csv", index=False)

    if DRY_RUN:
        conn.rollback()
        print("DRY RUN: rolled back, nothing changed")
    else:
        conn.commit()
        print("Committed")
finally:
    conn.close()