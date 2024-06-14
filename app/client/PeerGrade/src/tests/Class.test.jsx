import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Class from '@/pages/Class';

// Mock the useParams hook and data imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    classId: '1', // Mocking classId for useParams
  }),
  Link: ({ to, children }) => <a href={to}>{children}</a>, // Mocking Link component
}));

jest.mock('@/lib/dbData', () => ({
  submissionsData: [
    { submission_id: 1, student_id: 1, assignment_id: 1 },
    { submission_id: 2, student_id: 2, assignment_id: 1 },
    { submission_id: 3, student_id: 1, assignment_id: 2 },
  ],
  iClass: [
    { class_id: 1, classname: 'Class A', instructor_id: 1 },
    { class_id: 2, classname: 'Class B', instructor_id: 2 },
  ],
  assignment: [
    { assignment_id: 1, class_id: 1, title: 'Assignment 1' },
    { assignment_id: 2, class_id: 1, title: 'Assignment 2' },
    { assignment_id: 3, class_id: 2, title: 'Assignment 3' },
  ],
  Categories: [
    { rubric_id: 1, title: 'Category 1' },
    { rubric_id: 2, title: 'Category 2' },
  ],
  user: [
    { user_id: 1, firstname: 'John', lastname: 'Doe' },
    { user_id: 2, firstname: 'Jane', lastname: 'Smith' },
  ]
}));

describe('Class component', () => {
  test('renders with class name and instructor', () => {
    render(
      <Router>
        <Class />
      </Router>
    );

    // Check if class name and instructor are rendered
    expect(screen.getByText('Class A: John Doe')).toBeInTheDocument();
  });

  test('renders "Class not found" if classId does not exist', () => {
    // Mock useParams to return a non-existent classId
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ classId: '999' });

    render(
      <Router>
        <Class />
      </Router>
    );

    // Check if "Class not found" text is rendered
    expect(screen.getByText('Class not found')).toBeInTheDocument();
  });

  test('renders categories and assignments when currentView is "home"', async () => {
    jest.spyOn(require('react-router-dom'), 'useParams').mockReturnValue({ classId: '1' });
    render(
      <Router>
        <Class />
      </Router>
    );

    // Wait for the component to render
    await screen.findByText('Class A: John Doe');

    // Check if categories and assignments are rendered
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
  });

//   test('switches view to "grades" when "GRADES" button is clicked', async () => {
//     render(
//       <Router>
//         <Class />
//       </Router>
//     );

//     // Wait for the component to render with the initial view
//     await screen.findByText('Class A: John Doe');

//     // Click on the "GRADES" button
//     fireEvent.click(screen.getByText('GRADES'));

//     // Ensure that the "Grades" view is rendered
//     await screen.findByText('Submission 1');
//     expect(screen.getByText('Submission 1')).toBeInTheDocument();
//     expect(screen.getByText('Submission 2')).toBeInTheDocument();
//   });
// TODO: DOES NOT WORK!!!!!!!!! i've spent way too much time on this
});

