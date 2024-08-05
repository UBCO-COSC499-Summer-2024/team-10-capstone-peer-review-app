[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15119155&assignment_repo_type=AssignmentRepo)

<!-- ## Team 10's Peer Review App Project &nbsp;[![Build Status](https://droneci.ok.ubc.ca/api/badges/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/status.svg?ref=refs/heads/dev)](https://droneci.ok.ubc.ca/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app) -->

# 📝 Peer Grade

> Empowering students through fair and anonymous peer evaluations

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)


## Introduction

The Peer Grade is a peer review application that allows students to submit assignments and receive feedback from their peers. The application is designed to provide a platform for students to review and evaluate their peers' work, ensuring fair and anonymous evaluations. The Peer Grade is built using React, Node.js, and PostgreSQL, and is compatible with modern web browsers.


## 🚀 Quick Start

1. Navigate to `/app/` directory
2. Start Docker engine
3. Run `docker compose -f docker-compose-dev.yml up -d`
4. Visit `localhost:3000` in your browser

### Nodemailer and .env files
Currently, the .env files for our project exist in our repo. We know this is a security issue however since the repo is only between our client and ourselves we found it easier to manage our repo activities by having the information easily accessible. Also, there are no API-KEYS current within the env vars, only JWT, Cookie, and nodemailer secrets. The nodemailer functions use a designated peer-grade Gmail account made specifically for this application however the user may wish to change the details. When/if you do that, please ensure an app password is enabled and linked through the preferred gmail account and update the nodemailer credentials on the .env files. The .env file also includes the current credentials needed for running the database connections.


## 🌟 Features

### 👥 For Students
- Join multiple classes
- Submit and re-submit assignments
- Provide anonymous feedback on peers' work

### 👨‍🏫 For Instructors
- Manage classes and assignments
- Assign peer reviewers
- Set submission timelines and feedback periods

### 🛠 System Capabilities
- Accept various submission formats (PDF, ZIP, Google Docs links)
- Compile peer reviews and assign grades
- Send timely notifications

### Checkout [detailed features](./docs/features.md) to see the detailed checklist of features


## 🧑‍💻 Tech Stack

- **Frontend**: [React](https://reactjs.org/), [shadcn/ui](https://github.com/shadcn/ui), [TailwindCSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Passport.js](https://www.passportjs.org/)
- **File Handling**: [react-pdf-viewer](https://github.com/wojtekmaj/react-pdf-viewer)



## 🧪 Testing

We use [Jest](https://jestjs.io/) for both frontend and backend testing.

### Frontend Tests
```bash
cd /app/client/Peergrade
npm run test
```
### Backend Unit Tests
```bash
cd /app/server/
npm run test
```
### Backend Integration tests (Dockerised Test Container)
```bash
cd /app/
docker compose -f docker-compose-test.yml up -d
```
## 👨‍💻 Development Documentation
### Visit our [Development Documentation](./app/README.md) to learn more about our Peer Grade application's development process.


## 📚 Project Plan & Design Plan
### Want to learn more about our **Peer Grade** project plan? Check out our [Project Plan](./docs/plan/project-plan.md) and [Design Plan](./docs/design/SystemDesign.md)


## License
* MIT License
