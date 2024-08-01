import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddClassModal from '@/components/manageClass/AddClassDialog';
import { useClass } from '@/contexts/contextHooks/useClass';

jest.mock('@/contexts/contextHooks/useClass');

const mockAddClass = jest.fn();
const mockOnClose = jest.fn();

const mockUseClass = {
  isClassLoading: false,
  addClass: mockAddClass,
};

describe('AddClassModal Component', () => {
  beforeEach(() => {
    useClass.mockReturnValue(mockUseClass);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when show is true', () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);
    expect(screen.getByText('Add a New Class')).toBeInTheDocument();
  });

  it('does not render the modal when show is false', () => {
    render(<AddClassModal show={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Add a New Class')).not.toBeInTheDocument();
  });

  it('updates form inputs correctly', () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    expect(screen.getByLabelText('Class Name').value).toBe('Test Class');
    expect(screen.getByLabelText('Description').value).toBe('Test Description');
    expect(screen.getByLabelText('Term').value).toBe('Fall 2023');
    expect(screen.getByLabelText('Size').value).toBe('30');
  });

  it('shows error when startDate or endDate is not selected', async () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    fireEvent.submit(screen.getByText('Add Class'));

    await waitFor(() => {
      expect(screen.getByText('Please select start and end dates for the class.')).toBeInTheDocument();
    });
  });

  it('shows error when startDate is after endDate', async () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    fireEvent.click(screen.getByLabelText('Start Date'));
    fireEvent.click(screen.getByText('15')); // Assuming this selects a date

    fireEvent.click(screen.getByLabelText('End Date'));
    fireEvent.click(screen.getByText('10')); // Assuming this selects a date before start date

    fireEvent.submit(screen.getByText('Add Class'));

    await waitFor(() => {
        console.log(document.body.innerHTML);   
      expect(screen.getByText('Please select an end date that is after the start date.')).toBeInTheDocument();
    });
  });

  it('shows error when startDate is the same as endDate', async () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    fireEvent.click(screen.getByLabelText('Start Date'));
    fireEvent.click(screen.getByText('9')); // Assuming this selects a date

    fireEvent.click(screen.getByLabelText('End Date'));
    fireEvent.click(screen.getByText('9')); // Assuming this selects the same date

    fireEvent.submit(screen.getByText('Add Class'));

    await waitFor(() => {
      expect(screen.getByText('Please select an end date that is not the same as the start date.')).toBeInTheDocument();
    });
  });

  it('calls addClass with correct data on form submission', async () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    fireEvent.click(screen.getByLabelText('Start Date'));
    fireEvent.click(screen.getByText('15')); // Assuming this selects a date

    fireEvent.click(screen.getByLabelText('End Date'));
    fireEvent.click(screen.getByText('20')); // Assuming this selects a date after start date

    fireEvent.submit(screen.getByText('Add Class'));

    await waitFor(() => {
      expect(mockAddClass).toHaveBeenCalledWith({
        classname: 'Test Class',
        description: 'Test Description',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        term: 'Fall 2023',
        classSize: 30,
      });
    });
  });

  it('calls onClose after successful form submission', async () => {
    render(<AddClassModal show={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Test Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Fall 2023' } });
    fireEvent.change(screen.getByLabelText('Size'), { target: { value: '30' } });

    fireEvent.click(screen.getByLabelText('Start Date'));
    fireEvent.click(screen.getByText('15')); // Assuming this selects a date

    fireEvent.click(screen.getByLabelText('End Date'));
    fireEvent.click(screen.getByText('20')); // Assuming this selects a date after start date

    fireEvent.submit(screen.getByText('Add Class'));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});