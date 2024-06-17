import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ManageClass from '@/pages/ManageClass';
import { iClass, assignment, PeerReview, submission } from '@/lib/dbData';

// Mock the dbData module
jest.mock('@/lib/dbData', () => {
  return {
    iClass: [],
    assignment: [],
    PeerReview: [],
    submission: []
  };
});

describe('ManageClass component', () => {
  const mockStore = configureStore([]);
  let store;
  let userClasses;

  beforeEach(() => {
    iClass.length = 0;
    assignment.length = 0;
    PeerReview.length = 0;
    submission.length = 0;

    const initialState = {
      user: {
        currentUser: {
          userId: 1,
          firstname: 'John',
          lastname: 'Doe',
          role: 'INSTRUCTOR',
        },
      },
    };

    store = mockStore(initialState);

    userClasses = [
      {
        class_id: 1,
        instructor_id: 1,
        classname: 'ART 101',
        description: 'Introduction to Art',
        start: new Date(),
        term: 'Winter',
        end: new Date(),
        size: 50,
      },
      {
        class_id: 2,
        instructor_id: 1,
        classname: 'Mathematics',
        description: 'Introduction to Mathematics',
        start: new Date(),
        term: 'Winter',
        end: new Date(),
        size: 25,
      },
    ];

    iClass.push(...userClasses);
  });

  test('should render ManageClass component for instructor', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('My Classrooms')).toBeInTheDocument();
  });

  test('should render permission error for non-instructor/admin', () => {
    const nonInstructorStore = mockStore({
      user: { currentUser: null },
    });

    render(
      <Provider store={nonInstructorStore}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  test('should add a new class', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    // Open modal
    fireEvent.click(screen.getByText('Add a class'));

    // Fill out form fields
    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'New Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Class Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Spring 2024' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    // Submit form
    fireEvent.click(screen.getByText('Add Class'));

    // Wait for the new class to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Class')).toBeInTheDocument();
      expect(screen.getByText('30 Students')).toBeInTheDocument();
    });
  });

  test('should display classes from mock data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the component to render the classes
    await waitFor(() => {
      expect(screen.getByText('ART 101')).toBeInTheDocument();
      expect(screen.getByText('50 Students')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getByText('25 Students')).toBeInTheDocument();
    });
  });

  test('should delete a class', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the component to render the classes
    await waitFor(() => {
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
    });

    // Find and click delete button for the Mathematics class
    const deleteButton = screen.getByTestId('delete-class-2');
    fireEvent.click(deleteButton);

    // Check if the deleted class is no longer in the DOM
    await waitFor(() => {
      expect(screen.queryByText('Mathematics')).toBeNull();
    });
  });
});
