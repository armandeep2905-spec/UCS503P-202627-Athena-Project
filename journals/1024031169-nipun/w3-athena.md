# Week 3 — Database Implementation, PostgreSQL Migration and Project Repository

## Problem / Challenge

The main technical task during this week was implementing the database planned during the previous week.

Initially, we wanted a simple way to create and test the database without setting up a complete database server environment. Therefore, SQLite was selected for the initial implementation.

However, after creating and testing the database structure, we decided to migrate the database to PostgreSQL so that the project could use a more suitable relational database system for further development.

A second challenge was organizing the project files and documentation in a Git repository according to the required project structure.

## Relevant Context

The initial database was implemented using SQLite.
The database relationships were implemented using primary keys and foreign keys.

## Key Observation

SQLite was useful for quickly creating and validating the initial schema because it does not require a separate database server.

However, for continued development, PostgreSQL provides a more appropriate environment for a multi-component application with structured relational data.

Therefore, the database was migrated from SQLite to PostgreSQL.

## Solution

The database was first created and tested using SQLite.
After validating the schema, the database structure was converted to PostgreSQL.

The migration process involved:
```text
Database Design
      ↓
SQLite Implementation
      ↓
Schema Testing
      ↓
PostgreSQL Conversion
      ↓
PostgreSQL Database
```
The relational structure and foreign-key relationships were retained during the migration.

## Git Repository Setup

A Git repository was also created for the Athena project.

The repository was organized into directories for:
```text
Athena/
│
├── assets/
├── code/
├── docs/
├── journals/
├── project-proposal/
├── project-report-prototype-stage/
├── project-report-final/
├── README.md
└── .gitignore
```
The project documentation and LaTeX files were added to the repository.

## Problems Faced
1. SQLite to PostgreSQL Migration

The initial database was created in SQLite, but the project later required PostgreSQL.
This required checking the database schema and ensuring that tables, relationships and data types were compatible with PostgreSQL.

2. Git Push Rejection

While pushing the project to GitHub, the following error was encountered:
```text
! [rejected] main -> main (fetch first)
```

error: failed to push some refs to the remote repository

The issue occurred because the remote repository already contained commits that were not present in the local repository.
The local repository therefore had to synchronize with the remote repository before pushing the local changes.

The general workflow was:
```text
Local Repository
       +
Remote Repository
       ↓
Pull / Synchronize
       ↓
Resolve conflicts if required
       ↓
Commit
       ↓
Push
```
3. Project Documentation Organisation

Another challenge was maintaining the required project structure while adding reports, journals, documentation and source code.
The directory structure was therefore organized before adding the remaining project files.

## Work Completed
1. Implemented the initial Athena database using SQLite.
2. Tested the relational database structure.
3. Converted the database to PostgreSQL.
4. Created the Athena GitHub repository.
5. Organized the repository into project-specific directories.
6. Created the project LaTeX documentation.
7. Added project documentation to the repository.
8. Uploaded relevant project files to the required storage/repository locations.
9. Started work on a 2D campus navigation map.

## Next Step

The immediate next step is to continue developing the 2D campus map.

Planned work includes:
1. Adding campus locations and their coordinates.
2. Representing connections between locations as a graph.
3. Implementing route calculation.
4. Displaying the calculated route on the map.
5. Testing routes between different campus locations.
6. Later extending the navigation system toward a 3D campus representation.
