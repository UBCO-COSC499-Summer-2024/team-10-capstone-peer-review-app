# System Design

## Introduction

Start with a brief introduction of **what** you are building, reminding the reader of the high-level usage scenarios (project purpose).   Complete each section with the required components.  Don't forget that you can include [images in your markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images).  

Start each section with a lead-in, detailing what it is.  Also, do not just have a collection of images.   Each diagram must be explained clearly. **Do not assume that the reader understands the intentions of your designs**.

## System Architecture Design

Recall the system architecture slides and tell us which architecture pattern you are using and why (it may also be something not in the slides or be a combination). Provide more details about the components you have written, and where these components fit in the overall architecture so we can visualize how you have decomposed your system. Basically, this should all be captured in ONE diagram with the components on them and a few sentences explaining (i) why you chose this architecture and (ii) why the components are where you put them. If you want to just focus on a certain aspect of your system and not show the entire architecture for your system in the diagram, that should be fine as well.

## Use Case Models

Extending from your requirements, the team will need to develop a set of usage scenarios for each user group documented as properly dressed use cases  (including diagrams following the UML syntax and descriptions as presented in class).   You may also want to include journey lines with some use cases. 

## Database Design 

Provide an ER diagram of the entities and relationships you anticipate having in your system (this will most likely change, but you need a starting point).  In a few sentences, explain why the data is modelled this way and what is the purpose of each table/attribute.  For this part, you only need to have ONE diagram and an explanation.

## Data Flow Diagram (Level 0/Level 1)

The team is required to create comprehensive Level 0 and Level 1 Data Flow Diagrams (DFDs) to visually represent the system’s data flow, including key processes, data stores, and data movements.  The deliverables will include a high-level context diagram, a detailed Level 1 DFD, and supporting documentation to facilitate the understanding of data movement within the system.   Remember that within a L1 DFD, the same general level of abstraction should apply to all processes (review 310 notes for guidance),

## User Interface (UI) Design

The team is required to put forward a series of UI mock-ups that will be used as starting points for the design of the system   They can be minimal but the team will need to  have at least made some choices about the interaction flow of the application.  You should consider the different major aspects of user interactions and develop UI mockups for those (think about the different features/use cases and what pages are needed; you will have a number most likely).  Additionally, create a diagram to explain the navigation flow for the MVP  prototype (and any alternate flows).  When considering your UI, think about usability, accessibility, desktop and mobile uses.  As a team, you will need to discuss design choices for the system.

### Please use the following Figma link for a comprehensive view of our UI: https://www.figma.com/design/DDBLqkl7hRm70yKNdcwFI1/PeerGrade---T10-team-library?node-id=0-1&t=YI9mMfqX5viX6LEv-1

MVP Flow diagram:
![MVP Flow diagram](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/a17dba87-d306-4835-956a-07fe8786e38d)





# PeerGrade Wireframes:
* Our client has expressed that only desktop views are required for this project therefore, no mobile views have been created.
  
## Login UI
* A nice-to-have feature - CWL type login to use and enter the platform however, the bare minimum will provide an authenticated login service with user differentiation of student/instructor/admin.
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/cb7b65e5-6d55-45c3-9b1c-a9c6f14d8447)

## Dashboard UI
* The Dashboard page is the first page accessed after a successful user login. It facilitates easy access to active classes and upcoming assignments with further navigation hosted on the navbar. The navbar also includes a notifications panel for viewing recent changes related to the user account and an avatar to identify the user who is logged in. 
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/e544ba98-23c9-4109-b7a9-35736bcc481a)

## Classes UI
The Class page consists of a variety of data and access links:
1. A classroom navigation for the Home Page, Grades Page, Peoples Page, Groups Page, and Files Page.
2. (nice to have) Announcement panels for recent class announcements and new assignment notifications.
3. Categorized panels to differentiate assignments by weeks/units/however the instructor may name the categories on creation.
4. Class statistics (Class grade view card, average peer grade card)
5. (nice to have) Side action buttons
6. (nice to have) To do a panel
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/64e882a5-22f6-4d53-920d-6fdfd3943be4)
* Hovering over the document icon presents an info message related to the document progress status in terms of grading (For example: "is being graded", "graded", "peer-review grades pending", etc)
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/865c271d-da5f-4932-9306-f9d5ca64fc69)

![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/1a9e3d0f-7830-4e6e-8bb3-b1efe35b5265)

![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/e1716e9d-8ee9-4d86-b1f5-5afdab28d618)


## Assignment Page UI
The assignments page hosts the functionality to view assignment details and submit an assignment. A nice-to-have feature will be hosting assignment comments.
* Under the comments panel, we have a submission attempts view to view all attempted file submissions submitted by the user/student
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/2b1bfe83-854b-4138-b43c-6685d9958890)

![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/baad3305-1970-4469-bc35-8381908c22ff)


## Peer-Reviews UI
* A view to see all peer reviews assigned to a student.
* host a card view and a list view.
* A search bar to filter search assignment titles and view filtered results
* A drop-down menu to select a class and view a specific class's peer-reviewed assignments.
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/6dc10997-561c-493e-b57f-61b2c9256f7f)
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/69c7961e-2b17-49c9-bca8-417d44849ced)


## Viewing/submitting review UI
* A view to view the assignment and download a peer-reviewed document (and view the rubric marks) of each peer-reviewer that leaves a review.
* A filter bar to select a specific review to view (if not selected, it is listed in date-time order).
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/cc8e53f6-7117-4d36-904b-23c126519666)

## Settings UI
* A settings panel to edit user-related details (name, email, change password) and our primary panel for admins to view system maintenance and management-related details
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/c36bb5d5-2737-41d7-8f3a-17dd0a25a3bc)

# Instructor Views:
## Classes UI 
* A page to manage all classes created by the instructor and the ability to create a new class
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/e62e9fc0-ddda-4983-a32c-a6c1a30920f4)
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/24f26d4c-7925-4b27-a697-8851b402194a)


Each tab for announcements, category tabs for assignments, and adding category features will be enabled for instructors to add information wherever necessary.
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/0c1b0b00-1354-4c62-be44-f2a22b91c628)

## Uploading Assignment 
* An Upload assignment page for instructors to fill out assignment and rubric details and manage review selection processes for class students.
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/5ffe83ee-5d3a-4f06-acab-9886410b261e)

## component for selecting peer-reviewers for assignments:
![image](https://github.com/UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app/assets/67985978/1798bb20-c01f-45db-b19e-09fae6839c75)
