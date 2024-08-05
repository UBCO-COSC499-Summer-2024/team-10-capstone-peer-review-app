import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ViewReviewGradeDialog from "@/components/review/ViewReviewGradeDialog";

const mockReview = {
    criterionGrades: [
        { criterionId: 1, grade: 8, comment: "Good work" },
        { criterionId: 2, grade: 7, comment: "Well done" }
    ],
    submission: {
        assignment: {
            rubric: {
                title: "Assignment Rubric",
                criteria: [
                    { criterionId: 1, title: "Criterion 1", maxMark: 10, criterionRatings: [{ points: 10, description: "Excellent" }, { points: 5, description: "Good" }] },
                    { criterionId: 2, title: "Criterion 2", maxMark: 10, criterionRatings: [{ points: 10, description: "Excellent" }, { points: 5, description: "Good" }] }
                ]
            }
        }
    },
    updatedAt: "2023-06-15T00:00:00Z",
    isPeerReview: true
};

describe("ViewReviewGradeDialog", () => {
    it("renders without crashing", () => {
        render(<ViewReviewGradeDialog review={mockReview} open={true} onClose={jest.fn()} onUpdate={jest.fn()} />);
    });

    it("displays review summary correctly", () => {
        render(<ViewReviewGradeDialog review={mockReview} open={true} onClose={jest.fn()} onUpdate={jest.fn()} />);

        expect(screen.getByText("Review Summary")).toBeInTheDocument();
        expect(screen.getByText("Total Grade:")).toBeInTheDocument();
        expect(screen.getByText("75.00%")).toBeInTheDocument();
        expect(screen.getByText("Reviewed on: 6/14/2023, 5:00:00 PM")).toBeInTheDocument();
        expect(screen.getByText("Peer Review: Yes")).toBeInTheDocument();
    });

    it("displays rubric criteria and grades correctly", () => {
        render(<ViewReviewGradeDialog review={mockReview} open={true} onClose={jest.fn()} onUpdate={jest.fn()} />);

        expect(screen.getByText("Criterion 1")).toBeInTheDocument();
        expect(screen.getByText("Criterion 2")).toBeInTheDocument();
        expect(screen.getByText("Good work")).toBeInTheDocument();
        expect(screen.getByText("Well done")).toBeInTheDocument();
    });

    it("displays a message when no grades are available", () => {
        const emptyReview = { ...mockReview, criterionGrades: [] };
        render(<ViewReviewGradeDialog review={emptyReview} open={true} onClose={jest.fn()} onUpdate={jest.fn()} />);

        expect(screen.getByText("This review has not been graded yet.")).toBeInTheDocument();
    });
});
