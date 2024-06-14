import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ManageClass from '@/pages/ManageClass';
import configureStore from 'redux-mock-store';

describe('ManageClass component', () => {
  const mockStore = configureStore([]);
  

  test('should render ManageClass component for instructor', () => {
    const initialState = {
      user: {
        currentUser: {
          user_id: 1,
          firstname: 'John',
          lastname: 'Doe',
          type: 'instructor'
        }
      }
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('My Classrooms')).toBeInTheDocument();
  });

  test('should render ManageClass component for admin', () => {
    const initialState = {
      user: {
        currentUser: {
          user_id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          type: 'admin'
        }
      }
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('My Classrooms')).toBeInTheDocument();
  });

  test('should render permission error for non-instructor/admin', () => {
    const initialState = {
      user: {
        currentUser: null
      }
    };

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText('You do not have permission to view this page.')).toBeInTheDocument();
  });

  test('should add a new class', async () => {
    const initialState = {
      user: {
        currentUser: {
          user_id: 1,
          firstname: 'John',
          lastname: 'Doe',
          type: 'instructor'
        }
      }
    };

    const store = mockStore(initialState);

    const { getByText, getByLabelText, getByTestId } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Add a class'));

    // Fill out form fields
    fireEvent.change(getByLabelText('Class Name'), { target: { value: 'New Class' } });
    fireEvent.change(getByLabelText('Description'), { target: { value: 'Class Description' } });
    fireEvent.change(getByLabelText('Term'), { target: { value: 'Spring 2024' } });
    fireEvent.change(getByLabelText('Size'), { target: { value: '30' } });

    // Submit form
    fireEvent.click(getByText('Add Class'));

    // Wait for the class to appear in the list (assuming some delay or asynchronous update)
    await waitFor(() => {
      expect(getByText('New Class')).toBeInTheDocument();
      expect(getByText('30 Students')).toBeInTheDocument();
    });
  });

  test('should display classes from mock data', () => {
    const initialState = {
        user: {
          currentUser: {
            user_id: 1,
            username: "doo",
            password: "doodoo",
            firstname: "AAAAA",
            lastname: "BBBBB",
            email: "asmiaath@aa.com",
            class_id: [1,2],
            type: "instructor",
          }
        }
    };
  
    const mockClasses = [
        {
            class_id: 1,
            instructor_id: 1,
            classname: "ART 101",
            description: "Introduction to Art",
            start: new Date(),
            term: "Winter",
            end: new Date(),
            size: 50,
          }
    ];

    const store = mockStore(initialState);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );
    // Check if classes from mock data are rendered
    expect(getByText('ART 101')).toBeInTheDocument();
    expect(getByText('50 Students')).toBeInTheDocument();

  });

  test('should delete a class', async () => {
    const initialState = {
      user: {
        currentUser: {
          user_id: 1,
          firstname: 'John',
          lastname: 'Doe',
          type: 'instructor'
        }
      }
    };

    const mockClasses = [
      { class_id: 1, classname: 'Mathematics', size: 25 },
      { class_id: 2, classname: 'Physics', size: 20 }
      // Add more mock data as needed
    ];

    const store = mockStore(initialState);

    const { getByTestId, queryByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <ManageClass />
        </MemoryRouter>
      </Provider>
    );

    // Assuming there are classes already rendered, find and click delete button
    const deleteButton = getByTestId(`delete-class-${mockClasses[0].class_id}`); // Adjust this based on your UI

    fireEvent.click(deleteButton);

    // Check if the deleted class is no longer in the DOM
    await waitFor(() => {
      expect(queryByText(mockClasses[0].classname)).toBeNull();
    });
  });
});
