import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageReviews from '@/pages/ManageReviews';
import { useClass } from '@/contexts/contextHooks/useClass';
import { useUser } from '@/contexts/contextHooks/useUser';
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import reviewAPI from '@/api/reviewApi';
import { toast } from '@/components/ui/use-toast';

// Mock the dependencies
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/assignmentApi');
jest.mock('@/api/submitApi');
jest.mock('@/api/rubricApi');
jest.mock('@/api/reviewApi');
jest.mock('@/components/ui/use-toast');

// Mock scrollIntoView method
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('ManageReviews Component', () => {
  beforeEach(() => {
    useClass.mockReturnValue({
      classes: [{ classId: '1', classname: 'Class 1' }],
      loading: false,
    });
    useUser.mockReturnValue({
      user: { userId: 'user1' },
    });
    getAllAssignmentsByClassId.mockResolvedValue({
      data: [{ assignmentId: '1', title: 'Assignment 1' }],
    });
    getSubmissionsForAssignment.mockResolvedValue({
      data: [
        {
          submissionId: '1',
          submitterId: 'student1',
          submitter: { firstname: 'John', lastname: 'Doe' },
          createdAt: '2023-01-01T00:00:00Z',
        },
      ],
    });
    getRubricsForAssignment.mockResolvedValue({
      data: [{ rubricId: '1', totalMarks: 100, criteria: [{ criterionId: '1', description: 'Criterion 1' }] }],
    });
    reviewAPI.getAllReviews.mockResolvedValue([]);
    reviewAPI.getInstructorReview.mockResolvedValue({ data: null });
    toast.mockImplementation(() => {});
  });

  test('renders ManageReviews component', () => {
    render(<ManageReviews />);
    expect(screen.getByText('Assignment Submissions Overview')).toBeInTheDocument();
  });

  test('fetches and displays assignments when a class is selected', async () => {
    render(<ManageReviews />);
    fireEvent.click(screen.getByText('Select Class'));
    fireEvent.click(screen.getByText('Class 1'));

    await waitFor(() => expect(getAllAssignmentsByClassId).toHaveBeenCalledWith('1'));

    fireEvent.click(screen.getByText('Select Assignment'));
    await waitFor(() => expect(screen.getByText('Assignment 1')).toBeInTheDocument());
  });

  test('fetches and displays submissions when an assignment is selected', async () => {
    render(<ManageReviews />);
    fireEvent.click(screen.getByText('Select Class'));
    fireEvent.click(screen.getByText('Class 1'));

    await waitFor(() => expect(getAllAssignmentsByClassId).toHaveBeenCalledWith('1'));
    fireEvent.click(screen.getByText('Select Assignment'));
    await waitFor(() => expect(screen.getByText('Assignment 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Assignment 1'));
    await waitFor(() => expect(getSubmissionsForAssignment).toHaveBeenCalledWith('1'));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});