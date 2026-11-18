# Week 1 — Project Ideation, Team Formation & Database Feasibility

## Overview

In the first week of the Software Engineering project, our team formed our group and evaluated multiple project domains to select a project that was technically challenging, practically useful, and feasible within our timeline.

## Tasks Achieved

1. **Team Formation:**
   - Formed our project group "The Three Stooges" consisting of:
     - Armandeep Singh Taggar (`1024030219`)
     - Sanchit Narula (`1024031048`)
     - Nipun Gupta (`1024031169`)

2. **Domain & Project Exploration:**
   - Explored potential domains including AI/ML, Web Development, Database Management, and Information Retrieval.
   - Evaluated 4 project proposals across technical complexity, learning scope, and real-world utility:
     - Project 1: Movie Recommendation System using Django and TMDB API.
     - Project 2: **Athena — AI Campus Query Bot & Institutional Companion.**
     - Project 3: Automated Attendance and Academic Tracking System.
     - Project 4: Smart Resource Booking Portal.

3. **Database & Data Architecture Feasibility Analysis:**
   - Conducted initial research on the data storage requirements for a college assistant.
   - Identified the major institutional data sources needed:
     - Academic notices, timetables, and date sheets.
     - Faculty directories (names, emails, designations, cabin numbers).
     - Campus building locations, hostels, and room numbers.
     - Student authentication and affiliation records.
   - Evaluated whether a simple relational schema would suffice or if vector embeddings/RAG pipelines would be required for unstructured document retrieval.

4. **Project Proposal Finalization:**
   - Prepared project briefs detailing problem statements, proposed technical stack, database requirements, and timeline.
   - Finalized **Athena** as our primary choice for the Software Engineering project bid.

## Problems Faced

1. **Assessing Storage Requirements:**
   - Campus information is a mix of structured data (faculty emails, room numbers, course credits) and unstructured text (handbooks, ordinances, syllabus PDFs). Deciding whether to use a NoSQL or Relational database was an initial dilemma.
2. **Balancing Scope with Deadlines:**
   - Ensuring our chosen system had a realistic database design that could be prototyped quickly without sacrificing relational integrity.

## Solutions & Learning Outcomes

- Concluded that a **hybrid approach** is optimal: a robust Relational Database (PostgreSQL) for structured institutional entities (Users, Courses, Faculty, Events, Rooms) paired with vector retrieval for semantic search.
- Learned how to analyze project feasibility from a data-first perspective, identifying key institutional entities early before writing schema definitions.
