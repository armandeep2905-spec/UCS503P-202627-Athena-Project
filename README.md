
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

## Deployment

The application is split across Vercel (frontend) and Render (Django API and PostgreSQL).

### Render backend

1. Connect this repository to Render and create a Blueprint from the root `render.yaml` file. The blueprint provisions a PostgreSQL database and a Python web service.
2. In the `athena-api` service environment, set `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin, such as `https://your-project.vercel.app` (no trailing slash). Add `GEMINI_API_KEY` to enable live Gemini answers.
3. Deploy. The build installs backend dependencies, collects static files, and applies Django migrations. Render sets `DATABASE_URL`, `SECRET_KEY`, and `RENDER_EXTERNAL_HOSTNAME` for the service.

For a manual Render setup, use `code/backend` as the root directory, `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate` as the build command, and `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT` as the start command. Configure `DATABASE_URL`, `SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, and optionally `GEMINI_API_KEY`.

### Vercel frontend

1. Import the repository into Vercel and set the project root directory to `code/frontend`.
2. Set `VITE_API_URL` to the Render API origin, for example `https://athena-api.onrender.com` (no trailing slash). `VITE_API_BASE_URL` is also supported for compatibility with existing local configuration.
3. Deploy with the detected Vite build settings (`npm run build`, output directory `dist`). The Vercel rewrite config supports direct navigation to React routes.

Redeploy the frontend after changing `VITE_API_URL`; Vite embeds it into the built assets. Keep `CORS_ALLOWED_ORIGINS` in sync with the Vercel production domain and any preview domain you intend to use.

### Deployment notes

- The backend builds an FTS5 index from `ThaparInfo/tiet_chatbot_knowledge_base.jsonl` on first query. Render's service filesystem is ephemeral, so the index can be rebuilt after a restart; attach persistent storage if avoiding rebuilds matters.
- The reminder UI currently uses browser-side mock data, so reminders will not persist through the backend after deployment until the frontend reminder API is connected to Django.
- The frontend has mock fallbacks for campus data and chat. A successful UI response does not by itself confirm the Render API is reachable.
