import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Report from '@/pages/Report';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getInstructorByClassId } from '@/api/classApi';
import { sendReportToInstructor, sendReportToAdmin, getSentReports } from '@/api/userApi';

// Mock the necessary hooks and API calls
jest.mock('@/components/ui/use-toast');
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/userApi');
jest.mock('@/api/classApi');

describe('Report Component', () => {
    beforeEach(() => {
        useToast.mockReturnValue({ toast: jest.fn() });
        useUser.mockReturnValue({ user: { role: 'STUDENT', userId: '1' }, userLoading: false });
        useClass.mockReturnValue({ classes: [], isClassLoading: false });
        getInstructorByClassId.mockResolvedValue({ status: 'Success', data: { userId: '2', firstname: 'John', lastname: 'Doe' } });
        sendReportToInstructor.mockResolvedValue({ status: 'Success', data: {} });
        sendReportToAdmin.mockResolvedValue({ status: 'Success', data: {} });
        getSentReports.mockResolvedValue({ status: 'Success', data: [] });
    });

    test('renders initial UI elements', () => {
        render(<Report />);
        expect(screen.getByText('Send a Report')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter title')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your report content')).toBeInTheDocument();
        expect(screen.getByText('Submit Report')).toBeInTheDocument();
    });

    test('submits the report form', async () => {
        render(<Report />);
        fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Test Title' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your report content'), { target: { value: 'Test Content' } });
        fireEvent.click(screen.getByText('Submit Report'));

        await waitFor(() => {
            expect(sendReportToAdmin).toHaveBeenCalledWith('1', 'Test Title', 'Test Content');
        });
    });

    // test('changes role and selects instructor', async () => {
    //     render(<Report />);
    //     fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Test Title' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your report content'), { target: { value: 'Test Content' } });

    //     fireEvent.click(screen.getByLabelText('Recipient'));
    //     fireEvent.click(screen.getByText('Instructor'));

    //     await waitFor(() => {
    //         expect(screen.getByLabelText('Instructor')).toBeInTheDocument();
    //     });

    //     fireEvent.click(screen.getByText('Select instructor'));
    //     fireEvent.click(screen.getByText('John Doe'));

    //     fireEvent.click(screen.getByText('Submit Report'));

    //     await waitFor(() => {
    //         expect(sendReportToInstructor).toHaveBeenCalledWith('1', 'Test Title', 'Test Content', '2');
    //     });
    // });

    test('fetches and displays reports', async () => {
        getSentReports.mockResolvedValueOnce({ status: 'Success', data: [{ id: 1, title: 'Report 1', content: 'Content 1', createdAt: new Date() }] });
        render(<Report />);

        await waitFor(() => {
            expect(screen.getByText('Report 1')).toBeInTheDocument();
            expect(screen.getByText('Content 1')).toBeInTheDocument();
        });
    });
});