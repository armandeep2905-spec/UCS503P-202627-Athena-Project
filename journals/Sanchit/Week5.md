# Week 5 — Shared Neon Cloud PostgreSQL Migration & Backend Configuration

## Overview

In Week 5, the project transitioned from isolated local databases to a centralized, serverless cloud PostgreSQL database hosted on **Neon**. This ensured that all three team members (Frontend, Backend, and Navigation) operated against an identical, synchronized dataset.

## Tasks Achieved

1. **Neon Serverless PostgreSQL Provisioning:**
   - Created and configured the cloud database instance on Neon (`ep-hidden-hall-...neon.tech`).
   - Configured secure SSL connections with `sslmode=require` and connection pooling (`pooling=True`).
   - Updated `code/backend/.env` with the centralized connection URI:
     ```text
     DATABASE_URL=postgresql://neondb_owner:<password>@ep-hidden-hall-....neon.tech/neondb?sslmode=require
     ```

2. **Automated Cloud Schema & Data Ingestion Pipelines:**
   - Developed `DataBase/setup_neon.py` to establish the required extensions, schema tables, and primary/foreign key constraints on the remote Neon instance.
   - Authored `DataBase/load_all_data.py` to ingest the comprehensive institutional dataset across all models:
     - Institutional metadata for Thapar Institute of Engineering and Technology (`email_domain: thapar.edu`).
     - Core faculty profiles across all academic departments.
     - Course directories, syllabus URLs, and credit structures.
     - Campus building hotspots, hostels, and room coordinates.
     - Student societies, clubs, and annual festival events.

3. **Backend Migration & Superuser Setup:**
   - Executed remote schema migrations:
     ```bash
     python manage.py migrate
     ```
   - Created remote administrator credentials to verify cloud accessibility via the Django Admin Panel (`/admin/`).

4. **Integration Testing with Frontend:**
   - Verified that frontend API requests accurately retrieved live cloud records through the DRF endpoints (`/api/institutions/`, `/api/faculty/`, `/api/events/`).

## Problems Faced

### 1. Neon Cold-Start Latency & Connection Timeouts

```text
django.db.utils.OperationalError: could not connect to server: Connection timed out
Is the server running on host "ep-hidden-hall-....neon.tech" and accepting
TCP/IP connections on port 5432?
```

Because Neon uses serverless compute instances that scale down to zero when idle, the initial connection (cold start) takes between 4 to 6 seconds to resume. If the backend or client had a short timeout, requests failed before the database spun up.

### 2. Missing SSL Certificate Verification in Non-SSL Clients

```text
psycopg2.OperationalError: FATAL: no pg_hba.conf entry for host, user, database, SSL off
```

Attempting to connect without explicitly specifying `sslmode=require` resulted in immediate rejection by Neon's cloud security gateway.

## Solutions & Learning Outcomes

- Configured `dj-database-url` in Django's `settings.py` with `CONN_MAX_AGE=600` to maintain persistent connection pools and minimize cold-start frequency.
- Enforced `sslmode=require` in all database connection strings across migration scripts and Django configurations.
- Transitioned the entire team to a single source of truth in the cloud, eliminating local database inconsistencies and data drift.
