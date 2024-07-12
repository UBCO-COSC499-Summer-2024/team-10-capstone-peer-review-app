import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EditClass from '@/pages/classNav/EditClass';
import { useClass } from "@/contexts/contextHooks/useClass";
import { useLocation, useNavigate } from 'react-router-dom';

// Mocking the useClass hook
jest.mock('@/contexts/contextHooks/useClass', () => ({
  useClass: jest.fn(),
}));

// Mocking the useLocation and useNavigate hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockUpdateClasses = jest.fn();
const mockNavigate = jest.fn();

useClass.mockReturnValue({
  updateClasses: mockUpdateClasses,
  isClassLoading: false,
});

const classItem = {
  classId: '1',
  classname: 'Math 101',
  description: 'Introduction to basic math principles',
  startDate: '2023-09-01',
  endDate: '2023-12-31',
  term: 'Fall 2023',
  classSize: 30,
};

describe('EditClass Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({
      pathname: `/class/${classItem.classId}/edit`,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders the form with class data', () => {
    render(
      <Router>
        <EditClass classItem={classItem} />
      </Router>
    );

    expect(screen.getByLabelText(/Class Name/i)).toHaveValue(classItem.classname);
    expect(screen.getByLabelText(/Description/i)).toHaveValue(classItem.description);
    expect(screen.getByText(/Select the start date for the class./i)).toBeInTheDocument();
    expect(screen.getByText(/Select the end date for the class./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Term/i)).toHaveValue(classItem.term);
    expect(screen.getByLabelText(/Class Size/i)).toHaveValue(classItem.classSize);
  });

  test('submits the form with updated data', async () => {
    render(
      <Router>
        <EditClass classItem={classItem} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Class Name/i), { target: { value: 'Advanced Math 101' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Advanced principles of math' } });
    fireEvent.change(screen.getByLabelText(/Term/i), { target: { value: 'Spring 2024' } });
    fireEvent.change(screen.getByLabelText(/Class Size/i), { target: { value: 35 } });

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(mockUpdateClasses).toHaveBeenCalledWith(classItem.classId, {
        classname: 'Advanced Math 101',
        description: 'Advanced principles of math',
        startDate: new Date('2023-09-01T07:00:00.000Z'),
        endDate: new Date('2023-12-31T08:00:00.000Z'),
        term: 'Spring 2024',
        classSize: 35,
      });
    });
  });

  test('navigates back when back button is clicked', () => {
    render(
      <Router>
        <EditClass classItem={classItem} />
      </Router>
    );

    fireEvent.click(screen.getByTestId('back-button'));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
