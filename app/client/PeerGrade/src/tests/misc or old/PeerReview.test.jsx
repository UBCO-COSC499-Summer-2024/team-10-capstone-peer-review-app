import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PeerReview from '@/pages/Reviews';
import { assignment as assignmentsData, iClass as classesData } from '@/utils/dbData';

// Mock data for testing
jest.mock('@/utils/dbData', () => ({
  assignment: [
    {
      assignment_id: 1,
      title: 'Assignment 1',
      description: 'Description for Assignment 1',
      due_date: new Date('2024-07-20'),
      evaluation_type: 'peer',
      class_id: 1,
    },
    {
      assignment_id: 2,
      title: 'Assignment 2',
      description: 'Description for Assignment 2',
      due_date: new Date('2024-07-25'),
      evaluation_type: 'peer',
      class_id: 2,
    },
  ],
  iClass: [
    {
      class_id: 1,
      classname: 'Class 1',
    },
    {
      class_id: 2,
      classname: 'Class 2',
    },
  ],
}));

describe('PeerReview Component', () => {
  test('renders PeerReview component', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    expect(screen.getByText('Peer Reviews')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search assignments...')).toBeInTheDocument();
    expect(screen.getByText('Grid View')).toBeInTheDocument();
    expect(screen.getByText('List View')).toBeInTheDocument();
  });

  test('displays assignments in grid view by default', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
    expect(screen.getAllByText('Open Review')).toHaveLength(2);
  });

  test('switches to list view when List View tab is clicked', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    fireEvent.click(screen.getByText('List View'));

    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
  });

  test('filters assignments based on search term', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search assignments...');

    // Search for "Assignment 1"
    fireEvent.change(searchInput, { target: { value: 'Assignment 1' } });

    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.queryByText('Assignment 2')).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
  });

  test('displays message when no assignments are found', () => {
    render(
      <Router>
        <PeerReview />
      </Router>
    );

    const searchInput = screen.getByPlaceholderText('Search assignments...');

    // Search for a term that does not match any assignments
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Assignment' } });

    expect(screen.getByText('No peer review assignments found.')).toBeInTheDocument();
  });
});
