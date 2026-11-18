# Week 3 — Local Database Implementation & SQLite to PostgreSQL Migration

## Overview

During Week 3, the focus shifted to implementing the physical database, creating automated data migration scripts, and migrating our initial SQLite schema to a production-grade local PostgreSQL database (`college_db`).

## Tasks Achieved

1. **Local PostgreSQL Database Setup:**
   - Established the local PostgreSQL database server and created the `college_db` database for the project.
   - Adapted SQL DDL definitions from SQLite syntax to PostgreSQL standard types (`SERIAL PRIMARY KEY`, `VARCHAR`, `TIMESTAMP`, `BOOLEAN`).

2. **Automated Database Creation & Seeding Scripts:**
   - Authored the automated creation script `DataBase/create_database.py` to instantiate the schema programmatically.
   - Created data population scripts (`DataBase/insert_data.py`) to seed initial records for Thapar Institute of Engineering and Technology (departments, faculty profiles, building blocks).

3. **Backend Database Driver Configuration:**
   - Configured Python database adapters (`psycopg2-binary`) to establish connectivity between the Django backend and PostgreSQL.
   - Configured `settings.py` database dictionary with `ENGINE: 'django.db.backends.postgresql'`, host, port (`5432`), user, and credentials.

4. **CRUD Operation Verification:**
   - Executed queries to verify insertion, retrieval, and relational integrity.
   - Verified that querying a faculty member correctly retrieved their corresponding department details through foreign key joins.

## Problems Faced

### 1. SQLite Foreign Key Enforcement vs PostgreSQL Strictness

```text
psycopg2.errors.ForeignKeyViolation: insert or update on table "faculty" 
violates foreign key constraint "faculty_department_id_fkey"
DETAIL:  Key (department_id)=(10) is not present in table "departments".
```

While SQLite permitted inserting records with loose foreign keys when foreign key constraints were not explicitly enabled, PostgreSQL strictly rejected them. We had to ensure seeding scripts followed a strict topological order (inserting parent records like `institutions` and `departments` before child records like `faculty` and `courses`).

### 2. Local Database Connection Authentication

```text
django.db.utils.OperationalError: connection to server at "127.0.0.1", port 5432 failed: 
FATAL: password authentication failed for user "postgres"
```

Differences in local PostgreSQL authentication methods (`ident` vs `md5` / `scram-sha-256`) in `pg_hba.conf` caused initial connection rejections from Django.

## Solutions & Learning Outcomes

- Configured a dedicated database role with explicit privileges for `college_db`.
- Standardized the database seeding workflow by enforcing an ordered insertion pipeline in `create_database.py` and `insert_data.py`.
- Gained hands-on experience in database migration, SQL syntax differences, and configuring Django database engines for PostgreSQL.
