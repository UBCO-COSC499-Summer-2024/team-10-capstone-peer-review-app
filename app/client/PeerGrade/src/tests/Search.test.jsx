// Search.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Search from '@/pages/Search';
import { useUser } from '@/contexts/contextHooks/useUser';
import { getAllClasses, deleteClass } from '@/api/classApi';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/classApi');

const mockClasses = [
    {
        classId: '1',
        classname: 'ART 101',
        instructor: { firstname: 'John', lastname: 'Doe' },
        startDate: '2023-01-01',
        endDate: '2023-05-01',
        term: 'Spring',
        classSize: 20,
    },
    {
        classId: '2',
        classname: 'MATH 101',
        instructor: { firstname: 'Jane', lastname: 'Smith' },
        startDate: '2023-01-01',
        endDate: '2023-05-01',
        term: 'Spring',
        classSize: 25,
    },
];

describe('Search tests', () => {

    beforeEach(() => {
        useUser.mockReturnValue({ user: { role: 'ADMIN' }, userLoading: false });
        getAllClasses.mockResolvedValue({ data: mockClasses });
        deleteClass.mockResolvedValue({ status: 'Success' });
    });

    test('renders ClassTable component', async () => {
        render(
        <Router>
            <Search />
        </Router>
        );

        expect(screen.getAllByText('Class Name').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Instructor Name').length).toBeGreaterThan(0);
        expect(screen.getByText('Start Date')).toBeInTheDocument();
        expect(screen.getByText('End Date')).toBeInTheDocument();
        expect(screen.getAllByText('Term').length).toBeGreaterThan(0);
        expect(screen.getByText('Size')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        await waitFor(() => {
        expect(screen.getByText('ART 101')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('MATH 101')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    test('filters by class name', async () => {
        render(
        <Router>
            <Search />
        </Router>
        );

        await waitFor(() => {
        expect(screen.getByText('ART 101')).toBeInTheDocument();
        expect(screen.getByText('MATH 101')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('ART 101'), {
        target: { value: 'ART' },
        });

        await waitFor(() => {
        expect(screen.getByText('ART 101')).toBeInTheDocument();
        expect(screen.queryByText('MATH 101')).not.toBeInTheDocument();
        });
    });

    test('filters by instructor name', async () => {
        render(
            <Router>
                <Search />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText('John Doe'), {
            target: { value: 'Jane' },
        });

        await waitFor(() => {
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

    test('sorts by class name', async () => {
        render(
            <Router>
                <Search />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('ART 101')).toBeInTheDocument();
            expect(screen.getByText('MATH 101')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('class-name-header'));

        await waitFor(() => {
            const classNames = screen.getAllByTestId('class-name').map(node => node.textContent);
            expect(classNames).toEqual(['MATH 101', 'ART 101']);
        });

        fireEvent.click(screen.getByTestId('class-name-header'));

        await waitFor(() => {
            const classNames = screen.getAllByTestId('class-name').map(node => node.textContent);
            expect(classNames).toEqual(['ART 101', 'MATH 101']);
        });
    });

    test('deletes a class', async () => {
        render(
            <Router>
                <Search />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('ART 101')).toBeInTheDocument();
            expect(screen.getByText('MATH 101')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('delete-button-1'));

        await waitFor(() => {
            expect(screen.getByText('Delete Class')).toBeInTheDocument();
            expect(screen.getByText('Are you sure you want to delete the class ART 101?')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(screen.getByText('Confirm Delete Class')).toBeInTheDocument();
            expect(screen.getByText('Are you really sure you want to delete the class ART 101?')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
        expect(deleteClass).toHaveBeenCalledWith('1');
        expect(screen.queryByText('ART 101')).not.toBeInTheDocument();
        });
    });
});
