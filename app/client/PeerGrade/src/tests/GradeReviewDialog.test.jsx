import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import GradeReviewDialog from '@/components/review/GradeReviewDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock the UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, onOpenChange, children }) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea {...props} />,
}));

describe('GradeReviewDialog', () => {
  const mockReview = {
    submission: {
      assignment: {
        title: 'Test Assignment',
        rubric: {
          title: 'Test Rubric',
          criteria: [
            {
              criterionId: '1',
              title: 'Criterion 1',
              minMark: 0,
              maxMark: 10,
              criterionRatings: [
                { criterionRatingId: '1', points: 5, description: 'Good' },
                { criterionRatingId: '2', points: 10, description: 'Excellent' },
              ],
            },
          ],
        },
      },
    },
    criterionGrades: [
      { criterionId: '1', grade: 8, comment: 'Well done' },
    ],
  };

  it('renders without crashing', () => {
    const { getByText } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={jest.fn()} onGradeSubmit={jest.fn()} />
    );
    expect(getByText('Grade Peer Review')).toBeInTheDocument();
  });

  it('opens and closes the dialog', () => {
    const onClose = jest.fn();
    const { getByText, rerender } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={onClose} onGradeSubmit={jest.fn()} />
    );
    expect(getByText('Grade Peer Review')).toBeInTheDocument();

    rerender(<GradeReviewDialog review={mockReview} open={false} onClose={onClose} onGradeSubmit={jest.fn()} />);
    expect(() => getByText('Grade Peer Review')).toThrow();
  });

  it('displays the assignment title', () => {
    const { getByText } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={jest.fn()} onGradeSubmit={jest.fn()} />
    );
    expect(getByText('Test Assignment')).toBeInTheDocument();
  });

  it('renders rubric and criteria', () => {
    const { getByText } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={jest.fn()} onGradeSubmit={jest.fn()} />
    );
    expect(getByText('Test Rubric')).toBeInTheDocument();
    expect(getByText('Criterion 1')).toBeInTheDocument();
    expect(getByText('5 points:')).toBeInTheDocument();
    expect(getByText('Good')).toBeInTheDocument();
    expect(getByText('10 points:')).toBeInTheDocument();
    expect(getByText('Excellent')).toBeInTheDocument();
  });

  it('handles grade input correctly', () => {
    const { getByLabelText } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={jest.fn()} onGradeSubmit={jest.fn()} />
    );
    const gradeInput = getByLabelText('Grade:');
    expect(gradeInput.value).toBe('8');
    fireEvent.change(gradeInput, { target: { value: '9' } });
    expect(gradeInput.value).toBe('9');
  });

  it('submits the grades', async () => {
    const onGradeSubmit = jest.fn((e) => e.preventDefault());
    const { getByText } = render(
      <GradeReviewDialog review={mockReview} open={true} onClose={jest.fn()} onGradeSubmit={onGradeSubmit} />
    );
    fireEvent.click(getByText('Submit Grades'));
    await waitFor(() => {
      expect(onGradeSubmit).toHaveBeenCalled();
    });
  });
});