import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Rubrics from '@/pages/classNav/Rubrics';
import { getAllRubrics, getRubricById, addRubricToAssignment } from '@/api/rubricApi';
import { getAllAssignmentsByClassId } from '@/api/assignmentApi';
import { useParams } from 'react-router-dom';
import { useUser } from "@/contexts/contextHooks/useUser";

jest.mock('@/api/rubricApi');
jest.mock('@/api/assignmentApi');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));
jest.mock('@/contexts/contextHooks/useUser');

describe('Rubrics Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ classId: '1' });
    useUser.mockReturnValue({ user: { userId: '123' }, userLoading: false });

    getAllRubrics.mockResolvedValue({
      data: {
        data: [
          {
            rubricId: '1',
            title: 'Rubric 1',
            description: 'Description 1',
            criteria: [
              {
                title: 'Criterion 1',
                minMark: 0,
                maxMark: 10,
                criteronRatings: [
                  { description: 'Rating 1', points: 5 },
                  { description: 'Rating 2', points: 10 }
                ]
              }
            ]
          }
        ]
      }
    });

    getAllAssignmentsByClassId.mockResolvedValue({
      data: [
        { assignmentId: 'a1', title: 'Assignment 1' },
        { assignmentId: 'a2', title: 'Assignment 2' }
      ]
    });

    getRubricById.mockResolvedValue({
      data: {
        data: {
          title: 'Rubric 1',
          description: 'Description 1',
          criteria: [
            {
              title: 'Criterion 1',
              minMark: 0,
              maxMark: 10,
              criteronRatings: [
                { description: 'Rating 1', points: 5 },
                { description: 'Rating 2', points: 10 }
              ]
            }
          ]
        }
      }
    });

    addRubricToAssignment.mockResolvedValue({});
  });

  test('renders the Rubrics component', async () => {
    render(<Rubrics />);

    expect(screen.getByText('Rubrics')).toBeInTheDocument();
    expect(screen.getByText('Add a Rubric')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Rubric 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });
  });

  test('opens the create drawer', async () => {
    render(<Rubrics />);

    fireEvent.click(screen.getByText('Add a Rubric'));

    await waitFor(() => {
      expect(screen.getByText('Create a Rubric')).toBeInTheDocument();
    });
  });

  test('displays rubric details in a drawer when a rubric is clicked', async () => {
    render(<Rubrics />);

    await waitFor(() => {
      expect(screen.getByText('Rubric 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('View Details'));

    await waitFor(() => {
      expect(screen.getByText('Criterion 1')).toBeInTheDocument();
      expect(screen.getByText('Min Points: 0')).toBeInTheDocument();
      expect(screen.getByText('Max Points: 10')).toBeInTheDocument();
      expect(screen.getByText('Rating 1')).toBeInTheDocument();
      expect(screen.getByText('5 Points')).toBeInTheDocument();
      expect(screen.getByText('Rating 2')).toBeInTheDocument();
      expect(screen.getByText('10 Points')).toBeInTheDocument();
    });
  });

  test('adds a rubric to selected assignments', async () => {
    render(<Rubrics />);

    fireEvent.click(screen.getByText('Add a Rubric'));

    await waitFor(() => {
      expect(screen.getByText('Create a Rubric')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Rubric'));

    await waitFor(() => {
      expect(addRubricToAssignment).toHaveBeenCalled();
      expect(getAllRubrics).toHaveBeenCalled();
    });
  });
});
