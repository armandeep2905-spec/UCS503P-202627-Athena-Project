# Week 6 — Institutional Domain Restriction (@thapar.edu) & Societies Database Population

## Overview

In Week 6, my work focused on securing student authentication by strictly enforcing the institutional `@thapar.edu` email domain, populating the database with detailed campus societies and descriptions, and adding additional core campus records into the database.

## Tasks Achieved

1. **Strict @thapar.edu Domain Restriction for Registration & Login:**
   - Enforced a strict institutional email policy across both the frontend and backend:
     - **Backend Validation:** Updated `code/backend/api/serializers.py` in `RegisterSerializer.validate_email()` to reject any registration attempt using non-Thapar domains:
       ```python
       def validate_email(self, value):
           target_domain = 'thapar.edu'
           if not value.lower().endswith(f'@{target_domain}'):
               raise serializers.ValidationError(
                   f"Registration restricted to @{target_domain} addresses."
               )
           return value.lower()
       ```
     - **Frontend Enforcement:** Updated the institution selection and registration pages (`InstitutionSelectPage.jsx`, `RegisterPage.jsx`, and `auth.js`) so that email verification strictly requires and validates the `@thapar.edu` domain before allowing a user to proceed.

2. **Added Societies and Descriptions to Database:**
   - Populated the database with verified Thapar student societies, technical chapters, and cultural clubs (e.g., ACM, IEEE, OWASP, Rotaract, Mudra, CCS).
   - Added comprehensive descriptions, category tags (Technical, Cultural, Social, Sports), and contact details for each society.
   - Resolved field mapping discrepancies between database schema definitions (`society_name`, `event_name`) and API serializers so that society cards and event details load seamlessly on the website.

3. **Database Records Expansion:**
   - Added additional campus records to the database, including upcoming university events, registration deadlines, and academic reminders.
   - Verified that newly inserted records properly link to existing institutions and categories through foreign key relationships.

## Problems Faced

### 1. Registration Allowed Arbitrary Email Domains

```text
Input: student@gmail.com
Status: Permitted (Issue)
```

The registration form and API initially accepted any generic email address (such as `@gmail.com` or `@yahoo.com`). Since Athena is an institutional platform for Thapar University, this allowed unauthorized users to register.

**Solution:** Added validation checks on both the client side and inside Django REST Framework serializers to restrict registration exclusively to `@thapar.edu`.

### 2. Missing Society Data and Loading Failures

When opening the Societies & Events section, some society entries lacked descriptions or had field name mismatches between `society_name` and `name`, causing cards to fail rendering.

**Solution:** Populated complete descriptions for all societies in the database and added field normalization so society names and descriptions render correctly.

## Learning Outcomes

- Learned how to enforce domain-specific validation constraints across authentication flows in Django REST Framework.
- Gained hands-on experience structuring, normalizing, and inserting relational content for campus organizations and events.
