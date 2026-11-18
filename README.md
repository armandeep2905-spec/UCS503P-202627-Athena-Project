
# Athena — AI-Powered Campus Assistant

Athena is a web-based campus assistant designed to help students access institutional information and navigate their campus through a single platform. It brings together academic information, faculty details, student societies, campus events, reminders, and interactive campus navigation.

The project includes a React-based frontend, a Django REST Framework backend, PostgreSQL database integration, and a 2D campus navigation module.

## Key Features

### 1. User Authentication
- Student registration and login.
- Institutional email validation.
- Restriction of registration to approved institutional email domains.
- Token-based authentication.
- Protected application pages for authenticated users.

### 2. Academic Information
- Course and subject information.
- Course codes, credits, semesters, and syllabus links.
- CGPA calculator interface.

### 3. Faculty Directory
- Search faculty members by name or department.
- View faculty details such as designation, email, and cabin location.
- Department-based faculty lookup.

### 4. Societies and Events
- Browse student societies.
- View society descriptions and coordinator information.
- Access campus event information.

### 5. Campus Navigation
- Interactive 2D campus map.
- Select starting and destination locations.
- Calculate routes through the connected campus road network.
- Display calculated routes visually.
- Support destination deep-linking through URL parameters.
- Integration of the navigation module into the main Athena frontend.

### 6. Reminders
- Create and manage student reminders.
- Store reminder details against the authenticated student account.

### 7. Campus Information Assistant
- Process student queries related to institutional information.
- Retrieve relevant information from the available institutional knowledge base.
- Search faculty and course information.
- Retrieve relevant document content using full-text search.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS, CSS |
| Frontend Routing | React Router |
| Backend | Python, Django |
| API Development | Django REST Framework |
| Database | PostgreSQL |
| Database Hosting | Neon PostgreSQL |
| Authentication | Django Authentication, Token Authentication |
| Knowledge Retrieval | Python, SQLite FTS5 |
| Campus Navigation | HTML, CSS, JavaScript, SVG/2D Map |
| Version Control | Git and GitHub |

## Project Structure

```text
Athena/
│
├── DataBase/
│   ├── create_database.py
│   ├── insert_data.py
│   ├── load_all_data.py
│   └── setup_neon.py
│
├── assets/
│
├── code/
│   ├── backend/
│   │   ├── api/
│   │   │   ├── admin.py
│   │   │   ├── serializers.py
│   │   │   ├── tests.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   │
│   │   ├── config/
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── asgi.py
│   │   │   └── wsgi.py
│   │   │
│   │   ├── core/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── rag_service.py
│   │   │   ├── tests.py
│   │   │   └── migrations/
│   │   │
│   │   ├── manage.py
│   │   └── requirements.txt
│   │
│   └── frontend/
│       ├── public/
│       │   └── campus-nav/
│       │       ├── map.html
│       │       ├── script.js
│       │       ├── style.css
│       │       └── campus-map-opt.jpg
│       │
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── context/
│       │   ├── data/
│       │   ├── hooks/
│       │   ├── mocks/
│       │   ├── pages/
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
│
├── docs/
├── journals/
├── project-proposal/
├── project-report-final/
├── project-report-prototype-stage/
└── README.md
```

## Application Modules

| Module | Responsibility |
|---|---|
| Authentication | Student registration, login, and access control |
| Academics | Course information and academic utilities |
| Faculty | Faculty directory and search |
| Societies and Events | Campus societies and event information |
| Navigation | 2D campus map and route calculation |
| Reminders | Student reminder management |
| Knowledge Retrieval | Retrieval of relevant institutional information |
| Database | Storage and retrieval of application data |

## Testing and Validation

Testing was performed to verify important application workflows, including authentication, faculty information retrieval, societies loading, campus navigation, deep-link handling, and database connection behaviour.

The recorded test cases cover:

- Institutional registration and email-domain validation.
- Duplicate account prevention.
- Faculty directory information retrieval.
- Society catalog loading.
- Campus route calculation.
- Navigation deep-link functionality.
- Database cold-start and request timeout handling.


## Future Scope

- Extend campus navigation with additional campus locations and improved route information.
- Develop a 3D campus navigation experience.
- Improve the institutional knowledge base and query retrieval.
- Expand academic and administrative information coverage.
- Improve testing automation and application performance.
- Add further campus services based on student requirements.



## Repository

[**Athena — GitHub Repository**](https://github.com/nipun1015/UCS503P-202627-Athena-Project)
