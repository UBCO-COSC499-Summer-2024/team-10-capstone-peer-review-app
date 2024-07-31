import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AssignedReviews from '@/components/review/AssignedReviews';
import { MemoryRouter } from 'react-router-dom';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, ChevronDown, ChevronUp, Check } from "lucide-react";
import { GradeReviewDialog } from '@/components/review/GradeReviewDialog';
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

jest.mock('@/api/reviewApi');

const mockAssignedReviews = [
    {
        submission: {
        assignment: {
            assignmentId: '1',
            title: 'Assignment 1',
            dueDate: '2023-12-31',
            classes: {
            classId: '1',
            classname: 'Class 1',
            },
        },
        },
        reviews: [
        {
            reviewId: '1',
            submission: {
            submissionId: '1',
            assignment: {
                assignmentId: '1',
            },
            },
            criterionGrades: [],
        },
        ],
    },
    ];

describe('AssignedReviews Component', () => {
  const onViewDetails = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    render(
      <MemoryRouter>
        <AssignedReviews assignedReviews={mockAssignedReviews} onViewDetails={onViewDetails} onUpdate={onUpdate} />
      </MemoryRouter>
    );
  });

  it('renders the assignment card with title and class name', () => {
    expect(screen.getByText('Reviews for Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Class 1')).toBeInTheDocument();
  });

  it('displays the due date correctly', () => {
    expect(screen.getByText('Due Date: 12/30/2023')).toBeInTheDocument();
  });

  it('shows the number of assigned reviews', () => {
    expect(screen.getByText('1 Assigned Review')).toBeInTheDocument();
  });

  it('toggles the assignment details on button click', () => {
    const toggleButton = screen.getByTestId('expander-open');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('expander-close')).toBeInTheDocument();
  });

  it('renders review buttons and handles click events', () => {
    const gradeButton = screen.getByRole('button', { name: "Grade" });
    const viewDetailsButton = screen.getByRole('button', { name: "View Grade Details" });
    const viewInNewPageButton = screen.getByRole('button', { name: "View in New Page" });

    expect(gradeButton).toBeInTheDocument();
    expect(viewDetailsButton).toBeInTheDocument();
    expect(viewInNewPageButton).toBeInTheDocument();

    fireEvent.click(gradeButton);
    fireEvent.click(viewDetailsButton);
    fireEvent.click(viewInNewPageButton);

    expect(onViewDetails).toHaveBeenCalledTimes(2);
  });
});