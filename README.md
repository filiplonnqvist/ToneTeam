# ToneTeam
**A collaborative music creation platform** - First-year student project

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview
ToneTeam is a web-based platform where users can play piano, write lyrics, and collaborate on music creation in real-time. This is an ongoing project developed as part of my first-year studies in web development, showcasing both application development and DevOps practices.

**Current Status:** MVP (*Minimum Viable Product*) - Core features implemented, collaboration features in development.

## Screenshots
### Application Interface
![toneteam-screenshoot](https://github.com/user-attachments/assets/c1436e43-0f7b-4ca3-95ce-62a712719e31)

## Tech Stack & Architecture


The application is built using a modern JavaScript stack with a **hybrid architecture** (_component-based_ and _MVC_) where the client-side effectively becomes a static application that communicates with the server only through well-defined API endpoints.

The frontend utilizes vanilla JavaScript with custom **Web Components** for modularity, styled with **Tailwind CSS** for a responsive design. The interactive piano is powered by the Web Audio API, providing real-time sound generation without external dependencies.

On the backend, the application runs on **Node.js** with **Express.js**, using **MongoDB** for data persistence through **Mongoose ODM**. User authentication is handled by **Firebase**, while session management provides secure access to saved user content. The entire system follows a **RESTful API** design pattern, making it easy to extend and maintain.

### System Architecture
![ToneTeam(1)](https://github.com/user-attachments/assets/91ba1af5-fd86-48d4-988c-05de7ae0f6bb)
*Hybrid architecture with component-based frontend and MVC backend*

## Development Process

As a first-year student, I've emphasized learning and implementing modern DevOps practices throughout this project. The development environment is fully containerized using **Docker** and **Docker Compose**, ensuring consistent development experiences and easy onboarding for future contributors. Each service runs in its own container, including the Node.js application and MongoDB database.

The project follows a **Git Flow** strategy with protected branches and mandatory code reviews. All development happens in **feature branches** that are merged into the **main branch** through merge requests, ensuring that the main branch always contains production-ready code. This workflow is enforced through GitLab's CI/CD pipeline, which automatically runs ESLint checks, tests, and validates code quality before building and deploying the application.

## Current Features

The application currently supports secure user authentication with personal workspaces where users can create and manage their music. The interactive piano component allows playing through both mouse clicks and keyboard shortcuts. Users can write, edit, and organize lyrics with a built-in editor that includes quick templates for song structures. All lyrics are saved to the database and can be downloaded as text files for offline use.

## Roadmap

The next phase of development focuses on implementing the collaborative features that give ToneTeam its name:

- **Room system** - Create or join music rooms for real-time collaboration via WebSockets
- **Live chat** - Communicate with other users in the room
- **Synchronized piano** - See what others are playing in real-time

## Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB 6.0+
- Docker & Docker Compose (optional but recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/filiplonnqvist/toneteam.git
cd toneteam

# Using Docker (recommended)
docker-compose up -d

# OR Manual setup
npm install
cp .env.example .env
# Configure your .env file with Firebase credentials and MongoDB connection
npm run dev
```

## Author
**Filip Lönnqvist**  
First-year Web Development Student  
Linnaeus University, 2025
Email: fl223km@student.lnu.se  
GitHub: [@filiplonnqvist](https://github.com/filiplonnqvist)

---
*This project is part of the 1DV613 course curriculum and is actively being developed with planned features for real-time collaboration.*

