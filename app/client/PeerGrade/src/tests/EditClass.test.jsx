import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EditClass from "@/components/class/EditClass";
import { useClass } from "@/contexts/contextHooks/useClass";
import { format, parseISO } from "date-fns";

// Mock the useClass hook
jest.mock("@/contexts/contextHooks/useClass", () => ({
	useClass: jest.fn()
}));

const mockClassItem = {
	classId: "1",
	classname: "Math 101",
	description: "Introduction to basic math principles",
	startDate: "2024-09-01",
	endDate: "2024-12-31",
	term: "Fall 2024",
	classSize: 30
};

const mockUpdateClasses = jest.fn();

const renderComponent = (classItem = mockClassItem) => {
	useClass.mockReturnValue({
		updateClasses: mockUpdateClasses,
		isClassLoading: false
	});

	return render(
		<BrowserRouter>
			<EditClass classItem={classItem} />
		</BrowserRouter>
	);
};

describe("EditClass Component", () => {
	it("renders the form with default values", () => {
		renderComponent();

		expect(screen.getByLabelText("Class Name")).toHaveValue(mockClassItem.classname);
		expect(screen.getByLabelText("Description")).toHaveValue(mockClassItem.description);
		expect(screen.getByText(format(parseISO(mockClassItem.startDate), "PPP"))).toBeInTheDocument();
		expect(screen.getByText(format(parseISO(mockClassItem.endDate), "PPP"))).toBeInTheDocument();
		expect(screen.getByLabelText("Term")).toHaveValue(mockClassItem.term);
		expect(screen.getByLabelText("Class Size")).toHaveValue(mockClassItem.classSize.toString());
	});

	it("updates field values and submits the form", async () => {
		renderComponent();

		// Update class name
		fireEvent.change(screen.getByLabelText("Class Name"), {
			target: { value: "Updated Math 101" }
		});

		// Update description
		fireEvent.change(screen.getByLabelText("Description"), {
			target: { value: "Updated description" }
		});

		// Update term
		fireEvent.change(screen.getByLabelText("Term"), {
			target: { value: "Spring 2025" }
		});

		// Update class size
		fireEvent.change(screen.getByLabelText("Class Size"), {
			target: { value: "50" }
		});

		// Submit the form
		fireEvent.click(screen.getByText("Submit"));

		// Confirm submission in the alert dialog
		await waitFor(() => {
			fireEvent.click(screen.getByText("Continue"));
		});

		await waitFor(() => {
			expect(mockUpdateClasses).toHaveBeenCalledWith("1", {
				classname: "Updated Math 101",
				description: "Updated description",
				startDate: parseISO(mockClassItem.startDate),
				endDate: parseISO(mockClassItem.endDate),
				term: "Spring 2025",
				classSize: 50
			});
		});
	});
});
