// EditRubric.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditRubric from '@/components/rubrics/EditRubric';
import { updateRubricsForAssignment } from '@/api/rubricApi';
import { useToast } from "@/components/ui/use-toast";

jest.mock('@/api/rubricApi');
jest.mock('@/components/ui/use-toast');

describe('EditRubric Component', () => {
  const mockRubricData = {
    rubricId: 1,
    title: 'Test Rubric',
    description: 'Test Description',
    totalMarks: 100,
    criteria: [
      {
        criterionId: 1,
        title: 'Criterion 1',
        criterionRatings: [
          { description: 'Rating 1', points: '10' },
          { description: 'Rating 2', points: '20' }
        ]
      }
    ]
  };

  const mockOnRubricUpdated = jest.fn();
  const mockOnClose = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    useToast.mockReturnValue({ toast: mockToast });
  });

  test('renders correctly with given props', () => {
    render(<EditRubric isOpen={true} onClose={mockOnClose} rubricData={mockRubricData} onRubricUpdated={mockOnRubricUpdated} />);
    expect(screen.getByPlaceholderText('Rubric Title')).toHaveValue('Test Rubric');
    expect(screen.getByPlaceholderText('Rubric Description')).toHaveValue('Test Description');
  });

  test('validates rubric correctly', () => {
    render(<EditRubric isOpen={true} onClose={mockOnClose} rubricData={mockRubricData} onRubricUpdated={mockOnRubricUpdated} />);
    fireEvent.change(screen.getByPlaceholderText('Rubric Title'), { target: { value: '' } });
    expect(screen.getByText('You must fill out all the fields in order to submit the rubric!')).toBeInTheDocument();
  });

  test('adds and removes criteria correctly', () => {
    render(<EditRubric isOpen={true} onClose={mockOnClose} rubricData={mockRubricData} onRubricUpdated={mockOnRubricUpdated} />);
    fireEvent.click(screen.getByTestId('add-criterion'));
    expect(screen.getAllByText('Enter criteria').length).toBe(1);

    console.log(document.body.innerHTML);
    fireEvent.click(screen.queryAllByTestId(/^remove-criterion-/)[1]);
    expect(screen.queryByText('Enter criteria')).not.toBeInTheDocument();
  });

  test('adds and removes ratings correctly', async () => {
    render(<EditRubric isOpen={true} onClose={mockOnClose} rubricData={mockRubricData} onRubricUpdated={mockOnRubricUpdated} />);
    fireEvent.click(screen.getByTestId('add-rating-1'));
    await waitFor(() => {
        expect(screen.getAllByText('Pts').length).toBe(2); // 2 since header Pts counts too
    });

    fireEvent.click(screen.getByTestId('remove-rating-1-2'));
    expect(screen.getAllByText('Pts').length).toBe(1);
  });

  test('handles rubric update correctly', async () => {
    updateRubricsForAssignment.mockResolvedValue({ ...mockRubricData, title: 'Updated Rubric' });
    render(<EditRubric isOpen={true} onClose={mockOnClose} rubricData={mockRubricData} onRubricUpdated={mockOnRubricUpdated} />);
    
    fireEvent.change(screen.getByPlaceholderText('Rubric Title'), { target: { value: 'Updated Rubric' } });
    fireEvent.click(screen.getByText('Update Rubric'));

    expect(updateRubricsForAssignment).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Updated Rubric' }));
  });
});