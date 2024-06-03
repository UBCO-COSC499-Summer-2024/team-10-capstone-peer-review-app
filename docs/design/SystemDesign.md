# System Design

## Introduction

Start with a brief introduction of **what** you are building, reminding the reader of the high-level usage scenarios (project purpose).   Complete each section with the required components.  Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).  

Start each section with a lead-in, detailing what it is.  Also, do not just have a collection of images.   Each diagram must be explained clearly. **Do not assume that the reader understands the intentions of your designs**.

## System Architecture Design

Recall the system architecture slides and tell us which architecture pattern you are using and why (it may also be something not in the slides or be a combination). Provide more details about the components you have written, and where these components fit in the overall architecture so we can visualize how you have decomposed your system. Basically, this should all be captured in ONE diagram with the components on them and a few sentences explaining (i) why you chose this architecture and (ii) why the components are where you put them. If you want to just focus on a certain aspect of your system and not show the entire architecture for your system in the diagram, that should be fine as well.

## Use Case Models

Extending from your requirements, the team will need to develop a set of usage scenarios for each user group documented as properly dressed use cases  (including diagrams following the UML syntax and descriptions as presented in class).   You may also want to include journey lines with some use cases. 

| Use Case ID | Use Case Name                        | Actor(s)            |
|-------------|--------------------------------------|---------------------|
| 1           | Register Account                     | All Users           |
| 2           | Login Account                        | All Users           |
| 3           | Forgot Password                      | All Users           |
| 4           | View List of Courses                 | All Users           |
| 5           | Send Reports to Admin                | All Users           |
| 6           | Submit Assignment                    | Student             |
| 6.a         | Comments b/w Instructor & Student    | Student, Instructor |
| 7           | View Assignment Feedback             | Student             |
| 8           | View Assignments & its Details       | Student             |
| 9          | Participate in Peer Review           | Student             |
| 9.a        | Send Peer Review Feedback            | Student             |
| 9.b        | View Peer Review Feedback            | Student             |
| 9.c        | Assign Peer Review Submissions       | Instructor          |
| 9.d        | Manage Peer Review Submissions       | Instructor          |
| 10          | Request to Become Instructor         | Student             |
| 11          | Create New Group                     | Student, Instructor |
| 12          | Manage Group                         | Student, Instructor |
| 13          | Join Group                           | Student             |
| 14          | Create New Class                     | Instructor          |
| 15          | Manage Class                         | Instructor          |
| 15.a        | Kick Students from Class             | Instructor          |
| 15.b        | Add Students to Class                | Instructor          |
| 16          | Upload Assignment                    | Instructor          |
| 16.a        | Add Assignment Rubric                | Instructor          |
| 17          | View Class Dashboard                 | Student, Instructor |
| 18          | View Student's Dashboard (Progress)  | Student, Instructor |
| 19          | Manage User Accounts                 | Administrator       |
| 20          | Monitor System Health                | Administrator       |
| 21          | Configure System Settings            | Administrator       |
| 22          | Review Instructor Perms Applications | Administrator       |
| 23          | Delete & Hide Classes                | Administrator       |
| 24          | View User Reports                    | Administrator       |

| ID:             | 1                             |
|-----------------|-------------------------------|
| Name:           | Register Account              |
| Actor(s):       | All Users                     |
| Flow of Events: |                               |
|                 | 1. User navigates to the registration page. |
|                 | 2. User fills out the registration form and submits it. |
|                 | 4. System creates a new account and sends a confirmation email. |
| Pre-Conditions: |                               |
|                 | 1. User must have a valid email address. |
| Post-Conditions:|                               |
|                 | 1. A new account is created. |
| Description:    | This use case describes how a new user registers for an account. |

| ID:             | 2                             |
|-----------------|-------------------------------|
| Name:           | Login Account                 |
| Actor(s):       | All Users                     |
| Flow of Events: |                               |
|                 | 1. User navigates to the login page. |
|                 | 2. User enters their credentials and submits the form. |
|                 | 3. System authenticates the user and grants access. |
| Pre-Conditions: |                               |
|                 | 1. User must be registered. |
|                 | 2. User must have valid login credentials. |
| Post-Conditions:|                               |
|                 | 1. User is logged into the system. |
| Description:    | This use case describes how a user logs into their account. |

| ID:             | 3                             |
|-----------------|-------------------------------|
| Name:           | Forgot Password               |
| Actor(s):       | All Users                     |
| Flow of Events: |                               |
|                 | 1. User navigates to the forgot password page. |
|                 | 2. User enters their registered email address and submits the form. |
|                 | 3. System sends a password reset link to the user's email. |
| Pre-Conditions: |                               |
|                 | 1. User must be registered. |
| Post-Conditions:|                               |
|                 | 1. User receives a password reset link. |
| Description:    | This use case describes how a user requests a password reset. |

| ID:             | 4                             |
|-----------------|-------------------------------|
| Name:           | View List of Courses          |
| Actor(s):       | All Users                     |
| Flow of Events: |                               |
|                 | 1. User navigates to the courses page. |
|                 | 2. System displays a list of available courses. |
|                 | 3. User can now search for a specific course. |
| Pre-Conditions: |                               |
|                 | 1. User must be logged into the system. |
| Post-Conditions:|                               |
|                 | 1. User views the list of available courses. |
| Description:    | This use case describes how users view the list of available courses. |

| ID:             | 5                             |
|-----------------|-------------------------------|
| Name:           | Send Reports to Admin         |
| Actor(s):       | All Users                     |
| Flow of Events: |                               |
|                 | 1. User clicks the report button (which is present on every page). |
|                 | 2. User fills out the report form and submits it. |
|                 | 3. System sends the report to the administrator. |
| Pre-Conditions: |                               |
|                 | 1. User must be logged into the system. |
| Post-Conditions:|                               |
|                 | 1. Administrator receives the report. |
| Description:    | This use case describes how users send reports to the administrator. |


## Database Design 

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.

## Data Flow Diagram (Level 0/Level 1)

The team is required to create comprehensive Level 0 and Level 1 Data Flow Diagrams (DFDs) to visually represent the system’s data flow, including key processes, data stores, and data movements.  The deliverables will include a high-level context diagram, a detailed Level 1 DFD, and supporting documentation to facilitate the understanding of data movement within the system.   Remember that within a L1 DFD, the same general level of abstraction should apply to all processes (review 310 notes for guidance),

## User Interface (UI) Design

The team is required to put forward a series of UI mock-ups that will be used as starting points for the design of the system   They can be minimal but the team will need to  have at least made some choices about the interaction flow of the application.  You should consider the different major aspects of user interactions and develop UI mockups for those (think about the different features/use cases and what pages are needed; you will have a number most likely).  Additionally, create a diagram to explain the navigation flow for the MVP  prototype (and any alternate flows).  When considering your UI, think about usability, accessibility, desktop and mobile uses.  As a team, you will need to discuss design choices for the system.
