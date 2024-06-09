export const classesData = [
  {
    id: '1',
    name: "COSC 414",
    instructor: "Shan Du",
    numStudents: 30,
    numAssignments: 5,
    numPeerReviews: 3,
  },
  {
    id: '2',
    name: "MATH 222",
    instructor: "Paul Tsomone",
    numStudents: 25,
    numAssignments: 4,
    numPeerReviews: 2,
  },
  {
    id: '3',
    name: "COSC 221",
    instructor: "Mohammed Khaled",
    numStudents: 40,
    numAssignments: 6,
    numPeerReviews: 4,
  },
  {
    id: '4',
    name: "COSC 310",
    instructor: "Shan Du",
    numStudents: 35,
    numAssignments: 4,
    numPeerReviews: 2,
  },
  {
    id: '5',
    name: "COSC 341",
    instructor: "Dr Bowen",
    numStudents: 50,
    numAssignments: 5,
    numPeerReviews: 3,
  },
];

export const assignmentsData = [
  // COSC 414 Assignments
  {
    id: '1',
    name: "Integral Calculations",
    className: "COSC 414",
    dueDate: "03/14/25",
    description: "Assignment on integral calculations.",
    shortDesc: "Calculating integrals.",
    peerReviewsDone: 2,
    peerReviewDueDate: "03/21/25",
    forReview: true,
    category: "Unit 1: Integrals and Differentiation"
  },
  {
    id: '2',
    name: "Differential Equations",
    className: "COSC 414",
    dueDate: "04/10/25",
    description: "Assignment on differential equations.",
    shortDesc: "Solving differential equations.",
    peerReviewsDone: 3,
    peerReviewDueDate: "04/17/25",
    forReview: true,
    category: "Unit 1: Integrals and Differentiation"
  },
  {
    id: '3',
    name: "Series and Sequences",
    className: "COSC 414",
    dueDate: "05/01/25",
    description: "Assignment on series and sequences.",
    shortDesc: "Understanding series and sequences.",
    peerReviewsDone: 1,
    peerReviewDueDate: "05/08/25",
    forReview: false,
    category: "Unit 2: Advanced Calculus"
  },
  {
    id: '4',
    name: "Vector Calculus",
    className: "COSC 414",
    dueDate: "05/20/25",
    description: "Assignment on vector calculus.",
    shortDesc: "Working with vectors.",
    peerReviewsDone: 4,
    peerReviewDueDate: "05/27/25",
    forReview: true,
    category: "Unit 3: Vector Calculus"
  },
  {
    id: '5',
    name: "Complex Numbers",
    className: "COSC 414",
    dueDate: "06/10/25",
    description: "Assignment on complex numbers.",
    shortDesc: "Understanding complex numbers.",
    peerReviewsDone: 2,
    peerReviewDueDate: "06/17/25",
    forReview: false,
    category: "Unit 4: Complex Analysis"
  },

  // MATH 222 Assignments
  {
    id: '6',
    name: "Linear Algebra",
    className: "MATH 222",
    dueDate: "04/22/25",
    description: "Assignment on linear algebra.",
    shortDesc: "Linear algebra basics.",
    peerReviewsDone: 1,
    peerReviewDueDate: "04/29/25",
    forReview: false,
    category: "Unit 2: Matrix Algebra"
  },
  {
    id: '7',
    name: "Eigenvalues and Eigenvectors",
    className: "MATH 222",
    dueDate: "05/12/25",
    description: "Assignment on eigenvalues and eigenvectors.",
    shortDesc: "Calculating eigenvalues and eigenvectors.",
    peerReviewsDone: 2,
    peerReviewDueDate: "05/19/25",
    forReview: true,
    category: "Unit 3: Linear Transformations"
  },
  {
    id: '8',
    name: "Vector Spaces",
    className: "MATH 222",
    dueDate: "05/25/25",
    description: "Assignment on vector spaces.",
    shortDesc: "Understanding vector spaces.",
    peerReviewsDone: 3,
    peerReviewDueDate: "06/01/25",
    forReview: true,
    category: "Unit 3: Linear Transformations"
  },
  {
    id: '9',
    name: "Orthogonality",
    className: "MATH 222",
    dueDate: "06/15/25",
    description: "Assignment on orthogonality.",
    shortDesc: "Exploring orthogonal vectors.",
    peerReviewsDone: 1,
    peerReviewDueDate: "06/22/25",
    forReview: false,
    category: "Unit 4: Orthogonality"
  },

  // COSC 221 Assignments
  {
    id: '10',
    name: "Data Structures",
    className: "COSC 221",
    dueDate: "05/11/25",
    description: "Assignment on data structures.",
    shortDesc: "Exploring data structures.",
    peerReviewsDone: 3,
    peerReviewDueDate: "05/18/25",
    forReview: true,
    category: "Unit 3: Data Structures"
  },
  {
    id: '11',
    name: "Algorithm Analysis",
    className: "COSC 221",
    dueDate: "06/01/25",
    description: "Assignment on algorithm analysis.",
    shortDesc: "Analyzing algorithms.",
    peerReviewsDone: 2,
    peerReviewDueDate: "06/08/25",
    forReview: false,
    category: "Unit 4: Algorithms"
  },
  {
    id: '12',
    name: "Graph Theory",
    className: "COSC 221",
    dueDate: "06/20/25",
    description: "Assignment on graph theory.",
    shortDesc: "Understanding graph theory.",
    peerReviewsDone: 4,
    peerReviewDueDate: "06/27/25",
    forReview: true,
    category: "Unit 5: Graph Theory"
  },
  {
    id: '13',
    name: "Dynamic Programming",
    className: "COSC 221",
    dueDate: "07/05/25",
    description: "Assignment on dynamic programming.",
    shortDesc: "Applying dynamic programming techniques.",
    peerReviewsDone: 1,
    peerReviewDueDate: "07/12/25",
    forReview: false,
    category: "Unit 6: Dynamic Programming"
  },

  // COSC 310 Assignments
  {
    id: '14',
    name: "Software Engineering Basics",
    className: "COSC 310",
    dueDate: "03/15/25",
    description: "Assignment on software engineering basics.",
    shortDesc: "Understanding software engineering principles.",
    peerReviewsDone: 2,
    peerReviewDueDate: "03/22/25",
    forReview: true,
    category: "Unit 1: Software Engineering Fundamentals"
  },
  {
    id: '15',
    name: "Design Patterns",
    className: "COSC 310",
    dueDate: "04/15/25",
    description: "Assignment on design patterns.",
    shortDesc: "Exploring design patterns.",
    peerReviewsDone: 3,
    peerReviewDueDate: "04/22/25",
    forReview: true,
    category: "Unit 2: Design Patterns"
  },
  {
    id: '16',
    name: "Software Testing",
    className: "COSC 310",
    dueDate: "05/01/25",
    description: "Assignment on software testing.",
    shortDesc: "Understanding software testing methods.",
    peerReviewsDone: 1,
    peerReviewDueDate: "05/08/25",
    forReview: false,
    category: "Unit 3: Software Testing"
  },
  {
    id: '17',
    name: "Agile Methodologies",
    className: "COSC 310",
    dueDate: "05/20/25",
    description: "Assignment on agile methodologies.",
    shortDesc: "Applying agile methodologies.",
    peerReviewsDone: 4,
    peerReviewDueDate: "05/27/25",
    forReview: true,
    category: "Unit 4: Agile Methodologies"
  },

  // COSC 341 Assignments
  {
    id: '18',
    name: "Human-Computer Interaction",
    className: "COSC 341",
    dueDate: "03/10/25",
    description: "Assignment on human-computer interaction.",
    shortDesc: "Exploring HCI principles.",
    peerReviewsDone: 2,
    peerReviewDueDate: "03/17/25",
    forReview: true,
    category: "Unit 1: HCI Basics"
  },
  {
    id: '19',
    name: "User Interface Design",
    className: "COSC 341",
    dueDate: "04/05/25",
    description: "Assignment on user interface design.",
    shortDesc: "Designing user interfaces.",
    peerReviewsDone: 3,
    peerReviewDueDate: "04/12/25",
    forReview: true,
    category: "Unit 2: UI Design"
  },
  {
    id: '20',
    name: "Usability Testing",
    className: "COSC 341",
    dueDate: "05/01/25",
    description: "Assignment on usability testing.",
    shortDesc: "Conducting usability tests.",
    peerReviewsDone: 1,
    peerReviewDueDate: "05/08/25",
    forReview: false,
    category: "Unit 3: Usability Testing"
  },
  {
    id: '21',
    name: "Interaction Design",
    className: "COSC 341",
    dueDate: "05/20/25",
    description: "Assignment on interaction design.",
    shortDesc: "Designing interactive systems.",
    peerReviewsDone: 4,
    peerReviewDueDate: "05/27/25",
    forReview: true,
    category: "Unit 4: Interaction Design"
  },
];


export const peopleData = {
  instructors: [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ],
  students: [
    { id: '3', name: 'Alice Johnson' },
    { id: '4', name: 'Bob Brown' },
    { id: '5', name: 'Charlie Davis' },
    { id: '6', name: 'Diana Evans' },
    { id: '7', name: 'Eve Foster' }
  ]
};

export const groupsData = [
  {
    id: '1',
    name: 'Group 1',
    members: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Alice Johnson' },
      { id: '4', name: 'Bob Brown' }
    ]
  },
  {
    id: '2',
    name: 'Group 2',
    members: [
      { id: '5', name: 'Charlie Davis' },
      { id: '6', name: 'Diana Evans' },
      { id: '7', name: 'Eve Foster' },
      { id: '8', name: 'Frank Green' }
    ]
  }
  // Add more groups as needed
];
export const filesData = [
  {
    id: '1',
    name: 'Assignment 1 Submission',
    type: 'assignment',
    classId: '1',
    uploadedDate: '03/14/25',
    uploadedBy: 'John Doe',
  },
  {
    id: '2',
    name: 'Peer Review Document',
    type: 'peer-review',
    classId: '1',
    uploadedDate: '03/15/25',
    uploadedBy: 'Jane Smith',
  },
  {
    id: '3',
    name: 'Assignment 2 Submission',
    type: 'assignment',
    classId: '2',
    uploadedDate: '04/12/25',
    uploadedBy: 'Alice Johnson',
  },
  {
    id: '4',
    name: 'Project Report',
    type: 'project',
    classId: '3',
    uploadedDate: '05/01/25',
    uploadedBy: 'Bob Brown',
  },
  {
    id: '5',
    name: 'Assignment 3 Submission',
    type: 'assignment',
    classId: '1',
    uploadedDate: '05/10/25',
    uploadedBy: 'Charlie Davis',
  },
  {
    id: '6',
    name: 'Research Paper',
    type: 'research',
    classId: '4',
    uploadedDate: '06/01/25',
    uploadedBy: 'Diana Evans',
  },
  {
    id: '7',
    name: 'Assignment 4 Submission',
    type: 'assignment',
    classId: '3',
    uploadedDate: '06/20/25',
    uploadedBy: 'Eve Foster',
  },
  {
    id: '8',
    name: 'Peer Review Feedback',
    type: 'peer-review',
    classId: '2',
    uploadedDate: '06/25/25',
    uploadedBy: 'Frank Green',
  },
  {
    id: '9',
    name: 'Final Project Presentation',
    type: 'presentation',
    classId: '5',
    uploadedDate: '07/01/25',
    uploadedBy: 'Grace Hall',
  },
  {
    id: '10',
    name: 'Midterm Exam Submission',
    type: 'exam',
    classId: '2',
    uploadedDate: '04/20/25',
    uploadedBy: 'Henry James',
  },
  {
    id: '11',
    name: 'Assignment 5 Submission',
    type: 'assignment',
    classId: '1',
    uploadedDate: '07/10/25',
    uploadedBy: 'Ivy King',
  },
  {
    id: '12',
    name: 'Lab Report 1',
    type: 'lab',
    classId: '4',
    uploadedDate: '02/20/25',
    uploadedBy: 'Jack Lee',
  },
  {
    id: '13',
    name: 'Final Exam Submission',
    type: 'exam',
    classId: '3',
    uploadedDate: '06/30/25',
    uploadedBy: 'Karen Miller',
  },
  {
    id: '14',
    name: 'Assignment 6 Submission',
    type: 'assignment',
    classId: '5',
    uploadedDate: '08/05/25',
    uploadedBy: 'Leo Nelson',
  },
  {
    id: '15',
    name: 'Project Proposal',
    type: 'project',
    classId: '2',
    uploadedDate: '02/25/25',
    uploadedBy: 'Mona Oliver',
  },
  {
    id: '16',
    name: 'Peer Review Summary',
    type: 'peer-review',
    classId: '4',
    uploadedDate: '03/15/25',
    uploadedBy: 'Nina Perry',
  },
  {
    id: '17',
    name: 'Quiz 1 Submission',
    type: 'quiz',
    classId: '5',
    uploadedDate: '01/10/25',
    uploadedBy: 'Oscar Quinn',
  },
  {
    id: '18',
    name: 'Assignment 7 Submission',
    type: 'assignment',
    classId: '3',
    uploadedDate: '05/25/25',
    uploadedBy: 'Paul Roberts',
  },
  {
    id: '19',
    name: 'Case Study Report',
    type: 'case-study',
    classId: '1',
    uploadedDate: '04/15/25',
    uploadedBy: 'Quinn Stevens',
  },
  {
    id: '20',
    name: 'Assignment 8 Submission',
    type: 'assignment',
    classId: '2',
    uploadedDate: '03/05/25',
    uploadedBy: 'Rachel Taylor',
  },
  {
    id: '21',
    name: 'Term Paper',
    type: 'paper',
    classId: '4',
    uploadedDate: '05/10/25',
    uploadedBy: 'Sam Underwood',
  },
  {
    id: '22',
    name: 'Assignment 9 Submission',
    type: 'assignment',
    classId: '5',
    uploadedDate: '06/05/25',
    uploadedBy: 'Tina Vincent',
  },
  {
    id: '23',
    name: 'Research Proposal',
    type: 'research',
    classId: '1',
    uploadedDate: '02/15/25',
    uploadedBy: 'Uma White',
  },
  {
    id: '24',
    name: 'Assignment 10 Submission',
    type: 'assignment',
    classId: '3',
    uploadedDate: '07/20/25',
    uploadedBy: 'Victor Xander',
  },
  {
    id: '25',
    name: 'Literature Review',
    type: 'review',
    classId: '2',
    uploadedDate: '05/01/25',
    uploadedBy: 'Wendy Young',
  },
  {
    id: '26',
    name: 'Assignment 11 Submission',
    type: 'assignment',
    classId: '4',
    uploadedDate: '06/25/25',
    uploadedBy: 'Xander Zane',
  },
  {
    id: '27',
    name: 'Field Study Report',
    type: 'report',
    classId: '5',
    uploadedDate: '03/20/25',
    uploadedBy: 'Yara Adams',
  },
  {
    id: '28',
    name: 'Assignment 12 Submission',
    type: 'assignment',
    classId: '3',
    uploadedDate: '04/25/25',
    uploadedBy: 'Zach Brown',
  }
];