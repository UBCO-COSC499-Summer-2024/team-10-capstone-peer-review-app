# Project Proposal for Peer Review Application

**Team Number:** 10

**Team Members:**

* Bhavya Bhagchandani
* Abdul Faiz
* Josh Farwig
* Mahir Rahman

## Overview:

### Project purpose or justification (UVP)

What is the purpose of this software? What problem does it solve? What is the unique value proposition? Why is your solution better than others?

The proposed software is an educational platform designed to expedite the process of assignment and deadline management, facilitate peer review, and progress monitoring for use in an academic institution. 

The primary purpose of this software is to facilitate better interaction between students, instructors, and administrators. Its objective is to solve the challenges associated with managing assignments, conducting peer reviews efficiently, evaluating group projects, and tracking progress of each and every student.

The unique value proposition of this software is determined by its multi-faceted suite of features created to the needs of all users specified. For all of them, the features are: account creation, accessing course lists and engage in courses.For instructors, it offers a user-friendly UI for creating/deleting courses, assignments, rubrics, create peer evaluation, form groups as well as a dashboard for monitoring student progress. For students, it provides an simple interface for submitting assignments, performing peer evaluations, as well as tracking their submissions and feedbacks. For administrators, it enables the ability to manage the overall system, including user accounts and system configurations and health.

This solution stands out from others due to its focus on simple design, efficient security, scalability, and maintainability. It ensures secure login and authentication mechanisms, accessible UI, scalability to accommodate future growth, and ease of maintenance and update. Furthermore, it complies with relevant privacy regulations to protect student data.

Thus it is clear that, this software provides a comprehensive, secure, and user-friendly solution for managing academic activities, making it a valuable tool for educational institutions. It not only enhances the efficiency of academic processes but also enriches the learning experience for students.

### High-level project description and boundaries

Describe your MVP in a few statements and identify the boundaries of the system. 

The Minimum Viable Product (MVP) for this project is an educational platform that facilitates user account management, assignment management, peer review process, group project and peer evaluations, progress monitoring, and system maintenance. 

The MVP will allow users (students, instructors, administrators) to create accounts, log in, and reset passwords securely. Instructors will be able to create courses, groups, and assignments. Students will be able to upload assignments and submit feedback on their peers' work anonymously. Administrators will be able to manage user accounts, system settings, and maintain the overall system health.

The boundaries of the system include secure login and authentication mechanisms, quick load times, accessible user interface, scalability to accommodate future growth, and ease of maintenance and update. The system will be developed using JavaScript, with Vite Project Bundler, React.JS for building the UI, Node.js with Express.js for handling server-side logic, and a RDBMS like PostgreSQL for data storage. The system will comply with relevant privacy regulations to protect student data.

### Measurable project objectives and related success criteria (scope of project)

Make sure to use simple but precise statement of goals for the project that will be included when it the project is completed.  Remember that goals must be clear and measurable and **SMART**.  It should be clearly understood what success means to the project and how the success will be measured (as a high level, what is success?). 

**Project Objectives:**
1. **User Management**: Develop a secure and simple user management system that allows account creation, authentication, and role-based control. Success will be measured by the system's ability to handle these tasks without errors and with accuracy.

2. **Assignment Management**: Implement a vast assignment management system that supports assignment creation, submission, deadline management, and feedback mechanisms. Success will be measured by the system's ability to manage assignments effectively and provide accurate feedback on time.

3. **Peer Review Process**: Develop an anonymous peer review process that allows students to review their peers' assignments. Success will be measured by the fairness and anonymity of the reviews and its use.

4. **Group Project Evaluations**: Implement a system for managing group projects and peer evaluations. Success will be measured by the system's ability to form groups, assign tasks, and fairly and anonymously give peer feedbacks.

5. **Progress Monitoring**: Create a dashboard for instructors and students to monitor progress and assignment statuses. Success will be measured by the accuracy of the information provided on the dashboard.

6. **System Maintenance**: Develop a system maintenance module that allows administrators to manage user accounts, system settings, and maintain overall system health. Success will be measured by the the absence of critical errors.

**Success Criteria:**
1. **Security**: The system will have secure login and authentication mechanisms, ensuring data protection and privacy. Success will be measured by the absence of security breaches and compliance with decided regulations.

2. **Usability**: The system will have an intuitive and accessible UI. Success will be measured by user satisfaction and the ease of use.

3. **Scalability**: The system will be scalable to accommodate future growth. Success will be measured by the system's ability to handle new data volume and user count without making it less efficient.

4. **Reliability**: The system will have high reliability and minimal downtime. Success will be measured by the absence of critical failures.

5. **Maintainability**: The system will be easy to maintain and update. Success will be measured by the ease of implementing updates and the clarity in documentation.

## Users, Usage Scenarios and High Level Requirements 

### Users Groups:
Provide a a description of the primary users in the system and when their high-level goals are with the system (Hint: there is more than one group for most projects).  Proto-personas will help to identify user groups and their wants/needs. 

The primary users of the system can be categorized into three groups: Instructors, Students, and Administrators. Here are their descriptions and high-level goals:

1. **Instructors**: These are the techers who will be creating classes, assignments, groups and rubrics. Their high-level goals with the system are:
    - To have a user-friendly, simple, fast, and efficient interface for managing classes and assignments.
    - To be able to monitor and evaluate both individual and group performances easily.
    - To give/take access to/from assignment reports for students and classes.

2. **Students**: These are the learners who will be joining classes, submitting assignments, and receiving feedback. Their high-level goals with the system are:
    - To have an easy-to-use interface for managing their assignments and receiving feedback.
    - To be able to perform peer evaluations anonymously and fairly.
    - To have access to their submission history and feedback received.

3. **Administrators**: These are the system managers who will be overseeing the overall system, including user accounts and system configurations. Their high-level goals with the system are:
    - To have the ability to manage the overall system effectively and efficiently.
    - To ensure the system is secure, reliable, and maintains high performance.
    - To ensure the system is scalable and can accommodate future growth.

These proto-personas help us understand the needs and wants of each user group, enabling us to design and develop a system that meets their specific requirements. It's important to note that the needs of these user groups may evolve over time, and the system should be flexible enough to accommodate these changes.

### Envisioned Usage
What can the user do with your software? If there are multiple user groups, explain it from each of their perspectives. These are what we called *user scenarios* back in COSC 341. Use subsections if needed to make things more clear. Make sure you tell a full story about how the user will use your software. An MVP is a minimal and viable, so don’t go overboard with making things fancy (to claim you’ll put in a ton of extra features and not deliver in the end), and don’t focus solely on one part of your software so that the main purpose isn’t achievable. Scope wisely.  Don't forget about journey lines to describe the user scenarios.  

Here are the user scenarios for each user group:

1. **Instructors**
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

2. **Students**
    - **Scenario**: A student wants to submit an assignment.
        - The student logs into the system and navigates to their class.
        - They select the assignment they want to submit.
        - They upload their assignment in the required format and submit it.
        - The system confirms the successful submission of the assignment.
    - **Scenario**: A student wants to review feedback on their assignment.
        - The student logs into the system and navigates to their class.
        - They select the assignment they want to review.
        - The system displays the feedback provided by the instructor.

3. **Administrators**
    - **Scenario**: An administrator wants to manage user accounts.
        - The administrator logs into the system and navigates to the "User Management" section.
        - They can view all user accounts, and have the ability to activate, deactivate, or modify user accounts.
    - **Scenario**: An administrator wants to monitor system health.
        - The administrator logs into the system and navigates to the "System Health" section.
        - The system displays information about system performance, uptime, and any ongoing issues.

These scenarios provide a high-level overview of how different user groups will interact with the system. They highlight the key functionalities of the system from the perspective of each user group. Please note that these are simplified scenarios and the actual user journey may involve more steps and interactions. The aim is to develop a minimal viable product (MVP) that fulfills these core scenarios effectively and efficiently. Additional features and enhancements can be added in future iterations based on user feedback and requirements.

### Requirements:
In the requirements section, make sure to clearly define/describe the **functional** requirements (what the system will do), **non-functional** requirements (performane/development), **user requirements (what the users will be able to do with the system and **technical** requirements.  These requirements will be used to develop the detailed uses in the design and form your feature list.
#### Functional Requirements:
- Describe the characteristics of the final deliverable in ordinary non-technical language
- Should be understandable to the customers
- Functional requirements are what you want the deliverable to do

#### Non-functional Requirements:
- Specify criteria that can be used to judge the final product or service that your project delivers
- List restrictions or constraints to be placed on the deliverable and how to build it; remember that this is intended to restrict the number of solutions that will meet a set of requirements.

#### User Requirements:
- Describes what the user needs to do with the system (links to FR)
- Focus is on the user experience with the system under all scenarios

#### Technical Requirements:
- These emerge from the functional requirements to answer the questions: 
-- How will the problem be solved this time and will it be solved technologically and/or procedurally? 
-- Specify how the system needs to be designed and implemented to provide required functionality and fulfill required operational characteristics.
  
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
