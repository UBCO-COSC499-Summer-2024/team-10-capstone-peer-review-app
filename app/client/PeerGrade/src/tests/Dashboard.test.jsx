import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '@/pages/Dashboard';

// Mocking useSelector
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mocking dbData
jest.mock('@/lib/dbData', () => ({
  iClass: [
    { class_id: '1', classname: 'Class 1', instructor_id: 'instructor1' },
    { class_id: '2', classname: 'Class 2', instructor_id: 'instructor2' },
  ],
  assignment: [
    { assignment_id: 'assignment1', title: 'Assignment 1', class_id: '1', due_date: new Date(), evaluation_type: 'peer' },
    { assignment_id: 'assignment2', title: 'Assignment 2', class_id: '2', due_date: new Date(), evaluation_type: 'individual' },
    { assignment_id: 'assignment3', title: 'Assignment 3', class_id: '1', due_date: new Date(), evaluation_type: 'peer' },
    { assignment_id: 'assignment4', title: 'Assignment 4', class_id: '2', due_date: new Date(), evaluation_type: 'individual' },
  ],
  user: [
    { user_id: 'instructor1', firstname: 'Instructor', lastname: 'One', class_id: ['1'] },
    { user_id: 'instructor2', firstname: 'Instructor', lastname: 'Two', class_id: ['2'] },
  ],
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock implementation for useSelector
    useSelector.mockReturnValue({
      user: {
        currentUser: {
          class_id: ['1', '2'], // Mocking current user class IDs for testing
        },
      },
    });
  });

  it('renders Dashboard component without crashing', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders upcoming assignments and reviews', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Check if both tables are rendered
    expect(screen.getByText('Upcoming Assignments')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Reviews')).toBeInTheDocument();

    // Check if assignments and reviews are rendered based on mock data
    expect(screen.getAllByText('Assignment 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assignment 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assignment 3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assignment 4').length).toBeGreaterThan(0);
  });

  it('allows pagination in AssignmentTable', async () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Navigate to the next page
    const NextBtns = screen.getAllByText('Next');
    NextBtns.forEach((btn) => {
        fireEvent.click(btn);
    });

    // Check if the next page is rendered
    expect(screen.getAllByText('Assignment 4').length).toBeGreaterThan(0);

    // Navigate back to the previous page
    const PrevBtns = screen.getAllByText('Previous');
    PrevBtns.forEach((btn) => {
        fireEvent.click(btn);
    });

    // Check if the previous page is rendered
    expect(screen.getAllByText('Assignment 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assignment 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assignment 3').length).toBeGreaterThan(0);
  });

//   it('allows sorting by due date in AssignmentTable', () => {
//     render(
//       <Router>
//         <Dashboard />
//       </Router>
//     );
//      // TODO: Implement sorting tests
//   });

});

