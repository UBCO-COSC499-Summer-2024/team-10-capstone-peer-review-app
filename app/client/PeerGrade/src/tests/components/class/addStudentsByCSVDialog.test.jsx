import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddStudentsByCSVDialog from '@/components/class/addStudentsByCSVDialog';
import { useToast } from '@/components/ui/use-toast';
import { addStudentsByEmail } from '@/api/classApi';

// Mock the useToast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock the addStudentsByEmail API call
jest.mock('@/api/classApi', () => ({
  addStudentsByEmail: jest.fn(),
}));

describe('AddStudentsByCSVDialog', () => {
  const mockToast = jest.fn();
  const mockOnStudentsAdded = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    useToast.mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dialog when open is true', () => {
    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={true}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    expect(screen.getByText('Add Students by CSV')).toBeInTheDocument();
  });

  test('does not render the dialog when open is false', () => {
    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={false}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    expect(screen.queryByText('Add Students by CSV')).not.toBeInTheDocument();
  });

  test('adds a valid email to the list', () => {
    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={true}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    const input = screen.getByPlaceholderText('Add email to list');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('shows an error for an invalid email', () => {
    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={true}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    const input = screen.getByPlaceholderText('Add email to list');
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invalid Email',
      description: 'Please enter a valid email address.',
      variant: 'destructive',
    });
  });

  test('removes an email from the list', () => {
    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={true}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    const input = screen.getByPlaceholderText('Add email to list');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    const removeButton = screen.getByTestId("remove-email-button");
    fireEvent.click(removeButton);

    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  test('submits the emails to the API', async () => {
    addStudentsByEmail.mockResolvedValue({ data: { valid: ['test@example.com'], invalid: [] } });

    render(
      <AddStudentsByCSVDialog
        classId="test-class-id"
        open={true}
        onOpenChange={mockOnOpenChange}
        onStudentsAdded={mockOnStudentsAdded}
      />
    );

    const input = screen.getByPlaceholderText('Add email to list');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    const submitButton = screen.getByText('Add Students to Class');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addStudentsByEmail).toHaveBeenCalledWith('test-class-id', ['test@example.com']);
      expect(mockOnStudentsAdded).toHaveBeenCalled();
    });
  });
});