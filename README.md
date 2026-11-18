<p align="center">
  <img src="assets/logo.png" alt="Athena logo" width="220" height="220">
</p>

<h1 align="center">Athena: AI-Powered Campus Companion</h1>

<p align="center"><em>Ask. Discover. Navigate.</em></p>

Athena is a campus assistance platform built as a course project for **UCS503P (Software Engineering)** at Thapar Institute of Engineering and Technology. Students ask questions in natural language and get answers drawn from institution-provided documents, rather than from a general-purpose chatbot's memory.

## Problem

Campus information is scattered across websites, handbooks, circulars, department pages and notice boards. Students, especially new ones, lose time finding the right source for academic rules, society and event details, or the location of a building or lab.

## Features

### AI Campus Assistant
- **Natural-language Q&A:** students ask questions the way they would ask a senior, instead of digging through PDFs and notice boards.
- **Retrieval-Augmented Generation (RAG):** the bot retrieves relevant passages from college-provided documents first, then generates the answer from them, so responses stay grounded in the institution's own information.
- **Semantic search:** documents are embedded and searched by meaning, so a question still finds the right passage when it doesn't share exact keywords with the source.
- **Institution-aware answers:** the student selects their institution, and answers come only from that institution's data, never mixed with another college's.
- **Always one tap away:** the query bot is a floating button available from every page.

### Accounts and Personalization
- **Registration and login:** token-based authentication connected to the backend.
- **Guided entry flow:** landing page, institution selection, login/register, then a personalized dashboard.
- **Dashboard hub:** a single home screen with tiles linking to every section of the app.

### Academics
- **Courses:** browse course information for your institution.
- **Faculty directory:** find faculty and their departments.
- **Academic reminders:** keep track of deadlines and important dates.

### Societies and Events
- **Societies:** discover the clubs and societies on campus.
- **Events:** see what is happening on campus and stay updated.

### Interactive Campus Map
- **Clickable buildings:** tap a building to open a popup with its information.
- **Data-driven design:** the map is built from structured location data, so navigation features can be added without redesigning it.
- **Always one tap away:** like the query bot, the map is a floating button available from every page.

### Multi-College Architecture
- **Many institutions, one platform:** each institution has its own verified knowledge base, courses, events and locations.
- **College-controlled data:** the information students see comes from institution-provided sources, which keeps answers trustworthy.

## How the RAG Pipeline Works

```
Student question
      |
      v
Embed query (Sentence Transformers)
      |
      v
Vector search in PostgreSQL + pgvector  <-- institution-specific documents
      |
      v
Top matching passages + question -> LLM (GPT-4o-mini)
      |
      v
Grounded answer returned to the student
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Django, Django REST Framework (token authentication) |
| Database | PostgreSQL with pgvector |
| Embeddings | Sentence Transformers |
| LLM | GPT-4o-mini |

## Project Structure

```
.
├── code/
│   ├── backend/      # Django / DRF API and RAG pipeline
│   └── frontend/     # React + Vite app
├── DataBase/         # Schema creation and data insertion scripts
├── assets/           # Static assets and 3D models
├── docs/             # Requirements, design and testing documents
├── journals/         # Weekly team journals
├── project-proposal/
├── project-report-prototype-stage/
└── project-report-final/
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL with the `pgvector` extension

### 1. Clone

```bash
git clone https://github.com/armandeep2905-spec/UCS503P-202627-Athena-Project.git
cd UCS503P-202627-Athena-Project
```

### 2. Database

Create a PostgreSQL database, enable pgvector (`CREATE EXTENSION vector;`), then run the scripts in `DataBase/` to create the schema and insert sample data.

### 3. Backend

```bash
cd code/backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then fill in the values below
python manage.py migrate
python manage.py runserver
```

Environment variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `DJANGO_SECRET_KEY` | Django secret key |
| `OPENAI_API_KEY` | Key used for answer generation |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s) allowed to call the API |

### 4. Frontend

```bash
cd code/frontend
npm install
npm run dev
```

Create `code/frontend/.env`:

```
VITE_API_URL=http://localhost:8000
```

## Current Status

- Frontend pages and flow: landing, institution selection, login/register, dashboard.
- Authentication is connected to the backend (`/api/auth/login`, `/api/auth/register`).
- Other resources (courses, events, societies, reminders, map data) are being moved from local mock data to real API endpoints.

## Roadmap

- 3D campus navigation (Three.js)
- Turn-by-turn indoor navigation
- Student affiliation verification against college records
- Mobile app, voice input, multilingual support
- Notifications and personalized academic reminders

## Team

Built by **The 3 Stooges**:

- Armandeep Singh Taggar
- Nipun Gupta
- Sanchit Narula

## License

Developed for academic purposes as part of UCS503P at TIET, Patiala.
