import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReceivedReviews from '@/components/review/ReceivedReviews';

const mockReceivedReviews = [
  {
    reviewId: '1',
    submission: {
      assignment: {
        assignmentId: 'a1',
        title: 'Assignment 1',
        dueDate: '2023-12-31T23:59:59Z',
        classes: { classname: 'Class 1' },
        rubric: {
          criteria: [{ maxMark: 10 }, { maxMark: 20 }],
        },
      },
    },
    reviewer: { role: 'STUDENT' },
    criterionGrades: [{ grade: 8 }, { grade: 15 }],
  },
  {
    reviewId: '2',
    submission: {
      assignment: {
        assignmentId: 'a1',
        title: 'Assignment 1',
        dueDate: '2023-12-31T23:59:59Z',
        classes: { classname: 'Class 1' },
        rubric: {
          criteria: [{ maxMark: 10 }, { maxMark: 20 }],
        },
      },
    },
    reviewer: { role: 'INSTRUCTOR' },
    criterionGrades: [{ grade: 9 }, { grade: 18 }],
  },
];

const mockOnViewDetails = jest.fn();

describe('ReceivedReviews Component', () => {
  beforeEach(() => {
    render(<ReceivedReviews receivedReviews={mockReceivedReviews} onViewDetails={mockOnViewDetails} />);
  });

  test('renders search input', () => {
    const searchInput = screen.getByPlaceholderText('Search assignments...');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders assignment cards', () => {
    const assignmentTitle = screen.getByText('Reviews for Assignment 1');
    expect(assignmentTitle).toBeInTheDocument();
  });

  test('renders assignment class name', () => {
    const className = screen.getByText('Class 1');
    expect(className).toBeInTheDocument();
  });

  test('renders due date', () => {
    const dueDate = screen.getByText('Due Date: 12/31/2023');
    expect(dueDate).toBeInTheDocument();
  });

  test('renders instructor review badge', () => {
    const instructorBadge = screen.getByText('Instructor Reviewed');
    expect(instructorBadge).toBeInTheDocument();
  });

  test('renders peer review badge', () => {
    const peerReviewBadge = screen.getByText('1 Peer Review');
    expect(peerReviewBadge).toBeInTheDocument();
  });

  test('toggles assignment details on button click', () => {
    const toggleButton = screen.getByTestId('expander-open');
    fireEvent.click(toggleButton);

    const peerReviewText = screen.getByText('Peer Review 1');
    expect(peerReviewText).toBeInTheDocument();

    const instructorReviewText = screen.getByText('Instructor Review');
    expect(instructorReviewText).toBeInTheDocument();
  });

  test('calls onViewDetails with correct arguments when "View in Dialog" is clicked', () => {
    const toggleButton = screen.getByTestId('expander-open');
    fireEvent.click(toggleButton);

    const viewInDialogButton = screen.getAllByText('View in Dialog')[0];
    fireEvent.click(viewInDialogButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockReceivedReviews[0], true);
  });

  test('calls onViewDetails with correct arguments when "View in New Page" is clicked', () => {
    const toggleButton = screen.getByTestId('expander-open');
    fireEvent.click(toggleButton);

    const viewInNewPageButton = screen.getAllByText('View in New Page')[0];
    fireEvent.click(viewInNewPageButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockReceivedReviews[0], false);
  });

  test('filters assignments based on search term', () => {
    const searchInput = screen.getByPlaceholderText('Search assignments...');
    fireEvent.change(searchInput, { target: { value: 'Assignment 2' } });

    const noReviewsText = screen.getByText('No received reviews found.');
    expect(noReviewsText).toBeInTheDocument();
  });
});