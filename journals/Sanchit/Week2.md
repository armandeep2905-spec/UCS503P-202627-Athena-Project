# Week 2 — Relational Schema Planning & Database Entity Modeling

## Overview

Following the official selection of **Athena**, this week focused on designing the underlying relational database architecture. As the database lead, my goal was to establish a normalized, extensible schema to store institutional data, student accounts, departments, courses, faculty, and campus physical spaces.

## Tasks Achieved

1. **Relational Data Modeling:**
   - Designed the core institutional entity hierarchy to reflect university operations:
     $$\text{Institution} \longrightarrow \text{Department} \longrightarrow \text{Building} \longrightarrow \text{Floor} \longrightarrow \text{Room}$$
   - Established relational constraints preventing orphaned records and ensuring referential integrity via foreign keys (`ON DELETE CASCADE` / `PROTECT`).

2. **Entity & Table Specifications:**
   - Designed normalized schemas for essential tables:
     - `institutions`: Institutional metadata, domain name (`thapar.edu`), and configuration.
     - `departments`: Academic branches (e.g., CSED, ECED, MED).
     - `courses`: Course codes, titles, credit hours, and department associations.
     - `faculty`: Academic profiles, contact emails, designations, and cabin locations.
     - `students` / `users`: Names, roll numbers, branches, hashed credentials, and verification status.
     - `buildings` & `rooms`: Spatial attributes, coordinates, and functional labels.

3. **Schema Prototyping:**
   - Evaluated table schemas using an initial SQLite prototype (`college_db.db`) to quickly verify table structures and relationships.
   - Identified data type requirements and constraints needed for future PostgreSQL migration (`VARCHAR`, `TIMESTAMP WITH TIME ZONE`, `BOOLEAN`, `SERIAL PRIMARY KEY`).

4. **Git Repository Setup for Database Tracking:**
   - Configured local development environment with Git version control.
   - Set up repository forks and branch tracking to maintain database migration scripts independently.

## Problems Faced

1. **Entity Relationship Granularity:**
   - Initially, rooms were being mapped directly under institutions. During schema review, we realized a room physically belongs to a specific floor of a building. We restructured the hierarchy to `Institution → Building → Floor → Room` to prevent redundant attributes and ensure accurate spatial queries.
2. **Handling Diverse Academic Attributes:**
   - Different departments have varied designation structures and course credit formats. Ensuring the schema remained generalized without requiring sparse null columns required careful normalization.

## Solutions & Learning Outcomes

- Finalized the formal Entity-Relationship (ER) model and documented the schema specifications in the project proposal.
- Learned the importance of database normalization (1NF, 2NF, 3NF) when modeling physical campus structures and academic records.
- Established consistent naming conventions for primary keys, foreign keys, and timestamp columns across all tables.
