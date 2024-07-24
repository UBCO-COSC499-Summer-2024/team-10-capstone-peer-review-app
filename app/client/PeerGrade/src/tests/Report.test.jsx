import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Report from '@/pages/Report';
import { getInstructorByClassId } from '@/api/classApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { useToast } from '@/components/ui/use-toast';
import userEvent from '@testing-library/user-event';

// Mock the API and context hooks
jest.mock('@/api/classApi', () => ({
    getInstructorByClassId: jest.fn(),
}));

jest.mock('@/contexts/contextHooks/useUser', () => ({
    useUser: jest.fn(),
}));

jest.mock('@/contexts/contextHooks/useClass', () => ({
    useClass: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
    useToast: jest.fn(),
}));

describe('Report Component', () => {
    const mockToast = jest.fn();
    
    beforeEach(() => {
        useToast.mockReturnValue({ toast: mockToast });
    });

    it('renders the component for an instructor', () => {
        useUser.mockReturnValue({
            user: { role: 'INSTRUCTOR' },
            userLoading: false,
        });
        useClass.mockReturnValue({
            classes: [],
            isClassLoading: false,
        });

        render(<Report />);

        expect(screen.getByText('Send a Report to Admin')).toBeInTheDocument();
        expect(screen.getByText('Submit Report')).toBeInTheDocument();
    });

    // it('renders the component for a student', async () => {
    //     useUser.mockReturnValue({
    //         user: { role: 'STUDENT' },
    //         userLoading: false,
    //     });
    //     useClass.mockReturnValue({
    //         classes: [{ classId: '1' }],
    //         isClassLoading: false,
    //     });

    //     getInstructorByClassId.mockResolvedValue({
    //         status: 'Success',
    //         data: { userId: '1', firstname: 'John', lastname: 'Doe' },
    //     });

    //     render(<Report />);

    //     fireEvent.click(await screen.getByLabelText('Recipient'));

    //     fireEvent.click(await screen.getByText('Instructor'));

    //     fireEvent.click(await screen.getByLabelText('Instructor'));

    //     await waitFor(() => {
    //         expect(screen.getByText('John Doe')).toBeInTheDocument();
    //     });
    // });

    // it('submits the report', async () => {
    //     useUser.mockReturnValue({
    //         user: { role: 'STUDENT' },
    //         userLoading: false,
    //     });
    //     useClass.mockReturnValue({
    //         classes: [{ classId: '1' }],
    //         isClassLoading: false,
    //     });

    //     getInstructorByClassId.mockResolvedValue({
    //         status: 'Success',
    //         data: { userId: '1', firstname: 'John', lastname: 'Doe' },
    //     });

    //     render(<Report />);

    //     fireEvent.click(screen.getByText('Select recipient'));
    //     fireEvent.click(await screen.findByText('Instructor'));

    //     fireEvent.change(screen.getByPlaceholderText('Enter subject'), { target: { value: 'Test Subject' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your report content'), { target: { value: 'This is a test report.' } });

    //     fireEvent.click(screen.getByText('Submit Report'));

    //     await waitFor(() => {
    //         expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
    //             title: "Report Submitted",
    //             description: expect.any(Object),
    //             variant: "positive",
    //         }));
    //     });
    // });

    // it('renders the Reports component for admin role', () => {
    //     useUser.mockReturnValue({
    //         user: { role: 'ADMIN' },
    //         userLoading: false,
    //     });
    //     useClass.mockReturnValue({
    //         classes: [],
    //         isClassLoading: false,
    //     });

    //     render(<Report />);

    //     fireEvent.click(screen.getByText('View'));
    //     expect(screen.getByText('Reports')).toBeInTheDocument();
    // });
});
