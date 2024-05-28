# Project Proposal for Peer Review Application

**Team Number:** 10

**Team Members:**

* Bhavya Bhagchandani
* Abdul Faiz
* Josh Farwig
* Mahir Rahman

## Overview:

### Project purpose or justification (UVP)

This software aims to enhance assignment grading by applying a peer-review system that allows consistent and reliable feedback from peers from a learning institution. It aims to simplify the workflow for students, instructors, and administrators by providing an intuitive and efficient platform for managing assignments, peer reviews, the creation of rubrics and progress tracking, and many other vital tools for the instructors and students to benefit the process. This system aims to provide a system prone to bias when grading assignments and a chance for multiple perspectives before submitting a final grade. Our system aims to be easy to use and easy to integrate for learning institutions to rapidly adopt within their learning ecosystem.

**User Value Proposition**: The system offers an intuitive architecture including differentiated user roles. This makes it easy for students to submit assignments, instructors to create and manage them, and administrators to oversee the system functions. 

**Automated Peer Reviews**: Ensures fair and anonymous peer reviews by following specific rubrics that are assigned by instructors for each assignemnt that is created. The rubric is distributed to each peer-reviewr for each specific assignment and grades are collected for further user/instructor views. 

**Comprehensive Progress Tracking**: Allows students and instructors to monitor progress effectively and ensure timely submissions of peer-reviews.  


### High-level project description and boundaries

The MVP will include User management with account creation, login, role-baed access control, assignment creation, submission, viewing, and feedback platforms, Allow for anonymity amongst peer-reviewers and reviewees, Exhibits progress tracking dashboards that are differentiated for students and instructors, and will host basic admin controls for user and system management.

The boundaries of the system will not initially include advanced features such as PDF/image editing for peer reviews (only edits through local machine and resubmission of edited files), the focus will be tailored for larger screen accessibility with mobile responsiveness but not a dedicated mobile app, and Data back up and disaster recovery plans will not be considered for the scope of the MVP.

### Measurable project objectives and related success criteria (scope of project)

<span style="color: red;">The primary goals for this project </span> are to create an intuitive, efficient, and secure platform for managing assignments, assigning students to certain assignments for peer-review (on a rotational basis among a class), and allowing instructors to create and manage classes that host various capabilites related towards managing/viewing assignemnts. Success for this project means achieving successfulla ccount creations and authentication services for students, instructors, teaching assistants, and administrators which ensure role-based access control that is implemented to effectively simulate a typical class structure. This will aim to provide a streamlined process for assignemnt submissions and peer-reviewed feedback. Specifically, our goals are: 

Additionally, we aim to provide instructors with comprehensive dashboards for montiotring sutdent progres and assignment statuses, while maintaining system security and data privacy. 

To measure success, we will track key performance indictors (KPI) -> <span style="color: red;">(list of indicators....) -> </span> and these snippits of informataion will be viewable and differentiated towards a differentiated dashboard depending on the user role, we aim to have a quick and easy to use system and will allow a user to reach any vital destination within 5-7 clicks, <span style="color: red;">etc etc... (we should discuss these in person)</span>

## Users, Usage Scenarios and High Level Requirements 

### Users Groups:

- Students
    - Description: Students are the primary users of the system. They are typically aged between 18-25 and are comfortable with technology but prioritize ease of use.
    - Goals:
        - Submit assignments and receive peer review feedback promptly.
        - Participate in peer reviews and group projects fairly and anonymously.
        - Track their progress and grades efficiently.
        - Receive timely notifications about deadlines and important updates.
- Instructors
    - Description: University professors or teaching assistants make up the second primary user group. They are typically aged older than students and often manage multiple classes simultaneously.
    - Goals:
        - Create and manage assignments and classes effortlessly.
        - Evaluate student submissions and provide constructive feedback.
        - Assign and oversee peer reviews and group projects.
        - Monitor student progress and performance through a comprehensive dashboard.
- Administrators
    - Description: University IT staff or academic administrators form the third primary user group. They are typically aged older than students and are responsible for maintaining the system's functionality and ensuring compliance with institutional policies.
    - Goals:
        - Manage user accounts and permissions.
        - Ensure system security and data privacy.
        - Oversee system maintenance and updates.

### Envisioned Usage

**Students:** 
  Students will begin by creating/registering their accounts or logging in using their credentials. Once logged in, they will be presented with their personalized class dashboard, where they can view vital class/assignment information. Furthermore, the user's dashboard will utilize graphical quick link cards, links, buttons, etc to provide quick links and further enhance the user experience. Within each class, students can view assignments and submission deadlines. A deadline will exist for each assignment and the student can view the deadline date/time for each assignment on the assignments tab. Similarly, there will be a peer-review tab that hosts assignments that are allocated to the logged-in user by the instructor (with deadlines) and the student can view every assignment they are required to peer-review.  After the submission deadline passes, students will participate in the peer review process by anonymously reviewing a set number of their peers' assignments based on the instructor-defined rubric. They will fill out the rubric and provide constructive feedback ensuring they meet the minimum required evaluations. Students can navigate to a peer-review tab to view any assignments allocated towards themselves to submit a peer review. When ready to submit a peer review, students will upload their reviewed assignments to the submission portal for the assignment to be handed off to the instructor. Students can view their progress and submission statuses, and access feedback through opening up the assignment which provides a view of specific details related to that assignment. 

**Instructors:**
    Instructors will begin by creating/registering their accounts or logging in using their credentials. On initial account creation, the instructor will have a generic student account but, all users will be greeted with a visual prompt asking whether the user is an instructor. This graphical prompt will lead to a form for applying as an instructor (for the system), the instructor will click on the visual prompt to fill out the personalized instructor information form and submit the information to be reviewed by the admin to be granted instructor roles. Once the admin approves the role, instructors will be presented with their personalized class dashboard, where they can view vital information regarding the classes they are hosting. Furthermore, the instructor's dashboard will utilize graphical quick link cards, buttons, prompts, etc, to provide quick access to frequently needed information and also enhance the user experience. The instructor will navigate to a class page to view all currently active classes and will have the option to create a new class. The instructor can create a new class by clicking "Add a new class" and filling out relevant information such as name, term start/end dates, number of students for class, and an email list to invite the class to the students the instructor wishes to invite. The platform will allow instructors to monitor each class's assignment submission in real time, ensuring all students meet deadlines. Once submissions are complete, instructors will assign peer reviews. Instructors can also provide their feedback on student submissions and monitor the peer-review process to ensure fairness and completeness. 

**Administrators:**
An admin user will login via the login portal and will have access to various administrative controls. An admin will be able to oversee transactions of user accounts, ensuring that students, instructors, and other administrators have appropriate access levels and differentiated abilities, and review instructor-requested applications for an instructor role to be assigned when new applications are sent in for review. Administrators will configure system settings, manage class and assignment storage/data, ensure software maintenance, and manage database capacity issues. Admins will monitor system performance and monitor user activity logs to ensure the platform is running smoothly. Admins can review user feedback forms to further maintain and improve the system.

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
    - Students must be able to communicate with the instructor to comment on assignment submission and other concerns.
    - The system must require students to provide a minimum amount of constructive evaluation for each assignment to be counted towards their grade.

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
      - Instructor Class Dashboard
      - Instructor Assignment Dashboard
  - Student Progress Tracking
    - Students must be able to track their own assignment submission statuses and received feedback.
    - The student's dashboard must include:
      - Student Class Dashboard
      - Student Assignment Dashboard
      - Individual Assignment View (including a split view of the assignment, the rubric, and a place to upload the assignment)

- System Maintenance
  - Admin Control
    - Administrators must be able to manage user accounts, system settings, and maintain overall system health.
    - Administrators must be able to receive and respond to user reports.

#### Non-functional Requirements:

- Security
  - The system must implement secure login and authentication mechanisms, including password encryption using Passport.js.
  - The system must ensure data protection and privacy by using TLS handshakes and other encryption techniques.
  - The system must comply with local regulations as necessary such as GDPR and FERPA.

- Performance
  - The system must ensure quick load times with a target of less than 10 seconds and smooth user interactions.
  - The system must provide clear indicators (e.g., progress bars or cycling loads) when data is being loaded.

- Usability
  - The system must have an intuitive and accessible user interface suitable for all user roles.
  - The system must be responsive and function well on both mobile and desktop devices.

- Scalability
  - The system must be scalable to accommodate future growth in the number of users and data volume by Dockerizing the system.

- Reliability
  - The system must ensure high availability and minimal downtime.
  - The system must be tested to handle simultaneous use, ensuring that multiple users can make edits without causing application errors or data inconsistencies.

- Maintainability
  - The system must be easy to maintain and update.
  - The system must include clear documentation to support future development and maintenance efforts.

#### User Requirements:

- Instructors
  - The system must provide instructors with a fast, simple, and user-friendly interface for efficient creation of classes, assignments, and associated rubrics.
  - Instructors must be able to monitor and evaluate both individual student and group performances seamlessly within the system.
  - Instructors require access to detailed progress reports for both students and classes.
  
- Students
  - The system must provide students with an easy-to-use interface for submitting assignments and receiving feedback.
  - Students must be able to perform peer evaluations anonymously and fairly.
  - Students must be able to access their submission history and feedback received on assignments.

- Administrators
  - The system must provide administrative functionalities to manage the overall system, including user accounts and system configurations.

#### Technical Requirements:

- Frontend Requirements

  - Project Setup
    - Bundler: Use Vite for dependency management and project bundling.
    - Framework: Use React for building the user interface.
      - Routing: Utilize React-Router-Dom for routing.
    - Styling: Implement TailwindCSS for styling.
    - Icons: Integrate Heroicons for icons.
    - UI Components: Use HeadlessUI for ready-to-go components such as buttons, forms, and modals.
  
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
  - Security: Ensure APIs are secure and efficient. Research and implement pre-built security functionalities in Express.js.

- Testing and Deployment
  
  - Automated Testing

    - Frameworks: 
      - Use Jest for unit tests and integration tests.
      - Use Cypress for end-to-end (e2e) testing.
    - Test Coverage: Implement both regression and unit tests to ensure reliability and prevent regressions.
  
  - CI/CD Pipelines
    - Use Drone CI for continuous integration.
    - Use Heroku for deployment and updates.

- Other Libraries and Tools

  - Authentication
    - Use Passport.js for authentication, allowing for multiple authentication paradigms.

  - File Handling
    - PDF Viewing: Use PDF.js.

- Compliance

  - Privacy Regulations
    - Ensure the application complies with local privacy regulations (e.g., GDPR, FERPA) to protect user data.
  
  - Data Security
    - Encryption: Implement data encryption to ensure data security.
    - Password Hashing: Use MD5 hashing for passwords.
    - Consent Management: Implement consent management to meet compliance requirements.
    - Audit Logging: Implement audit logging for tracking user actions and meeting compliance standards.


## Tech Stack
Identify the “tech stack” you are using. This includes the technology the user is using to interact with your software (e.g., a web browser, an iPhone, any smartphone, etc.), the technology required to build the interface of your software, the technology required to handle the logic of your software (which may be part of the same framework as the technology for the interface), the technology required to handle any data storage, and the programming language(s) involved. You may also need to use an established API, in which case, say what that is. (Please don’t attempt to build your API in this course as you will need years of development experience to do it right.) You can explain your choices in a paragraph, in a list of bullet points, or a table. Just make sure you identify the full tech stack.
For each choice you make, provide a short justification based on the current trends in the industry. For example, don’t choose an outdated technology because you learned it in a course. Also, don’t choose a technology because one of the team members knows it well. You need to make choices that are good for the project and that meet the client’s needs, otherwise, you will be asked to change those choices.  Consider risk analysis. 

## High-level risks
Describe and analyze any risks identified or associated with the project. 

## Assumptions and constraints
What assumptions is the project team making and what are the constraints for the project?

## Summary milestone schedule

Identify the major milestones in your solution and align them to the course timeline. In particular, what will you have ready to present and/or submit for the following deadlines? List the anticipated features you will have for each milestone, and we will help you scope things out in advance and along the way. Use the table below and just fill in the appropriate text to describe what you expect to submit for each deliverable. Use the placeholder text in there to guide you on the expected length of the deliverable descriptions. You may also use bullet points to clearly identify the features associated with each milestone (which means your table will be lengthier, but that’s okay).  The dates are correct for the milestones.  

|  Milestone  | Deliverable |
| :-------------: | ------------- |
|  May 29th  | Project Plan Submission |
| May 29th  | A short video presenation decribing the user groups and requirements for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 5th  | Design Submission: Same type of description here. Aim to have a design of the project and the system architecture planned out. Use cases need to be fully developed.  The general user interface design needs to be implemented by this point (mock-ups). This includes having a consistent layout, color scheme, text fonts, etc., and showing how the user will interact with the system should be demonstrated. It is crucial to show the tests pass for your system here. |
| June 5th  |  A short video presenation decribing the design for the project.  This will be reviewed by your client and the team will receive feedback. |
| June 14th  | Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have 3 features working for this milestone (e.g., user log-in with credentials and permissions counts as 1 feature). Remember that features also need to be tested.  |
| July 5th  | MVP Mini-Presentations: A short description of the parts of the envisioned usage you plan to deliver for this milestone. Should not require additional explanation beyond what was already in your envisioned usage. This description should only be a few lines of text long. Aim to have close to 50% of the features working for this milestone.  Remember that features also need to be tested. Clients will be invited to presentations.|
| July 19th  | Peer testing and feedback: Aim to have an additional two features implemented and tested **per** team member. As the software gets bigger, you will need to be more careful about planning your time for code reviews, integration, and regression testing. |
| August 2nd  | Test-O-Rama: Full scale system and user testing with everyone |
| August 9th  |  Final project submission and group presentions: Details to follow |

## Teamwork Planning and Anticipated Hurdles
Based on the teamwork icebreaker survey, talk about the different types of work involved in a software development project. Start thinking about what you are good at as a way to get to know your teammates better. At the same time, know your limits so you can identify which areas you need to learn more about. These will be different for everyone. But in the end, you all have strengths and you all have areas where you can improve. Think about what those are, and think about how you can contribute to the team project. Nobody is expected to know everything, and you will be expected to learn (just some things, not everything).
Use the table below to help line up everyone’s strengths and areas of improvement together. The table should give the reader some context and explanation about the values in your table.

For **experience** provide a description of a previous project that would be similar to the technical difficulty of this project’s proposal.  None, if nothing
For **good At**, list of skills relevant to the project that you think you are good at and can contribute to the project.  These could be soft skills, such as communication, planning, project management, and presentation.  Consider different aspects: design, coding, testing, and documentation. It is not just about the code.  You can be good at multiple things. List them all! It doesn’t mean you have to do it all.  Don’t ever leave this blank! Everyone is good at something!

|  Category  | Team Member 1 | Team Member 2 | Team Member 3 | Team Member 4 | Team Member 5 | Team Member 6 | 
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
|  **Experience**  |  |  |  |  |  |  | 
|  **Good At**  |  |  |  |  |  |  | 
|  **Expect to learn**  | Don’t ever leave this blank! We are all learning.  | Understanding your limits is important. Where do you expect you will need help? | It may not be technical skills. You may be a good coder but never worked with people in a team. Maybe you built a web- site but not used a framework. | It may also be a theoretical concept you already learned but never applied in practice. | Think about different project aspects: design, data security, web security, IDE tools, inte- gration testing, CICD, etc. There will be something. | Don’t ever leave this blank! We are all learning. | 

Use this opportunity to discuss with your team who **may** do what in the project. Make use of everyone’s skill set and discuss each person’s role and responsibilities by considering how everyone will contribute.  Remember to identify project work (some examples are listed below at the top of the table) and course deliverables (the bottom half of the table). You might want to change the rows depending on what suits your project and team.  Understand that no one person will own a single task.  Recall that this is just an incomplete example.  Please explain how things are assigned in the caption below the table, or put the explanation into a separate paragraph so the reader understands why things are done this way and how to interpret your table. 

|  Category of Work/Features  | Team Member 1 | Team Member 2 | Team Member 3 | Team Member 4 | Team Member 5 | Team Member 6 | 
| ------------- | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: | :-------------: |
|  **Project Management: Kanban Board Maintenance**  | :heavy_check_mark:  |  | :heavy_check_mark:  |  |  |  | 
|  **System Architecture Designt**  |  | :heavy_check_mark:  | :heavy_check_mark:  | :heavy_check_mark:  |  |  | 
|  **User Interface Design**  | :heavy_check_mark:  | :heavy_check_mark: |  |  |  |  | 
|  **CSS Development**  | :heavy_check_mark:  |  |  |  |  | :heavy_check_mark:  | 
|  **Feature 1**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Feature 2**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **...**  |  |  |  |  |  |  | 
|  **Database setup**  |  |  | :heavy_check_mark:  | :heavy_check_mark:  |  |  | 
|  **Presentation Preparation**  | :heavy_check_mark:  |  |  | :heavy_check_mark:  |  |  | 
|  **Design Video Creation**  |  | :heavy_check_mark:  | :heavy_check_mark:  |  |  |  | 
|  **Design Video Editing**  | :heavy_check_mark:  | :heavy_check_mark:  |  |  |  |  | 
|  **Design Report**  | :heavy_check_mark:  |  |  |  |  |  | 
|  **Final Video Creation**  | :heavy_check_mark:  |  |  |  |  | :heavy_check_mark:  | 
|  **Final Video Editing**  | :heavy_check_mark:  |  |  |  |  | :heavy_check_mark:  | 
|  **Final Team Report**  |  | :heavy_check_mark:  |  |  |  |  | 
|  **Final Individual Report**  |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: |  :heavy_check_mark: | 
