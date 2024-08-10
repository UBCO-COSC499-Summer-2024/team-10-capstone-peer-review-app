// ManageClass.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageClass from '@/pages/ManageClass';
import { BrowserRouter as Router } from 'react-router-dom';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useClass } from '@/contexts/contextHooks/useClass';
import { getEnrollRequestsForClass } from '@/api/enrollmentApi';

// Mock dependencies
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/enrollmentApi');

describe('ManageClass', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { role: 'INSTRUCTOR' } });
    useClass.mockReturnValue({ classes: [{ classId: '1', classname: 'Class 1', description: "haha lol" }] });
    getEnrollRequestsForClass.mockResolvedValue({
      status: 'Success',
      data: [
        {
          "requestId": "req1",
          "status": "PENDING",
          "studentId": "student1",
          "classId": "1"
        },
        {
          "requestId": "req2",
          "status": "APPROVED",
          "studentId": "student2",
          "classId": "1"
        },
        {
          "requestId": "req3",
          "status": "PENDING",
          "studentId": "student3",
          "classId": "1"
        }
      ],
    });
  });

  test('renders Manage Classes heading', () => {
    render(
      <Router>
        <ManageClass />
      </Router>
    );
    expect(screen.getByText('Manage Classes')).toBeInTheDocument();
  });

  test('opens AddClassModal when Add a class button is clicked', () => {
    render(
      <Router>
        <ManageClass />
      </Router>
    );
    fireEvent.click(screen.getByText('Add a class'));
    expect(screen.getByText("Add a New Class")).toBeInTheDocument();
  });

  test('renders ClassCard with correct pending approvals', async () => {
    render(
      <Router>
        <ManageClass />
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText('Class 1')).toBeInTheDocument();
      expect(screen.getByText('2 Pending')).toBeInTheDocument();
    });
  });

  test('shows permission message for non-INSTRUCTOR/ADMIN users', () => {
    useUser.mockReturnValue({ user: { role: 'STUDENT' } });
    render(
      <Router>
        <ManageClass />
      </Router>
    );
    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });
});