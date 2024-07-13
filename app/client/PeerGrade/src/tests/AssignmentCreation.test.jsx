import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { toast } from "@/components/ui/use-toast";
import AssignmentCreation from '@/pages/classNav/assignment/AssignmentCreation';

window.HTMLElement.prototype.scrollIntoView = function() {};

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('AssignmentCreation', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<AssignmentCreation />);
    expect(getByText('Add a New Assignment')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const { getByText } = render(<AssignmentCreation />);
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const uploadButton = screen.getByLabelText('Upload File');
    fireEvent.click(uploadButton);
    const fileInput = document.getElementById('file-upload');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(getByText('chucknorris.png')).toBeInTheDocument());
  });

  it('handles review option selection', async () => {
    const { getByText } = render(<AssignmentCreation />);
    const reviewButton = screen.getByRole('combobox');
    fireEvent.click(reviewButton);
    const reviewOption = screen.getByText('Auto');
    fireEvent.click(reviewOption);
    await waitFor(() => expect(getByText('Auto')).toBeInTheDocument());
  });

  it('handles due date selection', async () => {
    const { getByText } = render(<AssignmentCreation />);
    const dateButton = screen.getByText('Pick a date');
    fireEvent.click(dateButton);
    const dateOption = screen.getByText('15');
    fireEvent.click(dateOption);
    await waitFor(() => expect(document.body.innerHTML).toContain('15th,'));
  });

  it('handles form submission', async () => {
    const { getByText, getByPlaceholderText, getByRole } = render(<AssignmentCreation />);
  
    const titleInput = screen.getByPlaceholderText('e.g. Assignment #1');
    const descriptionInput = screen.getByPlaceholderText('e.g. Use 12pt double-spaced font...');
    const reviewButton = screen.getByRole('combobox');
    const dateButton = screen.getByText('Pick a date');
    const submitButton = screen.getByText('Submit');
  
    fireEvent.change(titleInput, { target: { value: 'Test Assignment' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a test assignment.' } });
  
    // Simulate review option selection
    fireEvent.click(reviewButton);
    const reviewOption = screen.getByText('Auto');
    fireEvent.click(reviewOption);
  
    // Simulate due date selection
    fireEvent.click(dateButton);
    const dateOption = screen.getByText('15');
    fireEvent.click(dateOption);
  
    fireEvent.click(submitButton);

    await waitFor(() => {
      // console.log('Toast calls:', JSON.stringify(toast.mock.calls, null, 2)); // Debug: Log toast calls
      
      expect(toast).toHaveBeenCalledWith({
        title: "You submitted the following values:",
        description: expect.any(Object),
      });
    });
  });
  
});
