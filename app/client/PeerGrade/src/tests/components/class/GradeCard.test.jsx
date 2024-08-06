import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GradeCard from '@/components/class/GradeCard';

describe('GradeCard Component', () => {
  const mockOnViewGradeDetails = jest.fn();
  const mockProps = {
    reviewId: '1',
    assignmentId: '2',
    classId: '3',
    assignmentTitle: 'Test Assignment',
    grade: 85,
    totalMarks: 100,
    dueDate: '2023-12-31',
    onViewGradeDetails: mockOnViewGradeDetails,
    isGraded: true,
  };

  beforeEach(() => {
    render(
      <MemoryRouter>
        <GradeCard {...mockProps} />
      </MemoryRouter>
    );
  });

  test('renders GradeCard component', () => {
    expect(screen.getByText('Test Assignment')).toBeInTheDocument();
    expect(screen.getByText('Due: 2023-12-31')).toBeInTheDocument();
    expect(screen.getByText('85.00%')).toBeInTheDocument();
  });

  test('renders View Assignment button', () => {
    const viewAssignmentButton = screen.getByText('View Assignment');
    expect(viewAssignmentButton).toBeInTheDocument();
  });

  test('renders View Grade button and triggers onViewGradeDetails', () => {
    const viewGradeDetailsButton = screen.getByText('View Grade');
    fireEvent.click(viewGradeDetailsButton);
    expect(mockOnViewGradeDetails).toHaveBeenCalled();
  });
});