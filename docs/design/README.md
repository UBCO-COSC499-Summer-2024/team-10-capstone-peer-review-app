DB Structure and Tables:

1. **User**: Stores information about users including their role (student, instructor, admin) and User names, password, name, email and group number
   
   *Relationships*:
   
   a. Many to many (student) and one to many (instructor) with class
   
   b. Many to many with group and group project
   
   c. one to many with submission, group review
   
2. **Class**: Holds details about classes, including the instructor, start and end dates, term description and class size.
   
   *Relationships*:
   
   a. one to many with assignment
   
   b. one to many with group
   
3. **Assignment**: Contains assignment information such as title, description, due date, instructions, file type required, rubric infoand evaluation type.
   
   *Relationships*:
   
   a. one to many with submission and peer review
   
   b. one to one with group project
   
4. **Submission**: Records submissions for assignments, including the student, asignment, submission date, file path (if necessary) feedback, and marks.
   
5. **PeerReview**: Captures peer reviews for submissions, including reviewer, review text, date, and rating.

   *Relationships*:
   
   a. many to one with submission and user
   
6. **GroupProject**: Details group projects, linking assignments to groups and students.
   
7. **Group**: Represents groups within projects, linking projects to classes and students.

   *Relationships*:

   a. one to many with group project
   
8. **GroupReview**: Stores reviews of group projects, including reviewer, project, reviewed student, review text, date and rating.

   *Relationships*:
    
   a. one to many with group project
   
9. **Rubric**: Defines rubrics for assignments, including a title and description and criteria

   *Relationships*:
    
   a.one to many with assignmen and criteria
   
10. **Criteria**: Defines the single criteria in a rubric including description, high to med to low marks, user assigned marks for grading and feedback.
