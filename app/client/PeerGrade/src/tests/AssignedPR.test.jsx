import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AssignedPR from '@/pages/AssignedPR';

// Mock the useParams hook and the PDFViewer component
jest.mock('@/components/assign/PDFViewer', () => {
    return function DummyPDFViewer() {
        return <canvas data-testid="pdfviewer" />;
    };
});

let mockAssignmentId = '1';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        assignmentId: mockAssignmentId,
    }),
}));

jest.mock('@/lib/dbData', () => ({
    assignment: [
        { assignment_id: 1, class_id: 1, title: "Assignment Title", description: "Assignment Description" }
    ],
    iClass: [
        { class_id: 1, classname: "Classname", instructor_id: 1 }
    ],
    submission: [
        { submission_id: 1, assignment_id: 1 }
    ],
    user: [
        { user_id: 1, firstname: "John", lastname: "Doe" }
    ],
    PeerReview: [
        { review_id: 1, submission_id: 1, reviewer_id: 1, review: "Good work", rating: 90 }
    ]
}));

describe('AssignedPR', () => {
    test('renders without crashing', () => {
        render(
            <Router>
                <AssignedPR />
            </Router>
        );
    });

    test('displays assignment not found when no assignment is found', () => {
        mockAssignmentId = '9999';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        expect(screen.getByText('Assignment not found')).toBeInTheDocument();
    });

    test('renders the correct assignment details', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        expect(screen.getByText(/Classname/i)).toBeInTheDocument();
        expect(screen.getByText(/Assignment Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Assignment Description/i)).toBeInTheDocument();
    });

    test('renders peer review details correctly', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        const peerReviewDocuments = screen.getAllByText(/Peer Review Document/i);
        expect(peerReviewDocuments.length).toBeGreaterThan(0);

        const reviewers = screen.getAllByText(/Reviewer:/i);
        expect(reviewers.length).toBeGreaterThan(0);
    });

    test('toggles expand/collapse of peer review details', () => {
        mockAssignmentId = '1';

        const { container } = render(
            <Router>
                <AssignedPR />
            </Router>
        );

        // Find the first button containing the SVG with the specified class
        const svg = container.querySelector('svg.lucide-chevron-down');
        expect(svg).not.toBeNull(); // Ensure the SVG was found

        const button = svg.closest('button');
        expect(button).not.toBeNull(); // Ensure the button was found

        // Click the button to expand
        fireEvent.click(button);
        const reviewElement = screen.getByText(/Reviewer:/i).closest('div.transition-all');
        expect(reviewElement).toBeInTheDocument();
        expect(reviewElement).toHaveClass('max-h-screen'); // Ensure the element is expanded

        // Click the button to collapse
        fireEvent.click(button);
        expect(reviewElement).toHaveClass('max-h-0'); // Ensure the element is collapsed
    });

    test('displays PDFViewer component for each peer review', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        const pdfViewers = screen.getAllByTestId('pdfviewer');
        expect(pdfViewers.length).toBeGreaterThan(0);
    });

    test('renders comment box and grades correctly', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        expect(screen.getByText('Comment Box')).toBeInTheDocument();
        expect(screen.getByText('Average Peer Review Grade')).toBeInTheDocument();
        expect(screen.getByText('Assignment Instructor Grade')).toBeInTheDocument();
    });

    test('displays PDFViewer component', () => {
        mockAssignmentId = '1';

        render(
            <Router>
                <AssignedPR />
            </Router>
        );

        const pdfViewer = screen.getByTestId('pdfviewer');
        expect(pdfViewer).toBeInTheDocument();
    });
});
