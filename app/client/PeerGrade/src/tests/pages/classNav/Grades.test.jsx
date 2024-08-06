import React from 'react';
import { render, screen } from '@testing-library/react';
import Grades from '@/pages/classNav/Grades';
import { submission as submissionsData, user as usersData } from '@/utils/dbData';

// Mock data
const classAssignmentsMock = [
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
      description: "Assignment on solving differential equations.",
      due_date: new Date(2025, 3, 14),
      instructions: "Solve all the differential equations in the given worksheet.",
      file_type: "pdf",
      evaluation_type: "peer"
    },
  ];
const currentUserMock = usersData[1];

// Filter submissions for the current user and class assignments
const userSubmissionsMock = submissionsData.filter(submission => 
  submission.student_id === currentUserMock.user_id && 
  classAssignmentsMock.some(assignment => assignment.assignment_id === submission.assignment_id)
);

test('renders Grades component without crashing', () => {
  render(<Grades classAssignments={classAssignmentsMock} />);

  // Check if the component renders without crashing
  const cardTitle = screen.getByText(/Class Grades/i);
  expect(cardTitle).toBeInTheDocument();

  // Check if the correct number of TableRow components are rendered
  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(userSubmissionsMock.length + 1); // +1 for the header row
});

test('renders Grades row with mock data', () => {
    render(<Grades classAssignments={classAssignmentsMock} />);
  
    // Check if the correct number of TableRow components are rendered
    expect(screen.getByText('Integral Calculations')).toBeInTheDocument();
  });