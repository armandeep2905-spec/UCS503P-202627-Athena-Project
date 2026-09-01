# Week 2 — Project Report, System Design and Database Planning

## Problem / Challenge

After finalizing the project idea, the next challenge was converting the initial concept into a structured Software Engineering project.

The project report had to clearly describe the system architecture, technology stack, functional requirements and interactions between different components. We also needed to represent the proposed system using appropriate UML diagrams.

Another problem was deciding what information would need to be stored in the database because Athena would require both institutional information and structured campus information.

## Relevant Context

During this week, the project report was completed and submitted.

We presented the proposed technology stack and discussed the system design using UML diagrams.

The proposed system required different types of information, including:

```text
Institution
    |
    ├── Students
    ├── Administrators
    ├── Departments
    │      |
    │      └── Courses
    |
    ├── Buildings
    │      |
    │      └── Floors
    │             |
    │             └── Rooms
    ├── Events
    |
    └── Knowledge Documents
```
This structure was important because the chatbot and future campus-navigation functionality would require access to organized institutional data.

## Key Observation

The project could not rely only on unstructured documents.

Some information is naturally structured, such as:
Student records
Institution details
Departments
Courses
Buildings
Floors
Rooms
Events

Therefore, a database was required to store structured information separately from knowledge documents used for retrieval.

## Solution

We planned a relational database structure for Athena.

The initial database design included tables for:

Institutions
Students
Administrators
Departments
Courses
Buildings
Floors
Rooms
Events
Knowledge Documents

Relationships were established using primary keys and foreign keys.

## Work Completed
Completed and submitted the project report.
Presented the proposed technology stack.
Presented the system design and UML diagrams.
Started converting the conceptual design into a database structure.
Identified the major entities required by Athena.
Planned relationships between the database entities.
Started work on the project proposal in LaTeX.
## Problems Faced

One of the main difficulties was deciding which information should be represented as database entities and how the entities should be related.

For example, rooms should not be stored directly against an institution because a room belongs to a floor, and a floor belongs to a building.

The hierarchy was therefore defined as:
Institution → Building → Floor → Room

This helped make the database structure more consistent and extensible.


## Next Step
The next step was to implement the planned database, prepare the project documentation in LaTeX, create the project repository and begin working on the campus navigation component.
