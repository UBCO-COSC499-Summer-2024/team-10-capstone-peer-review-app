# Video Presentation Outline

## 1. Introduction (1 min)
- **Team Introduction**: Briefly introduce each team member with their roles.
  - Bhavya Bhagchandani
  - Abdul Faiz
  - Josh Farwig
  - Mahir Rahman
- **Project Introduction**: Introduce the Peer Review Application project.

This software aims to enhance assignment grading by applying a peer-review system that allows consistent and reliable feedback from peers from a learning institution. It aims to simplify the workflow for students, instructors, and administrators by providing an intuitive and efficient platform for managing assignments, peer reviews, the creation of rubrics and progress tracking, and many other vital tools for the instructors and students to benefit the process. This system aims to provide a system prone to bias when grading assignments and a chance for multiple perspectives before submitting a final grade. Our system aims to be easy to use and easy to integrate for learning institutions to rapidly adopt within their learning ecosystem.

## 2. Project Purpose and Unique Value Proposition (UVP) (2 min)
- **Project Purpose**: Explain the purpose of the Peer Review Application.
  - Enhance assignment grading with a peer-review system.
  - Simplify workflows for students, instructors, and administrators.
  - Provide consistent and reliable feedback from multiple perspectives.
- **Unique Value Proposition**: Describe what makes the project unique.
  - Intuitive architecture with differentiated user roles.
  - Automated peer review system ensuring fair and anonymous evaluations.
  - Comprehensive progress tracking for students and instructors.

## 3. Measurable Project Objectives and Success Criteria (2 min)
- **Objectives**:
  - Create an intuitive, efficient, and secure platform for managing assignments and peer reviews.
  - Implement role-based access control for students, instructors, and administrators.
  - Provide streamlined assignment submission and peer-reviewed feedback processes.
- **Success Criteria**:
  - Successful account creation and authentication services.
  - Effective role-based access control.
  - User-friendly dashboards for monitoring progress and assignment statuses.
  - System security and data privacy measures.

## 4. User Groups and Usage Scenarios (2 min)
- **User Groups**:
  - **Students**: Submit assignments, participate in peer reviews, create groups & participate in group peer reviews and track progress.
  - **Instructors**: Create and manage assignments, classes, and groups, and oversee peer reviews.
  - **Administrators**: Manage user accounts, system security, maintenance, and receive & respond to user reports.
- **Usage Scenarios**:
  - **Students**: Register/login, view class dashboard, submit assignments, participate in peer reviews.
  - **Instructors**: Register/login, create classes and assignments, assign peer reviews, monitor progress.
  - **Administrators**: Manage accounts, system settings, maintenance tasks, receive & respond to user reports.

## 5. Functional Requirements (3 min)
- **User Management**:
  - Account creation, login, and password reset.
  - Role-based access control.
  - Notifications via Email.
- **Assignment Management**:
  - Creation and management of assignments and rubrics.
  - Handling of assignment submissions in various formats.
  - Deadline management and feedback mechanisms.
- **Peer Review Process**:
  - Distribution of peer review assignments.
  - Anonymous reviews and feedback submission.
- **Group Project Evaluations**
  - Creation and management of groups by instructors & students.
  - Participate in peer review within groups anonymously.
  - Must ensure fairness via fairness mechanisms.
- **Progress Monitoring**:
  - Dashboards for instructors and students to track progress and assignment statuses.

## 6. Technical Requirements (2 min)
- **Frontend Requirements**:
  - Use Vite, React, React-Router-Dom, TailwindCSS, Heroicons, and HeadlessUI.
  - Ensure compatibility with major web browsers and mobile devices.
- **Backend Requirements**:
  - Use Node.js, Express.js, and PostgreSQL.
  - Implement RESTful APIs with secure communication.
  - Use Drizzle ORM or Prisma ORM for database operations.
- **Testing and Deployment**:
  - Automated testing with Jest and Cypress.
  - CI/CD pipelines with Drone CI and deployment on Heroku.
- **Additional Libraries and Tools**:
  - Authentication with Passport.js.
  - PDF viewing with PDF.js.
  - Compliance with regulations as requested by the client.

## 7. Conclusion (1 min)
- **Summary**: Recap the key points discussed.
- **Call to Action**: Invite feedback from the project sponsor and stakeholders.
- **Closing**: Thank the audience for their time and attention.

# Script for the Video Presentation

## 1. Introduction

Hello, we are team number 10, working on the Peer Review Application. My name is [Name], and I'm joined by my teammates Bhavya Bhagchandani, Abdul Faiz, Josh Farwig, and Mahir Rahman.

Today, we will present the planned key requirements and functionalities of our project.

## 2. Project Purpose and Unique Value Proposition (UVP)
- "The purpose of our Peer Review Application is to enhance assignment grading through a peer-review system, simplifying workflows for students, instructors, and administrators. Our system aims to provide consistent and reliable feedback from multiple perspectives."
- "Our unique value proposition lies in our intuitive architecture with differentiated user roles, an automated peer review system ensuring fair and anonymous evaluations, and comprehensive progress tracking for both students and instructors."

## 3. Measurable Project Objectives and Success Criteria
- "Our primary objectives include creating an intuitive, efficient, and secure platform for managing assignments and peer reviews, implementing role-based access control, and streamlining assignment submission and peer-reviewed feedback processes."
- "Success will be measured by effective account creation and authentication services, role-based access control, user-friendly dashboards for monitoring progress and assignment statuses, and robust system security and data privacy measures."

## 4. User Groups and Usage Scenarios
- "Our main user groups are students, instructors, and administrators. Students will use the platform to submit assignments, participate in peer reviews, create groups and participate in group peer reviews, and track their progress."
- "Instructors will create and manage assignments, classes, and groups, oversee peer reviews, and monitor student progress. Administrators will manage user accounts, ensure system security, perform maintenance tasks, and respond to user reports."

Let’s explore how each user group will interact with the system through a few scenarios.

**Students**: Students will create an account or log in to see a personalized dashboard showing class and assignment information. They can submit assignments and participate in peer reviews anonymously. For example, Emily logs in, selects her class, uploads her assignment, and receives a confirmation. Later, she can log in again to view feedback on her submitted work.

**Instructors**: Instructors will create an account, apply for instructor roles, and manage their classes through a personalized dashboard. For instance, Sarah can create a new class, add assignments, set deadlines, and monitor student progress. She logs in, creates a class, adds an assignment, sets the deadline, and receives confirmation. Sarah can also check the progress of her students via her dashboard.

**Administrators**: Administrators will log in to access administrative controls, manage user accounts, and monitor system health. For example, Michael can activate or deactivate user accounts, assign instructor roles, and keep an eye on system performance. For instance, he logs in, navigates to user management, and modifies user accounts as needed and responds to any user reports.

## 5. Requirements

### Functional Requirements

- **User Management**

    - Users must be able to create accounts, log in, and reset passwords securely.
    - Admins should grant instructor permissions and manage user roles effectively.

- **Assignment Management**

    - Instructors need to create assignments with associated rubrics, and students should be able to submit their work in various formats.
    - The system should handle deadlines efficiently and activate peer reviews post-deadline.
    - Plus, there should be mechanisms in place for instructors to provide feedback on student submissions and for students to communicate with instructors regarding their assignments.

- **Peer Review Process**

    - Peer reviews are a core part of our system. Instructors should be able to distribute peer review assignments to students, ensuring each student reviews a set number of their peers' submissions.
    - To maintain fairness, reviews must be anonymous, and students should be able to submit feedback based on predefined rubrics.

- **Group Project Evaluations**

    - For group projects, it's essential to facilitate group formation and management by both instructors and students.
    - Individual contributions within groups should be evaluated anonymously to ensure fairness in grading.

- **Progress Monitoring**

    - Lastly, progress monitoring is key. We need comprehensive dashboards for both instructors and students to track progress and assignment statuses effectively.

### User Requirements

- **Students**: Students will need a user-friendly interface for submitting assignments and receiving feedback, anonymous and fair peer evaluations, and access to submission history and received feedback.

- **Instructors**: They need a fast, simple, and user-friendly interface for creating classes, assignments, and rubrics. Monitoring and evaluating individual and group performances should be seamless. Detailed progress reports for both students and classes are essential.

- **Administrators**: Admins will need administrative functionalities to manage the overall system, user accounts, and configurations, and the ability to respond to user reports efficiently.

### Technical Requirements

**Frontend Requirements**

- On the frontend, we'll use a combination of Vite, React, TailwindCSS, Heroicons, and HeadlessUI to create a seamless user experience.
- It's essential to ensure compatibility with major web browsers and responsiveness on mobile devices.

**Backend Requirements**

- For the backend, we'll rely on Node.js and Express.js to handle server-side logic and APIs.
- Our database of choice will be PostgreSQL, and we'll use Drizzle ORM or Prisma ORM for efficient database operations.

**API Development**

- We'll develop RESTful APIs with secure and efficient communication protocols to ensure smooth interactions between the frontend and backend.

**Testing and Deployment**

- To ensure the reliability and stability of our system, we'll implement automated testing using Jest and Cypress.
- Continuous integration with Drone CI or Travis CI will allow us to streamline the deployment process and catch any issues early on.

**Other Libraries and Tools**

- In addition to the core technologies, we'll use Passport.js for authentication and PDF.js for PDF viewing.
- We would also ensure compliance with privacy regulations like the GDPR and FERPA as needed and implement data encryption for security.

## 6. Conclusion

- In summary, our Peer Review Application aims to streamline the peer review process, ensuring fairness and providing comprehensive tools for students, instructors, and administrators. Our project is designed to meet the specific needs of each user group, with robust functional and technical requirements to ensure a seamless experience.

- We welcome your feedback and look forward to discussing how our system can best meet your needs. Thank you for your time and attention.
