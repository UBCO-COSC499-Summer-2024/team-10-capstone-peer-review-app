// __tests__/AssignedReviews.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AssignedReviews from '@/components/review/AssignedReviews';

const mockAssignedReviews = [
  {
    reviewId: 1,
    submission: {
      submissionFilePath: 'path/to/submission.pdf',
      assignment: {
        assignmentId: 'a1',
        title: 'Assignment 1',
        classes: { classname: 'Class 1' },
        dueDate: '2023-12-31',
        rubric: {
          criteria: [
            { criterionId: 'c1', maxMark: 10, criterionRatings: [{ ratingId: 'r1', points: 8 }] },
            { criterionId: 'c2', maxMark: 20, criterionRatings: [{ ratingId: 'r2', points: 15 }] },
          ],
        },
        isPeerReviewAnonymous: false,
      },
    },
    reviewee: { firstname: 'John', lastname: 'Doe' },
    criterionRatings: [
      { criterionRatingId: 'r1', criterionId: 'c1', points: 8 },
      { criterionRatingId: 'r2', criterionId: 'c2', points: 15 }
    ],
    criterionGrades: [
      { criterionId: 'c1', grade: 8 },
      { criterionId: 'c2', grade: 15 }
    ],
  },
];

const mockOnViewDetails = jest.fn();
const mockOnUpdate = jest.fn();

describe('AssignedReviews Component', () => {
  test('renders search input', () => {
    render(<AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={mockOnViewDetails} onUpdate={mockOnUpdate} />);
    expect(screen.getByPlaceholderText('Search assignments...')).toBeInTheDocument();
  });

  test('filters assignments based on search term', () => {
    render(<AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={mockOnViewDetails} onUpdate={mockOnUpdate} />);
    const searchInput = screen.getByPlaceholderText('Search assignments...');
    fireEvent.change(searchInput, { target: { value: 'Assignment 1' } });
    expect(screen.getByText('Reviews for Assignment 1')).toBeInTheDocument();
  });

  test('toggles assignment card expansion', () => {
    render(<AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={mockOnViewDetails} onUpdate={mockOnUpdate} />);
    const expandButton = screen.getByTestId('expander-open');
    fireEvent.click(expandButton);
    expect(screen.getByTestId('expander-close')).toBeInTheDocument();
  });

  test('opens grade review dialog', () => {
    render(<AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={mockOnViewDetails} onUpdate={mockOnUpdate} />);
    const gradeButton = screen.getByText('Re-grade');
    fireEvent.click(gradeButton);
    expect(screen.getByText('Grade Peer Review')).toBeInTheDocument();
  });

  test('opens view submission dialog', () => {
    render(<AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={mockOnViewDetails} onUpdate={mockOnUpdate} />);
    const viewSubmissionButton = screen.getByText('View Student Submission');
    fireEvent.click(viewSubmissionButton);
    expect(screen.getByText('Submission View')).toBeInTheDocument();
  });
});
