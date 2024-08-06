import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GroupCard from '@/components/class/GroupCard';
import { MemoryRouter } from 'react-router-dom';

const mockGroups = [
  {
    groupId: '1',
    groupName: 'Group 1',
    groupDescription: 'Description 1',
    students: [
      { id: '1', firstname: 'John', lastname: 'Doe', avatarUrl: '' },
      { id: '2', firstname: 'Jane', lastname: 'Smith', avatarUrl: '' },
    ],
  },
  {
    groupId: '2',
    groupName: 'Group 2',
    groupDescription: 'Description 2',
    students: [
      { id: '3', firstname: 'Alice', lastname: 'Johnson', avatarUrl: '' },
      { id: '4', firstname: 'Bob', lastname: 'Brown', avatarUrl: '' },
    ],
  },
];

describe('GroupCard Component', () => {
  it('renders "No groups found" message when there are no groups', () => {
    render(<GroupCard groups={[]} />, { wrapper: MemoryRouter });

    expect(screen.getByText('No groups found.')).toBeInTheDocument();
    expect(screen.getByText('Join or create a group in any class to see it here!')).toBeInTheDocument();
  });

  it('renders group names and descriptions correctly', () => {
    render(<GroupCard groups={mockGroups} />, { wrapper: MemoryRouter });

    mockGroups.forEach(group => {
      expect(screen.getByText(group.groupName)).toBeInTheDocument();
      expect(screen.getByText(group.groupDescription)).toBeInTheDocument();
    });
  });

  it('renders student avatars and names correctly', () => {
    render(<GroupCard groups={mockGroups} />, { wrapper: MemoryRouter });

    mockGroups.forEach(group => {
      group.students.forEach(student => {
        expect(screen.getByText(`${student.firstname} ${student.lastname}`)).toBeInTheDocument();
      });
    });
  });

  it('handles carousel navigation', () => {
    render(<GroupCard groups={mockGroups} />, { wrapper: MemoryRouter });

    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });

    // Initially, the first group's name should be visible
    expect(screen.getByText(mockGroups[0].groupName)).toBeInTheDocument();

    // Click next button
    fireEvent.click(nextButton);
    expect(screen.getByText(mockGroups[1].groupName)).toBeInTheDocument();

    // Click previous button
    fireEvent.click(prevButton);
    expect(screen.getByText(mockGroups[0].groupName)).toBeInTheDocument();
  });
});