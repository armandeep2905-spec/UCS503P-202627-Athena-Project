import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

cursor = conn.cursor()


# Institution
cursor.execute("""
SELECT institution_id
FROM institutions
WHERE name = %s AND email_domain = %s
""", (
    "Demo College",
    "democollege.edu"
))

institution = cursor.fetchone()

if institution:
    institution_id = institution[0]
else:
    cursor.execute("""
    INSERT INTO institutions (name, email_domain, address)
    VALUES (%s, %s, %s)
    RETURNING institution_id
    """, (
        "Demo College",
        "democollege.edu",
        "Punjab, India"
    ))

    institution_id = cursor.fetchone()[0]


# Department
cursor.execute("""
SELECT department_id
FROM departments
WHERE institution_id = %s
AND department_name = %s
""", (
    institution_id,
    "Computer Science"
))

department = cursor.fetchone()

if department:
    department_id = department[0]
else:
    cursor.execute("""
    INSERT INTO departments (institution_id, department_name)
    VALUES (%s, %s)
    RETURNING department_id
    """, (
        institution_id,
        "Computer Science"
    ))

    department_id = cursor.fetchone()[0]


# Student
cursor.execute("""
SELECT student_id
FROM students
WHERE email = %s
""", (
    "student@democollege.edu",
))

student = cursor.fetchone()

if student:
    student_id = student[0]
else:
    cursor.execute("""
    INSERT INTO students (
        institution_id,
        name,
        email,
        roll_number,
        is_verified
    )
    VALUES (%s, %s, %s, %s, %s)
    RETURNING student_id
    """, (
        institution_id,
        "Test Student",
        "student@democollege.edu",
        "1024030001",
        1
    ))

    student_id = cursor.fetchone()[0]


# Building
cursor.execute("""
SELECT building_id
FROM buildings
WHERE institution_id = %s
AND building_name = %s
""", (
    institution_id,
    "Computer Science Block"
))

building = cursor.fetchone()

if building:
    building_id = building[0]
else:
    cursor.execute("""
    INSERT INTO buildings (institution_id, building_name)
    VALUES (%s, %s)
    RETURNING building_id
    """, (
        institution_id,
        "Computer Science Block"
    ))

    building_id = cursor.fetchone()[0]


# Floor
cursor.execute("""
SELECT floor_id
FROM floors
WHERE building_id = %s
AND floor_number = %s
""", (
    building_id,
    2
))

floor = cursor.fetchone()

if floor:
    floor_id = floor[0]
else:
    cursor.execute("""
    INSERT INTO floors (building_id, floor_number)
    VALUES (%s, %s)
    RETURNING floor_id
    """, (
        building_id,
        2
    ))

    floor_id = cursor.fetchone()[0]


# Room
cursor.execute("""
SELECT room_id
FROM rooms
WHERE floor_id = %s
AND room_number = %s
""", (
    floor_id,
    "204"
))

room = cursor.fetchone()

if room:
    room_id = room[0]
else:
    cursor.execute("""
    INSERT INTO rooms (
        floor_id,
        room_number,
        room_name,
        room_type,
        x_coordinate,
        y_coordinate,
        z_coordinate
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    RETURNING room_id
    """, (
        floor_id,
        "204",
        "AI Lab",
        "Laboratory",
        12.5,
        8.2,
        3.0
    ))

    room_id = cursor.fetchone()[0]


# Event
cursor.execute("""
SELECT event_id
FROM events
WHERE institution_id = %s
AND event_name = %s
AND event_date = %s
""", (
    institution_id,
    "Tech Fest",
    "2026-09-10"
))

event = cursor.fetchone()

if not event:
    cursor.execute("""
    INSERT INTO events (
        institution_id,
        event_name,
        event_date,
        location
    )
    VALUES (%s, %s, %s, %s)
    """, (
        institution_id,
        "Tech Fest",
        "2026-09-10",
        "Main Auditorium"
    ))


# Save changes
conn.commit()

# Close connection
cursor.close()
conn.close()

print("Sample data inserted successfully into PostgreSQL!")