# Week 4 — Django Backend Integration, ORM Models & Student Data Management

## Overview

In Week 4, development centered on integrating PostgreSQL with Django REST Framework (DRF), generating Django ORM models from the database schema, setting up the Django Admin dashboard, and scaling student data ingestion.

## Tasks Achieved

1. **Django ORM Model Mapping:**
   - Structured `code/backend/api/models.py` to map PostgreSQL tables into Python classes using Django ORM.
   - Defined model fields, relationships (`ForeignKey`, `ManyToManyField`), table names (`db_table = '...'`), and index specifications.
   - Generated and applied Django schema migrations:
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

2. **Student Entity Management & Verification Fields:**
   - Extended the student/user schema to include critical academic and authentication attributes:
     - `name`: Full student name.
     - `roll_number`: Unique institutional identifier (e.g., `1024031048`).
     - `branch`: Degree program (e.g., Computer Science & Engineering).
     - `email`: Institutional email address.
     - `is_verified`: Boolean flag indicating affiliation verification status.
   - Tested bulk data ingestion with hundreds of mock student records to evaluate query performance.

3. **Django Administration Panel Setup:**
   - Registered models in `code/backend/api/admin.py` with custom search fields and filters:
     - Search by roll number, name, and email for student records.
     - Filtering faculty by department and designation.
   - Configured administrative superuser accounts for team testing.

4. **Preparation for Cloud Database Transition:**
   - Investigated transitioning from local PostgreSQL instances (which required each teammate to manage local Docker/PostgreSQL daemons) to a centralized, serverless cloud database on Neon.
   - Began researching connection pooling and SSL connection string configurations.

## Problems Faced

### 1. Schema Drift Between Pre-Existing Tables and Django ORM

```text
django.db.utils.ProgrammingError: relation "api_student" already exists
```

Because tables were previously created using raw SQL scripts in Week 3, running Django's initial migrations attempted to recreate existing tables, resulting in collision errors.

### 2. Unicode and Case-Insensitive Search on Bulk Records

```text
Student.objects.filter(name__icontains=search_term)
```

Performing case-insensitive pattern matching on unindexed `VARCHAR` columns across large student datasets caused high query latencies.

## Solutions & Learning Outcomes

- Utilized `python manage.py migrate --fake-initial` to synchronize Django's migration history with the pre-existing database tables without dropping data.
- Added database indexes (`db_index=True`) on frequently queried columns (`roll_number`, `email`, `code`) to optimize retrieval performance.
- Mastered Django ORM relationships, `select_related` / `prefetch_related` optimizations, and configuring the Django Admin dashboard for multi-table relationships.
