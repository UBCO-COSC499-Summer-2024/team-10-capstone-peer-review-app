// Search.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Search from '@/pages/Search';

const mockStore = configureStore([]);

jest.mock('@/lib/dbData', () => ({
    iClass: [
        { class_id: 1, instructor_id: 1, classname: "ART 101", description: "Introduction to Art.", start: Date.now(), term: "Winter", end: Date.now(), size: 50 },
        { class_id: 2, instructor_id: 2, classname: "BIO 101", description: "Introduction to Biology.", start: Date.now(), term: "Fall", end: Date.now(), size: 30 },
    ],
    user: [
        { user_id: 1, firstname: "John", lastname: "Doe" },
        { user_id: 2, firstname: "Jane", lastname: "Smith" },
    ],
}));

const renderWithProviders = (ui, { initialState, store = mockStore(initialState) } = {}) => {
    return render(
        <Provider store={store}>
            <Router>
                {ui}
            </Router>
        </Provider>
    );
};

describe('ClassTable', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: { currentUser: { role: 'ADMIN' } },
        });
    });

    test('renders without crashing', () => {
        renderWithProviders(<Search />, { store });
        expect(screen.getByText('All Classes')).toBeInTheDocument();
    });

    test('renders classes correctly', () => {
        renderWithProviders(<Search />, { store });
        expect(screen.getByText('ART 101')).toBeInTheDocument();
        expect(screen.getByText('BIO 101')).toBeInTheDocument();
    });

    test('filters classes by classname', () => {
        renderWithProviders(<Search />, { store });
        const input = screen.getByPlaceholderText('ART 101');
        fireEvent.change(input, { target: { value: 'BIO' } });

        expect(screen.queryByText('ART 101')).not.toBeInTheDocument();
        expect(screen.getByText('BIO 101')).toBeInTheDocument();
    });

    test('sorts classes by classname', () => {
        renderWithProviders(<Search />, { store });

        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('ART 101');
        expect(rows[2]).toHaveTextContent('BIO 101');
        
        const classNameHeader = screen.getByTestId('class-name-header');
        fireEvent.click(classNameHeader);

        expect(rows[1]).toHaveTextContent('BIO 101');
        expect(rows[2]).toHaveTextContent('ART 101');
    });

    test('paginates classes', async () => {
        renderWithProviders(<Search />, { store });
        const nextButton = screen.getByText('Next');
        const prevButton = screen.getByText('Previous');

        expect(nextButton).toBeDisabled();
        expect(prevButton).toBeDisabled();
        
        await waitFor(() => expect(screen.getByText('Page 1 of 1')).toBeInTheDocument());
    });

    test('opens delete dialog on trash icon click', () => {
        renderWithProviders(<Search />, { store });
        const deleteButton = screen.getByTestId('delete-button-1');
        fireEvent.click(deleteButton);
        
        expect(screen.getByText('Delete Class')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete the class ART 101?')).toBeInTheDocument();
    });
});
