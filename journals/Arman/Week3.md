Week 3 

-> Database Development: Started working on the database structure for Athena using SQLite for the initial development and testing.

-> Database Design: Designed the initial table structure, identifying the required tables, fields, relationships, and data that would be needed by the application.

-> Reason for Using SQLite: Since we were initially not familiar with PostgreSQL, we used SQLite to understand the database requirements, create the tables, and test the initial structure more easily.

-> PostgreSQL Setup: Since PostgreSQL was already mentioned in our project report as the intended database, we later set up PostgreSQL using Docker and migrated the database structure from SQLite to PostgreSQL.

-> Database Migration: Initially developed and tested the database using SQLite, then converted/migrated the database structure to PostgreSQL to align with the finalized project setup.

-> Documentation: Converted the existing project report into LaTeX format to improve its structure, formatting, and presentation.

-> Presentation: Prepared a PowerPoint presentation covering the project, its objectives, features, technology stack, database work, and overall progress for the upcoming class presentation.

-> Problem Faced: The main challenge was preparing a concise 4-page PPT that could clearly explain our project, workflow, technical approach, and progress without overcrowding the slides.

-> How I Overcame It: I focused on the most important information, organized the content logically, and removed unnecessary details. This helped me present the complete workflow and project overview within the limited 4-page format while keeping the presentation clear and easy to understand.

-> Learning Outcome: Gained practical experience with SQLite, PostgreSQL, Docker, database design, migration, LaTeX documentation, and technical presentation preparation.This process helped us understand the database structure first with a simpler setup and then gain practical experience with PostgreSQL and Docker while keeping our implementation aligned with the proposed technology stack.


-> Docker commands i used:
* docker --version → Check the installed Docker version.
* docker pull postgres → Download the PostgreSQL Docker image.
* docker images → View available Docker images.
* docker ps → View currently running containers.
* docker ps -a → View all containers, including stopped ones.
* docker run ... postgres → Create and start a PostgreSQL container.
* docker start <container> → Start an existing PostgreSQL container.
* docker stop <container> → Stop a running container.
* docker restart <container> → Restart a container.
* docker logs <container> → Check the PostgreSQL container logs.
* docker exec -it <container> bash → Open a terminal inside the running container.
* docker rm <container> → Remove a container.
* docker rmi <image> → Remove a Docker image.