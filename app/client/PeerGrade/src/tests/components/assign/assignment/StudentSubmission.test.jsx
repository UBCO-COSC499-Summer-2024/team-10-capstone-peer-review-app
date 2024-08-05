// StudentSubmission.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Submission from '@/components/assign/assignment/StudentSubmission';
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAssignmentInClass } from '@/api/assignmentApi';
import { getRubricsForAssignment } from '@/api/rubricApi';
import { createSubmission } from '@/api/submitApi';
import { toast } from '@/components/ui/use-toast';
import userEvent from '@testing-library/user-event';

// Mock the necessary modules
jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/assignmentApi');
jest.mock('@/api/rubricApi');
jest.mock('@/api/submitApi');
jest.mock('@/components/ui/use-toast');

const mockUser = { userId: 'test-user' };
useUser.mockReturnValue({ user: mockUser });

describe('Submission Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders without crashing', async () => {
        getAssignmentInClass.mockResolvedValue({ data: { assignmentId: '1', title: 'Test Assignment', allowedFileTypes: ['pdf', 'docx'] } });
        getRubricsForAssignment.mockResolvedValue({ data: { title: 'Test Rubric', criteria: [] } });

        render(
            <BrowserRouter>
                <Submission refresh={jest.fn()} switchToViewOnSubmit={jest.fn()} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Submit Your Assignment')).toBeInTheDocument();
        });
    });

    test('handles file upload submission', async () => {
        getAssignmentInClass.mockResolvedValue({ data: { assignmentId: '1', title: 'Test Assignment', allowedFileTypes: ['pdf', 'docx'] } });
        getRubricsForAssignment.mockResolvedValue({ data: { title: 'Test Rubric', criteria: [] } });
        createSubmission.mockResolvedValue({});

        render(
            <BrowserRouter>
                <Submission refresh={jest.fn()} switchToViewOnSubmit={jest.fn()} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Submit Your Assignment')).toBeInTheDocument();
        });

        const fileInput = screen.getByTestId('file-input');
        const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            // Check if the createSubmission function was called correctly
            expect(createSubmission).toHaveBeenCalledWith(mockUser.userId, '1', file);
            // Check if the success message is displayed
            expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
        });
    });

    test('handles text submission', async () => {
        getAssignmentInClass.mockResolvedValue({ data: { assignmentId: '1', title: 'Test Assignment', allowedFileTypes: ['pdf', 'docx'] } });
        getRubricsForAssignment.mockResolvedValue({ data: { title: 'Test Rubric', criteria: [] } });
        createSubmission.mockResolvedValue({});

        render(
            <BrowserRouter>
                <Submission refresh={jest.fn()} switchToViewOnSubmit={jest.fn()} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Text Submission')).toBeInTheDocument();
        });

        userEvent.click(screen.getByText('Text Submission'));
        await waitFor(() => {
            expect(screen.getByText('Submit Text')).toBeInTheDocument();
        });
        fireEvent.change(screen.getByTestId('text-input'), { target: { value: 'This is a test submission' } });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(createSubmission).toHaveBeenCalled();
            expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
        });
    });
});