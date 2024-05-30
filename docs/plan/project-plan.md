# Project Proposal for Peer Review Application

**Team Number:** 10

**Team Members:**

* Bhavya Bhagchandani
* Abdul Faiz
* Josh Farwig
* Mahir Rahman

## Overview:

### Project purpose or justification (UVP)

The proposed software is an educational platform designed to expedite the process of assignment and deadline management, facilitate peer review, and progress monitoring for use in an academic institution.

The primary purpose of this software is to facilitate better interaction between students, instructors, and administrators. Its objective is to solve the challenges associated with managing assignments, conducting peer reviews efficiently, evaluating group projects, and tracking progress of each and every student.

The unique value proposition of this software is determined by its multi-faceted suite of features created to the needs of all users specified. For all of them, the features are: account creation, accessing course lists and engage in courses. For instructors, it offers a user-friendly UI for creating/deleting courses, assignments, rubrics, create peer evaluation, form groups as well as a dashboard for monitoring student progress. For students, it provides an simple interface for submitting assignments, performing peer evaluations, as well as tracking their submissions and feedbacks. For administrators, it enables the ability to manage the overall system, including user accounts and system configurations and health.

This solution stands out from others due to its focus on simple design, efficient security, scalability, and maintainability. It ensures secure login and authentication mechanisms, accessible UI, scalability to accommodate future growth, and ease of maintenance and update. Furthermore, it complies with relevant privacy regulations to protect student data.

Thus it is clear that, this software provides a comprehensive, secure, and user-friendly solution for facilitating peer reviewed assignments, making it a valuable tool for educational institutions. It not only enhances the efficiency of peer review but also enriches the learning experience for students.

### High-level project description and boundaries

The Minimum Viable Product (MVP) for this project is an educational platform that facilitates user account management, assignment management, peer review process, group project and peer evaluations, progress monitoring, and system maintenance.

The MVP will allow users (students, instructors, administrators) to create accounts, log in, and reset passwords securely. Instructors will be able to create courses, groups, and assignments. Students will be able to upload assignments and submit feedback on their peers' work anonymously. Administrators will be able to manage user accounts, system settings, and maintain the overall system health. Admins must also have the ability to receive and respond to user reports.

The boundaries of the system include secure login and authentication mechanisms, quick load times, accessible user interface, scalability to accommodate future growth, and ease of maintenance and update. The system will be developed using JavaScript, with Vite Project Bundler, React.JS for building the UI, Node.js with Express.js for handling server-side logic, and a RDBMS like PostgreSQL for data storage. The system will comply with relevant privacy regulations to protect student data.

### Measurable project objectives and related success criteria (scope of project)

**Project Objectives:**

1. **User Management**: Develop a secure and simple user management system that allows account creation, authentication, and role-based control. Success will be measured by the system's ability to handle these tasks without errors and with accuracy.
2. **Assignment Management**: Implement a vast assignment management system that supports assignment creation, submission, deadline management, and feedback mechanisms. Success will be measured by the system's ability to manage assignments effectively and provide accurate feedback on time.
3. **Peer Review Process**: Develop an anonymous peer review process that allows students to review their peers' assignments. Success will be measured by the fairness and anonymity of the reviews and its use.
4. **Group Project Evaluations**: Implement a system for managing group projects and peer evaluations. Success will be measured by the system's ability to form groups, assign tasks, and fairly and anonymously give peer feedbacks.
5. **Progress Monitoring**: Create a dashboard for instructors and students to monitor progress and assignment statuses. Success will be measured by the accuracy of the information provided on the dashboard.
6. **System Maintenance**: Develop a system maintenance module that allows administrators to manage user accounts, system settings, receive & respond to user reports and maintain overall system health. Success will be measured by the the absence of critical errors.

**Success Criteria:**

1. **Security**: The system will have secure login and authentication mechanisms, ensuring data protection and privacy. Success will be measured by the absence of security breaches and compliance with decided regulations.
2. **Usability**: The system will have an intuitive and accessible UI. Success will be measured by user satisfaction and the ease of use.
3. **Scalability**: The system will be scalable to accommodate future growth. Success will be measured by the system's ability to handle new data volume and user count without making it less efficient.
4. **Reliability**: The system will have high reliability and minimal downtime. Success will be measured by the absence of critical failures.
5. **Maintainability**: The system will be easy to maintain and update. Success will be measured by the ease of implementing updates and the clarity in documentation.

## Users, Usage Scenarios and High Level Requirements

### Users Groups:

The primary users of the system can be categorized into three groups: Instructors, Students, and Administrators. Here are their descriptions and high-level goals:

1. **Students**: These are the learners who will be joining classes, submitting assignments, and receiving feedback. Their high-level goals with the system are:
    - To have an easy-to-use interface for managing & submitting their assignments and receiving feedback.
    - To be able to perform peer evaluations anonymously and fairly.
    - To have access to their submission history and feedback received.
    
    **Proto-Persona**:
    
    - **Name**: Emily Johnson
    - **Age**: 20
    - **Major**: Computer Science
    - **Tech Proficiency**: High
    - **Needs**:
        - An intuitive dashboard to view upcoming assignments and deadlines.
        - Simple and straightforward submission process for assignments.
        - Ability to review and rate peers' submissions anonymously.
        - Access to detailed feedback and grades for personal improvement.
    - **Pain Points**:
        - Difficulty navigating complex interfaces.
        - Lack of clarity in assignment requirements and deadlines.
        - Inability to view past submissions and feedback easily.
2. **Instructors**: These are the teachers who will be creating classes, assignments, groups and rubrics. Their high-level goals with the system are:
    - To have a user-friendly, simple, fast, and efficient interface for managing classes and assignments.
    - To be able to monitor and evaluate both individual and group performances easily.
    - To give/take access to/from assignments for students and classes.
    
    **Proto-Persona**:
    
    - **Name**: Sarah Thompson
    - **Age**: 45
    - **Subject**: English Literature
    - **Tech Proficiency**: Medium
    - **Needs**:
        - A streamlined process for creating and assigning coursework.
        - Tools to track student progress and participation.
        - Easy access to analytics and reports on student performance.
        - Flexibility in managing group assignments and peer reviews.
    - **Pain Points**:
        - Time-consuming setup of assignments and grading rubrics.
        - Difficulty in tracking and managing large volumes of student data.
        - Limited tools for monitoring group dynamics and individual contributions.
3. **Administrators**: These are the system managers who will be overseeing the overall system, including user accounts and system configurations. Their high-level goals with the system are:
    - To have the ability to manage the overall system effectively and efficiently.
    - To ensure the system is secure, reliable, and maintains high performance.
    - To ensure the system is scalable and can accommodate future growth.
    - To receive and respond to user reports.
    
    **Proto-Persona**:
    
    - **Name**: Michael Lee
    - **Age**: 38
    - **Position**: IT Manager
    - **Tech Proficiency**: High
    - **Needs**:
        - Comprehensive tools for user account management and system configuration.
        - Robust security measures to protect sensitive data.
        - Monitoring tools to track system performance and identify potential issues.
        - Scalability to support increasing numbers of users and data.
    - **Pain Points**:
        - Managing user permissions and ensuring data privacy.
        - Keeping the system updated and secure against emerging threats.
        - Balancing performance with the need for new features and enhancements.

These proto-personas help us understand the needs and wants of each user group, enabling us to design and develop a system that meets their specific requirements. It's important to note that the needs of these user groups may evolve over time, and the system should be flexible enough to accommodate these changes.

### Envisioned Usage

Here are the user scenarios for each user group:

1. **Students:** Students will begin by creating/registering their accounts or logging in using their credentials. Once logged in, they will be presented with their personalized class dashboard, where they can view vital class/assignment information. Furthermore, the user's dashboard will utilize graphical quick link cards, links, buttons, etc to quickly navigate and further enhance the user experience. Within each class, students can view assignments and submission deadlines. A deadline will exist for each assignment and the student can view the deadline date/time for each assignment on the assignments tab. Similarly, there will be a peer-review tab that hosts assignments that are allocated to the current user by the instructor and the student can view every assignment they are required to peer-review. After the submission deadline passes, students will participate in the peer review process by anonymously reviewing a set number of their peers' assignments based on the instructor-defined rubric.
    - **Scenario**: A student wants to submit an assignment.
        - The student logs into the system and navigates to their class.
        - They select the assignment they want to submit.
        - They upload their assignment in the required format and submit it.
        - The system confirms the successful submission of the assignment.
    - **Scenario**: A student wants to review feedback on their assignment.
        - The student logs into the system and navigates to their class.
        - They select the assignment they want to review.
        - The system displays the feedback provided by the instructor.
2. **Instructors:** Instructors will begin by creating/registering their accounts or logging in using their credentials. On initial account creation, the instructor will have a generic student account but, all users will be greeted with a visual prompt asking whether the user is an instructor. This graphical prompt will lead to a form for applying as an instructor (for the system), the instructor will click on the visual prompt to fill out the personalized instructor information form and submit the information to be reviewed by the admin to be granted instructor roles. Once the admin approves the role, instructors will be presented with their personalized class dashboard, where they can view vital information regarding the classes they are hosting. Furthermore, the instructor's dashboard will utilize graphical quick link cards, buttons, prompts, etc, to provide quick access to frequently needed information and also enhance the user experience. The instructor will navigate to a class page to view all currently active classes and will have the option to create a new class.
    - **Scenario**: An instructor wants to create a new class and add assignments.
        - The instructor logs into the system using their credentials.
        - They navigate to the "Create Class" section and fill in the necessary details to create a new class.
        - Once the class is created, they navigate to the "Add Assignment" section within the class.
        - They fill in the assignment details and set a deadline for the assignment.
        - The system confirms the creation of the assignment and adds it to the class.
    - **Scenario**: An instructor wants to monitor student progress.
        - The instructor logs into the system and navigates to the "Dashboard".
        - They select a class to view the progress of the students.
        - The system displays a comprehensive report of student progress and assignment statuses.
3. **Administrators:** An admin user will login via the login portal and will have access to various administrative controls. An admin will be able to oversee transactions of user accounts. Administrators will configure system settings, manage class and assignment storage/data, ensure software maintenance. Admins can review user feedback forms to further maintain and improve the system. 
    - **Scenario**: An administrator wants to manage user accounts.
        - The administrator logs into the system and navigates to the "User Management" section.
        - They can view all user accounts, and have the ability to activate, deactivate, or modify user accounts.
        - They can assign instructor roles for users who submitted an instructor form
    - **Scenario**: An administrator wants to monitor system health.
        - The administrator logs into the system and navigates to the "System Health" section.
        - The system displays information about system performance, uptime, and any ongoing issues.

These scenarios provide a high-level overview of how different user groups will interact with the system. They highlight the key functionalities of the system from the perspective of each user group. Please note that these are simplified scenarios and the actual user journey may involve more steps and interactions. The aim is to develop a minimal viable product (MVP) that fulfils these core scenarios effectively and efficiently. Additional features and enhancements can be added in future iterations based on user feedback and requirements.

### Requirements:

#### Functional Requirements:

- User Management
  - Account Creation and Authentication
    - Users (students, instructors, administrators) must be able to create accounts, log in, and reset passwords securely.
    - The admin must be able to grant instructor permissions.
  - Role-Based Access Control
    - The system must provide different functionalities based on user roles (student, instructor, administrator).
    - The system must allow students and instructors to reset their passwords via a "Forgot Password" feature in the login/signup process.
    - The system must enable navigation for assignments and classes.
    - The system must allow instructors to add or remove classes and add or remove students from classes.
    - The system must allow students to view and join classes.
    - The system must support notifications via Email.

- Assignment Management
  - Assignment Creation
    - Instructors must be able to create assignments for their classes.
    - Instructors must be able to create a rubric associated with each assignment.
  - Submission Handling
    - Students must be able to upload assignments in various formats.
  - Deadline Management
    - The system must allow instructors to set and manage deadlines for assignments.
    - The system must activate the peer evaluation section after the assignment submission deadline.
  - Feedback Mechanism
    - Instructors must be able to provide feedback on student submissions, which students must be able to view.
    - Students must be able to view feedback from Instructors as well as peers.


- Peer Review Process
  - Peer Assignment Distribution
    - Instructors must be able to assign peer reviews to students, ensuring each student reviews a predetermined number of their peers' assignments.
  - Anonymous Reviews
    - The peer review process must be anonymous to ensure fairness.
  - Feedback Submission
    - Students must be able to submit reviews and feedback on their peers' work.
    - Students must fill out an associated rubric set by the instructor for each assignment.

- Group Project Evaluations
  - Group Formation
    - Instructors and students must be able to create and manage student groups for projects.
  - Individual Contribution Evaluation
    - Students must be able to evaluate their peers' contributions within group projects anonymously.
  - Fairness Mechanism
    - The system must include mechanisms to ensure fair evaluation of individual contributions.
    - The system must allow instructors to set a percentage of an assignment's grade to be based on peer feedback.
    - Instructors must be notified or have the ability to view peer-reviewed submissions to ensure they are done fairly and on time.

- Progress Monitoring
  - Dashboard for Instructors
    - The system must provide a comprehensive dashboard for instructors to monitor student progress and assignment statuses.
    - The instructor's dashboard must include:
      - Overall stats of the classroom categorizes by strong and weak grade areas 
      - Option to view individual student's progress tracking
  - Student Progress Tracking
    - Students must be able to track their own assignment submission statuses and received feedback.
    - The student's dashboard must include:
      - Overall stats of strong and weak grade areas  
      - Lists of assignments with submission and feedback statuses

- System Maintenance
  - Admin Control
    - Administrators must be able to manage user accounts, system settings, and maintain overall system health.
    - Administrators must be able to receive and respond to user reports.

#### Non-functional Requirements:

- Security
  - The system must implement secure login and authentication mechanisms, including password encryption using Passport.js.
  - The system must ensure data protection and privacy by using TLS handshakes and other encryption techniques.
  - The system must comply with local regulations as necessary such as GDPR and FERPA.

- Usability
  - The system must have an intuitive and accessible user interface suitable for all user roles.
  - The system must be responsive and function well on both mobile and desktop devices.

- Scalability
  - The system must be scalable to accommodate future growth in the number of users and data volume.

- Reliability
  - The system must ensure high availability and minimal downtime.
  - The system must be tested to handle simultaneous use, ensuring that multiple users can make edits without causing application errors or data inconsistencies.

- Maintainability
  - The system must be easy to maintain and update.
  - The system must include clear documentation to support future development and maintenance efforts.

#### User Requirements:

- All Users
  - Users (students, instructors, administrators) must be able to create accounts.
  - Users must be able to securely log in to their accounts.
  - Students and/or Instructors must be able to reset their passwords via a "Forgot Password" feature during the login/signup process.
  - Students and/or Instructors must be able to create and manage student groups for projects.
  - All users must be able to navigate through assignments and classes.
  - All users must get notifications via email.

- Students
  - Students must be able to view and join classes.
  - Students must be able to upload assignments in various formats.
  - Students must be able to view feedback provided by instructors.
  - Students must be able to submit reviews and feedback on their peers' work anonymously.
  - Students must fill out an associated rubric set by the instructor for each assignment.
  - Students must be able to evaluate their peers' contributions within group projects anonymously.
  - Students must be able to track their own assignment submission statuses and received feedback.
  - The student's dashboard must include overall stats of strong and weak grade areas.
  - The student's dashboard must include lists of assignments with submission and feedback statuses.

- Instructors
  - Instructors must be able to add or remove classes and add or remove students from classes.
  - Instructors must be able to create assignments for their classes.
  - Instructors must be able to create rubrics associated with each assignment.
  - Instructors must be able to set and manage deadlines for assignments.
  - Instructors must be able to provide feedback on student submissions.
  - Instructors must be able to assign peer reviews to students, ensuring each student reviews a predetermined number of their peers' assignments.
  - Instructors and students must be able to create and manage student groups for projects.
  - Instructors must be able to set a percentage of an assignment's grade to be based on peer feedback.
  - Instructors must be notified or have the ability to view peer-reviewed submissions to ensure they are done fairly and on time.
  - The instructor's dashboard must include overall stats of the classroom categorized by strong and weak grade areas.
  - The instructor's dashboard must include an option to view individual student's progress tracking.

- Administrators
  - Administrators must be able to grant instructor permissions.
  - Administrators must be able to manage user accounts.
  - Administrators must be able to manage system settings.
  - Administrators must be able to receive and respond to user reports.


#### Technical Requirements:

- Frontend Requirements

  - Project Setup
    - Bundler: Use Vite for dependency management and project bundling.
    - Framework: Use React for building the user interface.
      - Routing: Utilize React-Router-Dom for routing.
    - Styling: Implement TailwindCSS for styling.
    - Icons: Integrate Heroicons for icons.
    - UI Components: Use shadcn/ui for customizable and ready-to-go components such as buttons, forms, and modals.
  - Compatibility
    - Ensure compatibility with all major web browsers.
    - Ensure the application is responsive and works seamlessly on mobile devices.

- Backend Requirements

  - Framework and Server
    - Framework: Use Node.js.
    - Server: Use Express.js for handling server-side logic and APIs.
  
  - Database
    - Type: Use a relational database – PostgreSQL.
    - ORM: Use an ORM to communicate with the database using JavaScript queries.
      - Preferred ORMs: Drizzle ORM or Prisma ORM for fast and efficient queries.

- API Development
  - Type: Develop RESTful APIs using Express.js.
  - Security: Ensure APIs are secure and efficient.

- Testing and Deployment
  
  - Automated Testing

    - Frameworks: 
      - Use Jest for unit tests and integration tests.
      - Use Cypress for end-to-end (e2e) testing.
    - Test Coverage: Implement both regression and unit tests to ensure reliability and prevent regressions.
  
  - CI Pipeline
    - Use Drone CI for continuous integration.

- Other Libraries and Tools

  - Authentication
    - Use Passport.js for authentication, allowing for multiple authentication paradigms.

  - File Handling
    - PDF Viewing: Use PDF.js.

- Data Security
  - Encryption: Implement data encryption techniques such as password hashing to ensure data security.

### **Tech Stack**

### **User Interaction Technology**

- **Web Browser**: Users will interact with the Peer Review Application via web browsers (e.g., Chrome, Firefox, Safari).
    - *Justification*: Web browsers are universally accessible, require no additional installation, and provide a consistent user experience across devices.

### **Interface Technology**

- **Frontend Framework**: React
    - *Justification*: React is a popular and widely used JavaScript library for building user interfaces, known for its flexibility and component-based architecture.
- **Styling**: TailwindCSS
    - *Justification*: TailwindCSS provides a utility-first CSS framework that helps in creating responsive and customizable designs quickly.
- **Routing**: React-Router-Dom
    - *Justification*: React-Router-Dom is a standard library for routing in React applications, enabling the creation of dynamic and multi-page web applications.

### **Logic Handling Technology**

- **Backend Framework**: Node.js with Express.js
    - *Justification*: Node.js allows for server-side JavaScript execution, making it easy to build scalable network applications. Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

### **Data Storage Technology**

- **Database**: PostgreSQL
    - *Justification*: PostgreSQL is a powerful, open-source relational database system known for its reliability, robustness, and performance.

### **Programming Languages**

- **Frontend**: JavaScript (React)
    - *Justification*: JavaScript is essential for building interactive web applications and is widely supported across all web browsers.
- **Backend**: JavaScript (Node.js)
    - *Justification*: Using JavaScript for both frontend and backend development provides a consistent language environment, streamlining development and maintenance.

### **API and Additional Libraries**

- **API Development**: RESTful APIs using Express.js
    - *Justification*: RESTful APIs are standard for web services, providing a straightforward way to interact with the backend services.
- **Authentication**: Passport.js
    - *Justification*: Passport.js is a flexible and modular authentication middleware for Node.js, supporting various authentication strategies.
- **File Handling**: PDF.js
    - *Justification*: PDF.js is a popular library for rendering PDFs in web applications.

### **High-Level Risks**

1. **Data Security and Privacy**
    - *Risk*: Potential breaches of sensitive user data.
    - *Mitigation*: Implement robust security measures, such as data encryption, secure authentication, and regular security audits.
2. **Scalability**
    - *Risk*: Application performance issues as the number of users grows.
    - *Mitigation*: Design the system with scalability in mind, using efficient database queries, load balancing, and optimizing code performance.

### **Assumptions and Constraints**

- **Assumptions**:
    - Users have access to modern web browsers.
    - Institutions will support the integration of the application within their existing systems.
    - Client prefers using free/open-source services or libraries
- **Constraints**:
    - Limited time and resources for development.
    - Compliance with data privacy regulations (GDPR, FERPA).
    - Ensuring cross-browser compatibility and responsiveness.
    - Lack of access to paid libraries or services to include in the web-app.

### **Summary Milestone Schedule**


| Milestone | Deliverable |
| --- | --- |
| May 29th | Project Plan Submission |
|  | A short video presentation describing the user groups and requirements for the project. This will be reviewed by your client and the team will receive feedback. |
| June 5th | Design Submission: Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed. The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. It is crucial to show the tests pass for your system here. |
|  | The system architecture at the base level will include a backend running with Node and Express JS which will connect to a Front-End user interface, A database, and an ORM to facilitate database management, An authentication microservice, and an admin management interface. These modules will interact with each other as separate modules that create an environment for data exchange among them and facilitate data management for our peer-reviewing application. Our system design aims to have multiple pages such as a Login/Register view, Dashboard view, Class views, Assignment/Peer-review view, settings view, and other components to easily host the required features for our application. The views/pages will also integrate role-based access to change a view depending on the user type signed in. |
|  | A short video presentation describing the design for the project. This will be reviewed by your client and the team will receive feedback. |
| June 14th | Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested. |
|  | For this milestone, we will determine a few key features. First, we will implement the user interface and backend functionalities for our login component with credentials and role-based permissions, ensuring that students, instructors, and administrators can all log in. Second, we will create the user interface for instructor assignment creation and student assignment submission, with students able to view and submit these assignments through their dashboards. Third, we will create the user interface for creating and managing instructor classes. These features will be thoroughly tested and run with mock data hosting with students able to view and submit assignments for classes and instructors able to create and view classes with a general focus on seamless user experience. |
| July 5th | MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone. Remember that features also need to be tested. Clients will be invited to presentations. |
| | For this milestone, we will present a secure user login with role-based permissions, assignment creation and submission, and class creation and allocation. Additionally, we will create database connectivity to implement class/assignment functionalities for instructors and students, allowing instructors to create and manage classes, and both user types to also have a basic progress monitoring dashboard for statuses and feedback. These features will be thoroughly tested to ensure they function correctly and provide a seamless user experience.  |
| July 19th | Peer testing and feedback: Aim to have an additional two features implemented and tested per team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing. |
| August 2nd | Test-O-Rama: Full scale system and user testing with everyone |
| August 9th | Final project submission and group presentations: Details to follow |

### **Teamwork Planning and Anticipated Hurdles**

### **Team Strengths and Areas for Improvement**

| Category | Bhavya Bhagchandani | Abdul Faiz | Josh Farwig | Mahir Rahman |
| --- | --- | --- | --- | --- |
| Experience | React.js, JS, Bootstrap, HTML5/CSS, PHP, Node.js, Express.js PostgreSQL, jQuery, EJS, MongoDB | React.js, JS, Bootstrap, CSS, PHP, Node.js, MySQL, Tailwind, Firebase | React, JS, TS, PHP, Node.JS, MySQL, Next.JS, TailwindCSS | React JS, Tailwind, CSS, NodeJS, MySQL, NoSQL, Cloudinary, Figma,  |
| Good At | PHP, Node.js, Express.js PostgreSQL, jQuery | Bootstrap, CSS, PHP, JS, MySQL, Firebase | React, JS, MySQL, UI/UX, Backend Functionalites | React JS, Tailwind, JS, UI/UX, Figma |
| Expect to Learn | Docker, TailwindCSS, Vite, DigitalOcean | Express.js, PostgreSQL, Passport.js, Docker | PostgreSQL, Express.JS, Passport.JS, Vite, Drone CI | PostgreSQL, Docker, Passport.js |

### **Task Distribution**

| Category of Work/Features | Bhavya Bhagchandani | Abdul Faiz | Josh Farwig | Mahir Rahman |
| --- | --- | --- | --- | --- |
| Project Management: Kanban Board Maintenance | ✔️ |  | ✔️ |  |
| System Architecture Design |  | ✔️ | ✔️ | ✔️ |
| User Interface Design | ✔️ | ✔️ |  |  |
| CSS Development | ✔️ |  |  | ✔️ |
| Feature 1 | ✔️ |  |  |  |
| Feature 2 | ✔️ |  |  |  |
| Database setup |  | ✔️ | ✔️ |  |
| Presentation Preparation | ✔️ |  |  | ✔️ |
| Design Video Creation |  | ✔️ | ✔️ |  |
| Design Video Editing | ✔️ | ✔️ |  |  |
| Design Report | ✔️ |  |  |  |
| Final Video Creation | ✔️ |  |  | ✔️ |
| Final Video Editing | ✔️ |  |  | ✔️ |
| Final Team Report |  | ✔️ |  |  |
| Final Individual Report | ✔️ | ✔️ | ✔️ | ✔️ |

### **Explanation of Task Distribution**

- **Project Management**: Bhavya and Josh will maintain the Kanban board, ensuring that tasks are well-organized and progress is tracked.
- **System Architecture Design**: Abdul, Josh, and Mahir will collaborate on designing the system architecture, leveraging their expertise in backend and full-stack development.
- **User Interface and CSS Development**: Bhavya and Josh will focus on designing the user interface and developing the CSS to ensure a consistent and appealing look.
- **Feature Development**: Features will be distributed based on team members' strengths, with Bhavya and Mahir focusing on frontend features and Abdul on backend features.
- **Database Setup**: Abdul and Josh will handle the database setup, ensuring efficient data storage and retrieval.
- **Presentation Preparation and Video Creation/Editing**: Bhavya, Josh, and Mahir will prepare presentations and create/edit videos, using their experience in project management and design.
- **Reports**: Team members will contribute to both team and individual reports, ensuring comprehensive documentation of the project.

This distribution ensures that each team member can leverage their strengths while also learning and improving in other areas.