# Week 7 — Faculty Database Updates & Campus Map Integration

## Overview

In Week 7, my focus was on two major milestones: updating teacher and faculty emails in the database to ensure complete contact coverage, and integrating the interactive campus navigation map directly into the Athena website.

## Tasks Achieved

1. **Added and Updated Teacher Emails in Database:**
   - Wrote and executed SQL migration scripts to update and backfill official faculty contact details in the Neon PostgreSQL database:
     - `fill_missing_core_faculty_emails.sql`: Populated missing official `@thapar.edu` email addresses for faculty members across departments (CSED, ECED, Basic Sciences).
     - `update_existing_core_faculty_emails.sql`: Updated existing faculty records to synchronize cabin room numbers, designations (Assistant Professor, Associate Professor, Head of Department), and academic departments.
   - Verified through queries that all teachers in the database have verified `@thapar.edu` email addresses and accurate room allocations.

2. **Integrated Campus Navigation Map into the Website:**
   - Integrated the interactive campus navigation map directly into the React web application:
     - Created a new page component `NavigationPage.jsx` under `src/pages/`, embedding the campus map engine via an interactive viewport.
     - Registered the protected route `/navigation` in `App.jsx` so students can navigate the campus from within Athena.
     - Added a dedicated "Campus Navigation" navigation tile on the main `DashboardPage.jsx` with quick-access routing.
     - Updated building popups (`BuildingPopup.jsx`) with a "Navigate Here" action button that deep-links directly into the navigation map with the destination pre-selected.

3. **Cloud Database Query & Connection Stability:**
   - Tested faculty queries and database retrieval against Neon cloud PostgreSQL.
   - Handled connection latency so that student queries for teacher emails, building locations, and societies load reliably without connection drops.

## Problems Faced

### 1. Incomplete Faculty Records and Missing Emails

```text
Teacher: Dr. ABC
Email: NULL
Office: "TBA"
```

Several faculty profiles in the database had missing or outdated email addresses, meaning students using Athena could not find verified contact details for their course instructors.

**Solution:** Authored SQL update scripts to systematically populate and verify all teacher emails with their official `@thapar.edu` institutional addresses.

### 2. Map Integration and Seamless Website Routing

The campus map existed as a standalone component that needed to be integrated into the Athena web interface without breaking the existing layout or user session.

**Solution:** Embedded the map cleanly inside `NavigationPage.jsx` wrapped in the application layout, added the navigation hub tile to the dashboard, and enabled deep-linking from building popups directly to the map.

## Learning Outcomes

- Gained practical experience writing and running SQL data-migration scripts to update live cloud database records.
- Learned how to embed and deep-link interactive map tools within a React single-page application.
- Successfully connected faculty data and campus map navigation to deliver a complete, practical campus assistant.
