# 🏫 Athena — AI-Powered Campus Companion

> **Ask. Discover. Navigate. — Your Intelligent Gateway to Campus.**

Athena is an **AI-powered, multi-college campus assistance platform** designed to help students find reliable information about their university, understand academic and campus-related processes, and navigate the physical campus using natural language.

Unlike a generic AI chatbot, Athena uses **Retrieval-Augmented Generation (RAG)** to retrieve information from **college-controlled and verified knowledge sources** before generating an answer.

Athena also introduces an **interactive 3D campus map**, allowing students to locate buildings, floors, laboratories, offices, and even specific rooms by simply asking Athena where they are.

---

## ✨ What Makes Athena Different?

Athena is not simply another chatbot.

### 🤖 AI + Verified College Knowledge

Instead of relying only on an LLM's general knowledge, Athena retrieves relevant information from the selected institution's verified data and uses it to generate contextual answers.

### 📚 RAG-Based Answers

Athena uses **Retrieval-Augmented Generation (RAG)** to connect an LLM with institution-specific documents and information.

### 🏫 Multi-College Architecture

Athena is designed to support **multiple colleges and universities**.

A student selects their institution, and the system provides information relevant to that institution instead of mixing information from different universities.

### 🔐 Student Affiliation Verification

Athena includes a mechanism for verifying whether a student belongs to the selected institution using **college-controlled student records and institutional information**.

### 🗺️ Interactive 3D Campus Navigation

Athena goes beyond text-based assistance by providing an interactive **3D representation of the campus**.

Students can locate:

- Buildings
- Departments
- Laboratories
- Offices
- Floors
- Classrooms
- Specific rooms

## 🎯 Problem

Students often need information from many different sources:

- College websites
- Academic handbooks
- Notices and circulars
- Department information
- Hostel guidelines
- Examination instructions
- Placement information
- Maps and building directories

Finding the correct information can be time-consuming, especially when information is scattered across different documents and platforms.

There is also a separate campus problem:

> **Students may know what they need but not where to find it.**

Finding a particular laboratory, office, classroom, floor, or room can be difficult, especially for new students.

### Athena combines both problems:

**Information Discovery + Campus Navigation**

into one intelligent platform.

---

## 💡 Solution

Athena provides a centralized intelligent campus assistant where students can:

### 💬 Ask
Ask questions naturally instead of searching through multiple documents.

### 📚 Retrieve
Athena retrieves relevant information from the selected institution's verified knowledge base using RAG.

### 🧠 Understand
The LLM processes the retrieved information and generates a natural-language response.

### 🗺️ Navigate
For location-based questions, Athena connects the response with structured campus location data and the 3D map.

### 🔐 Verify
Student affiliation can be verified against institution-controlled student information.

---

## 🌟 Core Features

- 🤖 AI-powered natural-language campus assistant
- 📚 Retrieval-Augmented Generation (RAG)
- 🏫 Multi-college support
- 🔐 Student affiliation verification
- 👨‍🎓 Student-specific campus assistance
- 🧠 Context-aware responses
- 📄 College document/knowledge ingestion
- 🔎 Semantic information retrieval
- 🗺️ Interactive 3D campus map
- 🏢 Building and department navigation
- 🏬 Floor-level navigation
- 🚪 Room-level location assistance
- 📍 Coordinate-based campus locations
- 👨‍💼 College-controlled information management
- 🔒 Authentication and access control
- 🌐 API-based backend architecture

---

## 🧠 How Athena Works

Athena does not simply send every question directly to an LLM.

```text
                    ┌───────────────────┐
                    │      Student      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   Natural Query   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   FastAPI Backend │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Query Processing │
                    │       + NLP       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │   RAG Retrieval   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Verified College  │
                    │    Knowledge      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │       LLM         │
                    │ Answer Generation │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Student Response  │
                    └───────────────────┘
```
## 🛠️ Technology Stack

### 🎨 Frontend

- HTML
- CSS
- JavaScript

### ⚡ Backend

- Python
- FastAPI

FastAPI provides the API layer connecting the frontend with authentication, database operations and AI services.

### 🧠 Artificial Intelligence

- Large Language Model (LLM)
- Natural Language Processing (NLP)
- Retrieval-Augmented Generation (RAG)

### 🔎 Semantic Retrieval

- Embedding Model
- Sentence Transformers / Embedding API
- Vector Database / Vector Store

Embeddings allow Athena to find information based on meaning, rather than relying only on exact keywords.

### 🗄️ Database

- PostgreSQL

Used for structured information such as:

- Institutions
- Students
- Administrators
- Departments
- Courses
- Buildings
- Floors
- Rooms
- Events
- Knowledge documents

### 🔐 Authentication

- JWT-based authentication
- Institution/student verification

### 🗺️ 3D Visualization

- Three.js
- Blender

Three.js can be used for rendering the interactive campus while Blender can be used to create or edit 3D campus models.

### 🧪 Testing

- Postman
- PyTest

### 🔧 Development

- Visual Studio Code
- Git
- GitHub

### 📦 Deployment

- Docker
- Cloud deployment environment


## 📂 Project Structure

```text
Athena/
│
├── assets/
│   └── 3d-models/
│
├── code/
│   ├── backend/
│   ├── frontend/
│   ├── ai/
│   ├── rag/
│   ├── database/
│   └── navigation/
│
├── docs/
│   ├── requirements/
│   ├── design/
│   └── testing/
│
├── journals/
│   ├── member-1/
│   ├── member-2/
│   └── member-3/
│
├── project-proposal/
│
├── project-report-prototype-stage/
│
├── project-report-final/
│
├── README.md
└── .gitignore


## 👥 Target Users

### 🎓 Students

For academic, administrative and campus-related queries.

### 🆕 New Students

For understanding campus facilities and navigating unfamiliar buildings.

### 👨‍💼 College Administrators

For maintaining institution-specific information and knowledge sources.

### 👨‍🏫 Faculty & Staff

For locating departments, rooms, laboratories and campus facilities.

### 🧑‍🤝‍🧑 Visitors

For understanding and navigating the campus environment where permitted.


## 🚀 Future Scope

- 📱 Mobile application
- 🗣️ Voice-based interaction
- 🌐 Multilingual campus assistance
- 📍 Real-time indoor positioning
- 🧭 Turn-by-turn indoor navigation
- 📅 Personalized academic reminders
- 🔔 Important campus notifications
- 🪄 AR-based campus navigation
- 📊 Analytics for frequently asked campus queries
- 🔄 Automated institutional knowledge updates


## 💡 Our Contribution

We are **not claiming novelty in the LLM itself**.

Our contribution is the **system-level integration** of:

**Multi-college architecture + institution-controlled verified knowledge + student affiliation verification + RAG-based institutional question answering + structured campus data + interactive 3D building/floor/room navigation.**

The goal is to make AI **context-specific, institution-aware and practically useful**, rather than building another generic chatbot.


## 👨‍💻 Project Information

- **Project Name:** Athena
- **Project Type:** Software Engineering Project
- **Domain:** Artificial Intelligence + NLP + Information Retrieval + Campus Navigation
- **Backend:** Python / FastAPI
- **Database:** PostgreSQL
- **Version Control:** Git / GitHub
