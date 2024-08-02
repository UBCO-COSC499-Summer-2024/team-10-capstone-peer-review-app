import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AssignmentCreation from '@/components/assign/assignment/AssignmentCreation';
import { getCategoriesByClassId } from '@/api/classApi';
import { addAssignmentToClass } from '@/api/assignmentApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { toast } from "@/components/ui/use-toast";

// needed to avoid 'TypeError: t.scrollIntoView is not a function' testing error
window.HTMLElement.prototype.scrollIntoView = function() {};

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ classId: 'mock-class-id' }), // Mock useParams
}));

jest.mock('@/api/classApi', () => ({
  getCategoriesByClassId: jest.fn(),
}));

jest.mock('@/api/assignmentApi', () => ({
  addAssignmentToClass: jest.fn(),
}));

jest.mock('@/contexts/contextHooks/useUser', () => ({
  useUser: jest.fn(),
}));

describe('AssignmentCreation', () => {
  beforeEach(() => {
    // Mock API responses
    jest.clearAllMocks();
    getCategoriesByClassId.mockResolvedValue({
      data: [
        { categoryId: 'cat-1', classId: "1", name: 'Category 1' },
        { categoryId: 'cat-2', classId: "1", name: 'Category 2' },
      ],
    });

    addAssignmentToClass.mockResolvedValue({ status: 'Success' });
    useUser.mockReturnValue({ user: { userId: '123' }, userLoading: false });

    render(<AssignmentCreation />);
  });

  it('renders without crashing', () => {
    expect(screen.getByText('Add a New Assignment')).toBeInTheDocument();
  });

  it('handles file upload', async () => {
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
    const uploadButton = screen.getByRole('button', { name: /Upload File/i });
    fireEvent.click(uploadButton);
    const fileInput = screen.getByLabelText('Upload File');
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText('chucknorris.png')).toBeInTheDocument();
  });
  
  it('handles due date selection', async () => {
    const dateButton = screen.getByText('Pick a date');
    fireEvent.click(dateButton);
    const dateOption = screen.getByText('15');
    fireEvent.click(dateOption);
    
    await waitFor(() => expect(screen.getByText(/15th,/)).toBeInTheDocument());
  });

  it('handles form submission', async () => {
    const titleInput = screen.getByPlaceholderText('e.g. Assignment #1');
    const descriptionInput = screen.getByPlaceholderText('e.g. Use 12pt double-spaced font...');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(titleInput, { target: { value: 'Test Assignment' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a test assignment.' } });

    const categoryButton = screen.getByText('Select category...');
    fireEvent.click(categoryButton);
    const categoryOption = await screen.findByText('Category 1');
    fireEvent.click(categoryOption);

    const multiSelect = screen.getByText('Select allowed file types');
    fireEvent.click(multiSelect);

    const fileTypeOption = await screen.findByText('PDF');
    fireEvent.click(fileTypeOption);

    const dateButton = screen.getByText('Pick a date');
    fireEvent.click(dateButton);
    const dateOption = await screen.getByText('15');
    fireEvent.click(dateOption);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addAssignmentToClass).toHaveBeenCalled();
    });
  });
});
