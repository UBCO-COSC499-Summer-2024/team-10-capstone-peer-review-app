import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceivedReviews from '@/components/review/ReceivedReviews';

const mockReceivedReviews = [
  {
    reviewId: 1,
    submission: {
      assignment: {
        assignmentId: '1',
        title: 'Assignment 1',
        dueDate: '2023-12-31T00:00:00Z',
        classes: { classname: 'Class 1' },
        rubric: { criteria: [{ maxMark: 10 }] },
      },
    },
    reviewer: { role: 'INSTRUCTOR', firstname: 'John', lastname: 'Doe' },
    criterionGrades: [{ grade: 8 }],
  },
  {
    reviewId: 2,
    submission: {
      assignment: {
        assignmentId: '1',
        title: 'Assignment 1',
        dueDate: '2023-12-31T00:00:00Z',
        classes: { classname: 'Class 1' },
        rubric: { criteria: [{ maxMark: 10 }] },
      },
    },
    reviewer: { role: 'STUDENT', firstname: 'Jane', lastname: 'Smith' },
    criterionGrades: [{ grade: 7 }],
  },
];

const mockOnViewDetails = jest.fn();

describe('ReceivedReviews Component', () => {
  test('renders without crashing', () => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByPlaceholderText('Search assignments...')).toBeInTheDocument();
  });

  test('displays assignment title and class name', () => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
    expect(screen.getByText('Reviews for Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Class 1')).toBeInTheDocument();
  });

  test('expands and collapses reviews', () => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
    const expandButton = screen.getByTestId('expander-open');
    fireEvent.click(expandButton);
    expect(screen.getByTestId('expander-close')).toBeInTheDocument();
  });

  test('filters assignments based on search term', () => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
    const searchInput = screen.getByPlaceholderText('Search assignments...');
    fireEvent.change(searchInput, { target: { value: 'Assignment 1' } });
    expect(screen.getByText('Reviews for Assignment 1')).toBeInTheDocument();
  });

  test('calls onViewDetails when view buttons are clicked', () => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
    const viewButtons = screen.getAllByText('View Grades');
    fireEvent.click(viewButtons[0]);
    expect(mockOnViewDetails).toHaveBeenCalled();
  });
});