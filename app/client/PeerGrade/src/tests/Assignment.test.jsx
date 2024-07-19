import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router, useParams, useNavigate } from 'react-router-dom';
import Assignment from '@/pages/Assignment';
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAssignmentInClass } from '@/api/assignmentApi';
import userEvent from '@testing-library/user-event';

// Mock the useUser hook
jest.mock('@/contexts/contextHooks/useUser', () => ({
  useUser: jest.fn(),
}));

// Mock the getAssignmentInClass API call
jest.mock('@/api/assignmentApi', () => ({
  getAssignmentInClass: jest.fn(),
}));

// Mock the PDFViewer component
jest.mock('@/components/assign/PDFViewer', () => {
  return function DummyPDFViewer() {
    return <canvas data-testid="pdfviewer" />;
  };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
    toast: jest.fn(),
}));

describe('Assignment', () => {
  let navigateMock;
  beforeEach(() => {
    navigateMock = jest.fn();

    useParams.mockImplementation(() => ({
        classId: 'testClassId',
        assignmentId: 'testAssignmentId',
    }));
  
    useNavigate.mockImplementation(() => navigateMock);
    useUser.mockImplementation(() => ({
      user: { role: 'INSTRUCTOR' },
      userLoading: false,
    }));

    getAssignmentInClass.mockImplementation(() => Promise.resolve({
      data: {
        title: 'Test Assignment',
        dueDate: new Date(),
        description: 'Test Description',
        assignmentFilePath: 'test.pdf',
      },
    }));
  });

  it('renders without crashing', async () => {
    const { getByTestId } = render(
      <Router>
        <Assignment />
      </Router>
    );

    await waitFor(() => {
      expect(getByTestId('pdfviewer')).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', async () => {
    const { getByRole, getByText, getByTestId } = render(
      <Router>
        <Assignment />
      </Router>
    );

    await waitFor(() => {
        expect(getByText('Test Assignment')).toBeInTheDocument();
        expect(getByText('Test Description')).toBeInTheDocument();
        expect(getByTestId('pdfviewer')).toBeInTheDocument();
    });

    const backButton = getByRole('button');
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith('/class/testClassId');
  });

  it('does not show TabsList for a user with role STUDENT', async () => {
    useUser.mockImplementation(() => ({
      user: { role: 'STUDENT' },
      userLoading: false,
    }));

    const { queryByRole, getByText, getByTestId } = render(
      <Router>
        <Assignment />
      </Router>
    );

    await waitFor(() => {
        expect(getByText('Test Assignment')).toBeInTheDocument();
        expect(getByText('Test Description')).toBeInTheDocument();
        expect(getByTestId('pdfviewer')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(queryByRole('tablist')).not.toBeInTheDocument();
      expect(queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();

    });
  });

  it('renders switching tabs', async () => {
        const { queryByRole, getByText, getByTestId } = render(
            <Router>
              <Assignment />
            </Router>
          );
      
          await waitFor(() => {
              expect(getByText('Test Assignment')).toBeInTheDocument();
              expect(getByText('Test Description')).toBeInTheDocument();
              expect(getByTestId('pdfviewer')).toBeInTheDocument();
          });

        // Click on the Edit tab
        userEvent.click(getByText('Edit'));

        // Wait for EditAssignment component to be rendered
        await waitFor(() => {
            expect(getByText('Edit Assignment')).toBeInTheDocument();
        });

        // Click on the Submissions tab
        userEvent.click(getByText('Submissions'));

        // Wait for Submissions component to be rendered
        await waitFor(() => {
            expect(getByTestId("submissions-title")).toBeInTheDocument();
        });
    });

});
