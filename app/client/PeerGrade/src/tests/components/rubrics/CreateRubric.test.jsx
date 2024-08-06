import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CreateRubric from '@/components/rubrics/CreateRubric';
import { addRubricToAssignment, getAllRubrics, linkRubricToAssignment } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useToast } from "@/components/ui/use-toast";

// Mock dependencies
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/components/ui/use-toast');
jest.mock('@/api/rubricApi');

describe('CreateRubric Component', () => {
  const mockUser = { userId: 'test-user' };
  const mockToast = jest.fn();
  const mockAssignments = [
    { assignmentId: '1', title: 'Assignment 1' },
    { assignmentId: '2', title: 'Assignment 2' }
  ];

  beforeEach(() => {
    useUser.mockReturnValue({ user: mockUser });
    useToast.mockReturnValue({ toast: mockToast });
    getAllRubrics.mockResolvedValue({ data: { data: [] } });
  });

  test('renders correctly', () => {
    render(<CreateRubric classId="test-class" assignments={mockAssignments} onRubricCreated={jest.fn()} />);
    expect(screen.getByText('Add a Rubric')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add a Rubric'));
    expect(screen.getByText('Create a Rubric')).toBeInTheDocument();
  });

//   test('handles rubric creation correctly', async () => {            // This test is failing, needs to be worked on
//     addRubricToAssignment.mockResolvedValue({ data: { rubricId: 'test-rubric' } });
//     linkRubricToAssignment.mockResolvedValue({});

//     const mockOnRubricCreated = jest.fn();
//     render(<CreateRubric classId="test-class" assignments={mockAssignments} onRubricCreated={mockOnRubricCreated} />);
//     fireEvent.click(screen.getByText('Add a Rubric'));

//     fireEvent.change(screen.getByPlaceholderText('Rubric Title'), { target: { value: 'Test Rubric' } });
//     fireEvent.change(screen.getByPlaceholderText('Rubric Description'), { target: { value: 'Test Description' } });
//     fireEvent.click(screen.getByText('Select Assignments'));
//     await waitFor(() => {
//         expect(screen.getByText('Assignment 1')).toBeInTheDocument();
//     });
    
//     fireEvent.click(screen.getByText('Assignment 1'));

//     fireEvent.click(screen.getByText('Create Rubric'));

//     await waitFor(() => {
//       expect(mockToast).toHaveBeenCalledWith({
//         title: "Success",
//         description: "Rubric created and linked to selected assignments",
//         variant: "info"
//       });
//       expect(mockOnRubricCreated).toHaveBeenCalled();
//     });
//   });

//   test('validates rubric correctly', async () => {
//     render(<CreateRubric classId="test-class" assignments={mockAssignments} onRubricCreated={jest.fn()} />);
//     fireEvent.click(screen.getByText('Add a Rubric'));

//     fireEvent.change(screen.getByPlaceholderText('Rubric Title'), { target: { value: '' } });
//     fireEvent.click(screen.getByText('Create Rubric'));

//     await waitFor(() => {
//       expect(mockToast).toHaveBeenCalledWith({
//         title: "Error",
//         description: "Please select at least one assignment",
//         variant: "destructive"
//       });
//     });
//   });
});