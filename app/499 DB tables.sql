CREATE TABLE Users (
  user_id INTEGER SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  pwd VARCHAR(50),
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  group_id INTEGER,
  class_id INTEGER,
  user_type VARCHAR(50) Check (user_type in ('student', 'instructor', 'admin'))
);

CREATE TABLE Classes (
  class_id INTEGER SERIAL PRIMARY KEY,
  instructor_id INTEGER,
  classname VARCHAR (255),
  description TEXT,
  start_date DATE,
  term VARCHAR (5),
  end_date DATE,
  class_size INTEGER,
  FOREIGN KEY (instructor_id) REFERENCES Users(user_id)
);

CREATE TABLE Assignments (
  assignment_id INTEGER SERIAL PRIMARY KEY,
  class_id INTEGER,
  title VARCHAR(50),
  description TEXT,
  due_date Timestamp,
  instructions TEXT,
  file_type VARCHAR(50),
  rubric_id INTEGER,
  evaluation_type VARCHAR(50) Check (evaluation_type in ('peer', 'instructor', 'both')),
  FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

CREATE TABLE Submission (
  submission_id INTEGER SERIAL PRIMARY KEY,
  assignment_id INTEGER,
  student_id INTEGER,
  file_path VARCHAR(255),
  submission_date timestamp,
  feedback TEXT,
  marks INTEGER,
  FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE PeerReview (
  review_id INTEGER SERIAL PRIMARY KEY,
  submission_id INTEGER,
  reviewer_id INTEGER,
  review TEXT,
  review_date timestamp,
  rating INTEGER,
  FOREIGN KEY (submission_id) REFERENCES Submission(submission_id),
  FOREIGN KEY (reviewer_id) REFERENCES Users(user_id)
);

CREATE TABLE GroupProject (
  project_id INTEGER SERIAL PRIMARY KEY,
  assignment_id INTEGER,
  group_name VARCHAR(50),
  student_id INTEGER,
  FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE StudentGroup (
  group_id INTEGER SERIAL PRIMARY KEY,
  group_name VARCHAR(50),
  project_id INTEGER,
  class_id INTEGER,
  student_id INTEGER,
  FOREIGN KEY (project_id) REFERENCES GroupProject(project_id),
  FOREIGN KEY (class_id) REFERENCES Classes(class_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE GroupReview (
  group_review_id SERIAL INTEGER PRIMARY KEY,
  reviewer_id INTEGER,
  project_id INTEGER,
  student_id INTEGER,
  review TEXT,
  review_date timestamp,
  rating INTEGER,
  FOREIGN KEY (reviewer_id) REFERENCES Users(user_id),
  FOREIGN KEY (project_id) REFERENCES GroupProject(project_id),
  FOREIGN KEY (student_id) REFERENCES Users(user_id)
);

CREATE TABLE Rubrics (
  rubric_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

CREATE TABLE Criteria (
  criteria_id SERIAL PRIMARY KEY,
  rubric_id INT NOT NULL,
  FOREIGN KEY (rubric_id) REFERENCES Rubrics(rubric_id),
  description TEXT NOT NULL,
  weight INT
);
CREATE TABLE GradingLevels (
  grading_level_id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  points INT
);
CREATE TABLE AssignmentRubrics (
  assignment_rubric_id SERIAL PRIMARY KEY,
  assignment_id INT NOT NULL,
  FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id),
  rubric_id INT NOT NULL,
  FOREIGN KEY (rubric_id) REFERENCES Rubrics(rubric_id)
);

