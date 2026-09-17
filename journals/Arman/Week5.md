Week 5



TASKS ACHIEVED

1. Migration to Shared Neon Database
   • Migrated the project from local PostgreSQL to a shared cloud
     PostgreSQL database using Neon.
   • Created and configured the Neon database server for team-wide
     database access.
   • Connected Django to Neon using the DATABASE_URL in the .env file:

     DATABASE_URL=<Neon_DATABASE_URL>

2. Django Backend Setup
   • Updated the Django backend with the latest project changes.
   • Applied the database schema using:

     python manage.py migrate

   • Created a Django administrator account using:

     python manage.py createsuperuser

   • Started and tested the backend using:

     python manage.py runserver

   • Accessed the Django Admin Panel at:

     http://127.0.0.1:8000/admin/

3. Django Admin and Database Models
   • Verified that the project's database models were correctly
     registered and accessible through the Django Admin Panel.
   • Verified models including:
     - Institutions
     - Departments
     - Buildings
     - Floors
     - Rooms
     - Students
     - Courses
     - Events
     - Societies
     - Society Members
     - Knowledge Documents
     - Reminders

4. Database Data Migration
   • Faced the challenge of combining data because I created the
     shared Neon database while my teammate had additional data
     stored in his local PostgreSQL database.
   • My teammate migrated/exported his existing local database data
     into SQL format.
   • I then used the SQL commands in the Neon SQL Editor to recreate
     and populate the required entries in the shared database.
   • This consolidated the team's existing database records into
     the new shared Neon database.

5. GitHub Team Synchronization
   • Pushed the updated Django backend and migration files to the
     upstream GitHub repository.
   • Since my teammate was working from a fork, he synchronized his
     repository with upstream using:

     git fetch upstream
     git checkout master
     git merge upstream/master
     git push origin master

   • This allowed the teammate to obtain the latest backend changes.

6. Security and Environment Configuration
   • Added .env.example to provide the required environment-variable
     structure without exposing credentials.
   • Verified that the actual .env file was not tracked by Git using:

     git ls-files | grep -E '(^|/)\.env($|\.)'

   • Ensured that the Neon DATABASE_URL remained private and was not
     uploaded to GitHub.


PROBLEMS / DIFFICULTIES FACED

1. Shared Database and Existing Local Data
   • The main challenge was consolidating data from different
     PostgreSQL environments.
   • My teammate had existing records in his local PostgreSQL
     database while the new shared database was hosted on Neon.
   • His existing data therefore had to be exported/migrated before
     being added to the shared database.
   • I executed the required SQL commands through the Neon SQL Editor
     to populate the Neon database.

2. Local PostgreSQL Connection Error
   • During setup, my teammate initially attempted to connect to the
     old local PostgreSQL server using:

     psql -U athena -h localhost -p 5432

   • This resulted in:

     FATAL: password authentication failed for user "athena"

   • The issue occurred because localhost:5432 referred to his local
     PostgreSQL installation instead of the shared Neon database.
   • The problem was resolved by configuring Django to use the shared
     Neon DATABASE_URL.

3. Understanding Django Migrations vs Data
   • Initially, there was confusion about whether Django migrations
     would also transfer the existing database records.
   • I learned that:

     python manage.py migrate
       → creates/updates the database STRUCTURE such as tables,
         fields, relationships and constraints.

     SQL INSERT/COPY commands
       → populate the database with the ACTUAL DATA.

   • Understanding this difference helped in correctly setting up
     the Neon database and importing the existing records.


FINAL OUTCOME

• Successfully established a shared Neon PostgreSQL database for the
  project.
• Connected the Django backend to the shared cloud database.
• Applied the required Django migrations and verified the Admin Panel.
• Consolidated the data from the teammate's local PostgreSQL database
  into the shared Neon database.
• Synchronized the latest backend code across the team's GitHub forks.
• Protected the Neon database credentials using .env configuration.
• Established a shared database workflow where team members can use
  Django Admin to access and manage the project data.