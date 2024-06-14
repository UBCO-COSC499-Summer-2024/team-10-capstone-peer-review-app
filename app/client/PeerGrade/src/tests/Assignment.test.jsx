import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Assignment from '@/pages/Assignment';

// Mock the useParams and useNavigate hooks
let mockAssignmentId = '1';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        assignmentId: mockAssignmentId,
    }),
    useNavigate: jest.fn(),
}));

// Mock the PDFViewer component
jest.mock('@/components/assign/PDFViewer', () => {
    return function DummyPDFViewer() {
        return <canvas data-testid="pdfviewer" />;
    };
});

// Mock the data
jest.mock('@/lib/dbData', () => ({
    assignment: [
        { assignment_id: 1, class_id: 1, title: "Assignment Title", description: "Assignment Description", due_date: "2023-12-31", file_type: "pdf" }
    ],
    submission: [
        { submission_id: 1, assignment_id: 1, file_path: "path/to/submission1.pdf", submission_date: "2023-12-01" }
    ]
}));

describe('Assignment', () => {
    test('renders without crashing', () => {
        render(
            <Router>
                <Assignment />
            </Router>
        );
    });

    test('displays assignment not found when no assignment is found', () => {
        mockAssignmentId = '9999';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        expect(screen.getByText('Assignment not found')).toBeInTheDocument();
    });

    test('renders the correct assignment details', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        expect(screen.getByText(/Assignment Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Assignment Description/i)).toBeInTheDocument();
        expect(screen.getByText(/Due:/i)).toBeInTheDocument();
        expect(screen.getByText(/Attempts:/i)).toBeInTheDocument();
        expect(screen.getByText(/Required File Type:/i)).toBeInTheDocument();
    });

    test('renders submission details correctly', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        expect(screen.getByText(/Submissions/i)).toBeInTheDocument();
        expect(screen.getByText(/Submission 1:/i)).toBeInTheDocument();
        expect(screen.getByText(/submission1.pdf/i)).toBeInTheDocument();
    });

    test('toggles the submission card visibility', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        // Initially, the submission card should not be visible
        expect(screen.queryByText(/Submit Assignment/i)).not.toBeInTheDocument();

        // Click the submit button to show the submission card
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Now, the submission card should be visible
        expect(screen.getByText(/Submit Assignment/i)).toBeInTheDocument();

        // Click the cancel button to hide the submission card
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        // The submission card should be hidden again
        expect(screen.queryByText(/Submit Assignment/i)).not.toBeInTheDocument();
    });

    test('handles back button click', () => {
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
        mockAssignmentId = '1';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        // Click the back button
        const backButton = screen.getByText('←');
        fireEvent.click(backButton);

        // Check if navigate was called with -1
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    test('displays PDFViewer component', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <Assignment />
            </Router>
        );

        const pdfViewer = screen.getByTestId('pdfviewer');
        expect(pdfViewer).toBeInTheDocument();
    });
});
