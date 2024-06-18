import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import AppNavbar from '@/components/global/Navbar';

// Mock Redux store
const mockStore = configureStore([]);

describe('AppNavbar', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        currentUser: {
          // Mock current user state as needed for your tests
          class_id: [1, 2] // Example class_ids
        }
      }
    });
  });

  test('renders AppNavbar component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AppNavbar />
        </BrowserRouter>
      </Provider>
    );

    // Test if Dashboard link is rendered
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();

    // Example: Test if "Peer-Review" link is rendered
    const peerReviewLink = screen.getByText('Peer-Review');
    expect(peerReviewLink).toBeInTheDocument();

    // Example: Test if "Classes" link is rendered
    const classesLink = screen.getByText('Classes');
    expect(classesLink).toBeInTheDocument();

    // Example: Test if "Settings" link is rendered
    const settingsLink = screen.getByText('Settings');
    expect(settingsLink).toBeInTheDocument();
  });

  // Needs more tests based on showing the Classes cards and the Peer Review cards
});
