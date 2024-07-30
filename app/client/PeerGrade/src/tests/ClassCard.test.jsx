// ClassCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClassCard from '@/components/manageClass/ClassCard';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockClassItem = {
  classId: '1',
  classname: 'Math 101',
  description: 'This is a detailed description of the Math 101 class.',
  userCount: 30,
  assignmentCount: 5,
};

describe('ClassCard Component', () => {
  test('renders ClassCard component', () => {
    render(
      <BrowserRouter>
        <ClassCard classItem={mockClassItem} pendingApprovals={0} />
      </BrowserRouter>
    );

    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed description of the Math 101 class.')).toBeInTheDocument();
    expect(screen.getByText('30 students')).toBeInTheDocument();
    expect(screen.getByText('5 assignments')).toBeInTheDocument();
  });

  test('truncates description correctly', () => {
    const longDescription = 'A'.repeat(150);
    render(
      <BrowserRouter>
        <ClassCard classItem={{ ...mockClassItem, description: longDescription }} pendingApprovals={0} />
      </BrowserRouter>
    );

    expect(screen.getByText(`${'A'.repeat(100)}...`)).toBeInTheDocument();
  });

  test('displays pending approvals badge', () => {
    render(
      <BrowserRouter>
        <ClassCard classItem={mockClassItem} pendingApprovals={5} />
      </BrowserRouter>
    );

    expect(screen.getByText('5 Pending')).toBeInTheDocument();
  });

  test('navigates to correct routes on button click', () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <BrowserRouter>
        <ClassCard classItem={mockClassItem} pendingApprovals={0} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/View Class/i));
    expect(navigate).toHaveBeenCalledWith('/class/1');

    fireEvent.click(screen.getByText(/Manage Class/i));
    expect(navigate).toHaveBeenCalledWith('/manage-class/1');
  });
});