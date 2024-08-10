
export const user = [
    {
        user_id: 1,
        username: "testUser",
        password: "Password123",
        email: "test@gmail.com",
        firstname: "Test",
        lastname: "User",
        type: "admin", // role
        class_id: [1,2,3,4,5,6,7,8,9,10], //classes
        submissions: [], 
        reviewsDone: [],
        reviewsReceived: [],
        classesInstructed: [],
        Rubric: [],
      },
      {
        user_id: 2,
        username: "jdoe",
        password: "password123",
        firstname: "John",
        lastname: "Doe",
        email: "jdoe@example.com",
        class_id: [1,3,7],
        type: "student"
      },
      {
        user_id: 3,
        username: "asmith",
        password: "password123",
        firstname: "Alice",
        lastname: "Smith",
        email: "asmith@example.com",
        class_id: [2,3,8,9],
        type: "instructor"
      },
      {
        user_id: 4,
        username: "mjohnson",
        password: "password123",
        firstname: "Mike",
        lastname: "Johnson",
        email: "mjohnson@example.com",
        class_id: [1,3,10],
        type: "student"
      },
]

export const addUser = (newUser) => {
    user.push(newUser);
  };

export const iClass = [
  {
    class_id: 1,
    instructor_id: 1,
    classname: "ART 101",
    description: "Introduction to Art.",
    start: Date.now(),
    term: "Winter",
    end: Date.now(), 
    size: 50, 
},
{
    class_id: 2,
    instructor_id: 3,
    classname: "COSC 414",
    description: "Advanced topics in computer science.",
    start: new Date(2025, 0, 10),
    term: "Spring 2025",
    end: new Date(2025, 5, 10),
    size: 30
},
{
    class_id: 3,
    instructor_id: 3,
    classname: "MATH 222",
    description: "Linear Algebra.",
    start: new Date(2025, 0, 10),
    term: "Spring 2025",
    end: new Date(2025, 5, 10),
    size: 25
},
{
    class_id: 4,
    instructor_id: 2,
    classname: "PHYS 101",
    description: "Introduction to Physics.",
    start: new Date(2025, 8, 1),
    term: "Fall 2025",
    end: new Date(2025, 11, 15),
    size: 40
},
{
    class_id: 5,
    instructor_id: 4,
    classname: "CHEM 110",
    description: "General Chemistry.",
    start: new Date(2025, 8, 1),
    term: "Fall 2025",
    end: new Date(2025, 11, 15),
    size: 35
},
{
    class_id: 6,
    instructor_id: 3,
    classname: "BIOL 101",
    description: "Introduction to Biology.",
    start: new Date(2025, 0, 10),
    term: "Spring 2025",
    end: new Date(2025, 5, 10),
    size: 45
},
{
    class_id: 7,
    instructor_id: 2,
    classname: "HIST 201",
    description: "World History.",
    start: new Date(2025, 8, 1),
    term: "Fall 2025",
    end: new Date(2025, 11, 15),
    size: 50
},
{
    class_id: 8,
    instructor_id: 1,
    classname: "ENGL 101",
    description: "Introduction to English Literature.",
    start: new Date(2025, 8, 1),
    term: "Fall 2025",
    end: new Date(2025, 11, 15),
    size: 40
},
{
    class_id: 9,
    instructor_id: 4,
    classname: "ECON 101",
    description: "Principles of Economics.",
    start: new Date(2025, 0, 10),
    term: "Spring 2025",
    end: new Date(2025, 5, 10),
    size: 30
},
{
    class_id: 10,
    instructor_id: 3,
    classname: "PSYC 101",
    description: "Introduction to Psychology.",
    start: new Date(2025, 8, 1),
    term: "Fall 2025",
    end: new Date(2025, 11, 15),
    size: 50
},

]

export const assignment = [
    {
      assignment_id: 1,
      class_id: 1,
      title: "Integral Calculations",
      description: "Assignment on integral calculations.",
      due_date: new Date(2025, 2, 14),
      instructions: "Solve all the integrals in the given worksheet.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
  {
      assignment_id: 2,
      class_id: 1,
      title: "Differential Equations",
      description: "Assignment on differential equations.",
      due_date: new Date(2025, 3, 10),
      instructions: "Solve the differential equations in the worksheet.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
  {
      assignment_id: 3,
      class_id: 2,
      title: "Linear Algebra Basics",
      description: "Assignment on the basics of linear algebra.",
      due_date: new Date(2025, 3, 20),
      instructions: "Complete the problems on linear algebra.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
  {
      assignment_id: 4,
      class_id: 2,
      title: "Matrix Operations",
      description: "Assignment on matrix operations.",
      due_date: new Date(2025, 4, 5),
      instructions: "Solve the matrix operation problems in the worksheet.",
      file_type: "pdf",
      evaluation_type: "instructor"
  },
  {
      assignment_id: 5,
      class_id: 3,
      title: "Vector Spaces",
      description: "Assignment on vector spaces.",
      due_date: new Date(2025, 4, 25),
      instructions: "Explain the concept of vector spaces and solve related problems.",
      file_type: "docx",
      evaluation_type: "peer"
  },
  {
      assignment_id: 6,
      class_id: 3,
      title: "Eigenvalues and Eigenvectors",
      description: "Assignment on eigenvalues and eigenvectors.",
      due_date: new Date(2025, 5, 15),
      instructions: "Find eigenvalues and eigenvectors for given matrices.",
      file_type: "pdf",
      evaluation_type: "instructor"
  },
  {
      assignment_id: 7,
      class_id: 4,
      title: "Newton's Laws",
      description: "Assignment on Newton's Laws of Motion.",
      due_date: new Date(2025, 2, 25),
      instructions: "Explain and solve problems related to Newton's Laws.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
  {
      assignment_id: 8,
      class_id: 4,
      title: "Work and Energy",
      description: "Assignment on work and energy concepts.",
      due_date: new Date(2025, 3, 15),
      instructions: "Solve problems related to work and energy.",
      file_type: "docx",
      evaluation_type: "instructor"
  },
  {
      assignment_id: 9,
      class_id: 5,
      title: "Chemical Reactions",
      description: "Assignment on different types of chemical reactions.",
      due_date: new Date(2025, 2, 20),
      instructions: "Identify and balance chemical reactions.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
  {
      assignment_id: 10,
      class_id: 5,
      title: "Mole Concept",
      description: "Assignment on the mole concept in chemistry.",
      due_date: new Date(2025, 3, 10),
      instructions: "Solve problems related to the mole concept.",
      file_type: "pdf",
      evaluation_type: "instructor"
  },
  {
      assignment_id: 11,
      class_id: 6,
      title: "Cell Structure",
      description: "Assignment on cell structure and functions.",
      due_date: new Date(2025, 3, 30),
      instructions: "Describe the structure and function of different cell organelles.",
      file_type: "pdf",
      evaluation_type: "peer"
  },
]

export const submission = [
    {
        submission_id: 1,
        assignment_id: 1,
        student_id: 1, // foreign key of user id
        file_path: "path/to/file1.pdf",
        submission_date: new Date(2025, 2, 13),
        feedback: "Good work!",
        marks: 90
      },
      {
        submission_id: 2,
        assignment_id: 1,
        student_id: 2, // foreign key of user id
        file_path: "path/to/file2.pdf",
        submission_date: new Date(2025, 2, 13),
        feedback: "Needs improvement.",
        marks: 75
      },
      {
        submission_id: 3,
        assignment_id: 2,
        student_id: 1, // foreign key of user id
        file_path: "path/to/file3.pdf",
        submission_date: new Date(2025, 3, 9),
        feedback: "Excellent!",
        marks: 95
      },
      {
        submission_id: 4,
        assignment_id: 3,
        student_id: 4, // foreign key of user id
        file_path: "path/to/file4.pdf",
        submission_date: new Date(2025, 3, 19),
        feedback: "Good effort.",
        marks: 85
      },
]

export const PeerReview = [
    {
        review_id: 1,
        submission_id: 1,
        reviewer_id: 2, // foreign key of user id
        review: "Well done!",
        review_date: new Date(2025, 2, 20),
        rating: 5
      },
      {
        review_id: 2,
        submission_id: 2,
        reviewer_id: 1, // foreign key of user id
        review: "Needs more details.",
        review_date: new Date(2025, 2, 20),
        rating: 3
      },
      {
        review_id: 3,
        submission_id: 3,
        reviewer_id: 4, // foreign key of user id
        review: "Excellent explanation.",
        review_date: new Date(2025, 3, 16),
        rating: 5
      },
      {
        review_id: 4,
        submission_id: 4,
        reviewer_id: 2, // foreign key of user id
        review: "Good job.",
        review_date: new Date(2025, 3, 26),
        rating: 4
      },

]
export const GroupProject = [
    {
        project_id: 1,
        assignment_id: 1,
        group_name: "Alpha Group",
        student_id: 1 // foreign key of user id
      },
      {
        project_id: 2,
        assignment_id: 2,
        group_name: "Beta Group",
        student_id: 2 // foreign key of user id
      },
      {
        project_id: 3,
        assignment_id: 3,
        group_name: "Gamma Group",
        student_id: 4 // foreign key of user id
      },
      {
        project_id: 4,
        assignment_id: 1,
        group_name: "Delta Group",
        student_id: 2 // foreign key of user id
      },

]
export const Group = [
    {
        group_id: 1,
        project_id: 1,
        class_id: 1,
        student_id: 1
      },
      {
        group_id: 2,
        project_id: 2,
        class_id: 1,
        student_id: 2
      },
      {
        group_id: 3,
        project_id: 3,
        class_id: 2,
        student_id: 4
      },
      {
        group_id: 4,
        project_id: 4,
        class_id: 1,
        student_id: 2
      },

]
export const GroupReview = [
    {
        group_review_id: 1,
        reviewer_id: 1, // foreign key of user id
        project_id: 1,
        student_id: 1,
        review: "Great collaboration.",
        review_date: new Date(2025, 2, 20),
        rating: 5
      },
      {
        group_review_id: 2,
        reviewer_id: 2, // foreign key of user id
        project_id: 2,
        student_id: 2,
        review: "Needs more team effort.",
        review_date: new Date(2025, 3, 16),
        rating: 3
      },
      {
        group_review_id: 3,
        reviewer_id: 4, // foreign key of user id
        project_id: 3,
        student_id: 4,
        review: "Excellent project.",
        review_date: new Date(2025, 3, 26),
        rating: 5
      },
      {
        group_review_id: 4,
        reviewer_id: 2, // foreign key of user id
        project_id: 4,
        student_id: 2,
        review: "Good work.",
        review_date: new Date(2025, 3, 16),
        rating: 4
      },

]
export const Rubric = [
    {
        rubric_id: 1,
        assignment_id: 1,
        title: "Integration Accuracy",
        description: "Accuracy of the integral calculations."
      },
      {
        rubric_id: 2,
        assignment_id: 2,
        title: "Differential Accuracy",
        description: "Accuracy of the differential equations."
      },
      {
        rubric_id: 3,
        assignment_id: 3,
        title: "Algebra Understanding",
        description: "Understanding of linear algebra concepts."
      },
      {
        rubric_id: 4,
        assignment_id: 1,
        title: "Team Contribution",
        description: "Contribution of each team member."
      },

]
export const Categories = [
    {
        category_id: 1,
        rubric_id: 1,
        title: "Calculation Accuracy",
        description: "Accuracy of the calculations.",
        max_mark: 50
      },
      {
        category_id: 2,
        rubric_id: 2,
        title: "Problem Solving",
        description: "Effectiveness in solving differential problems.",
        max_mark: 50
      },
      {
        category_id: 3,
        rubric_id: 3,
        title: "Conceptual Understanding",
        description: "Understanding of algebra concepts.",
        max_mark: 50
      },
      {
        category_id: 4,
        rubric_id: 4,
        title: "Team Participation",
        description: "Active participation in the team.",
        max_mark: 50
      },

]
export const CategoryMarks = [
    {
        mark_id: 1,
        submission_id: 1,
        category_id: 1,
        student_id: 1,
        marks: 40
      },
      {
        mark_id: 2,
        submission_id: 2,
        category_id: 2,
        student_id: 2,
        marks: 35
      },
      {
        mark_id: 3,
        submission_id: 3,
        category_id: 3,
        student_id: 1,
        marks: 45
      },
      {
        mark_id: 4,
        submission_id: 4,
        category_id: 4,
        student_id: 4,
        marks: 50
      },

]
