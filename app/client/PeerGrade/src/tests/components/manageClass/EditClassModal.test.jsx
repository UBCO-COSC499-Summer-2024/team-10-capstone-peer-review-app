import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO, isAfter } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useClass } from '@/contexts/contextHooks/useClass';
import EditClassModal from '@/components/manageClass/EditClassModal';

jest.mock('@/contexts/contextHooks/useClass');

const mockClassItem = {
  classId: '1',
  classname: 'Test Class',
  description: 'This is a test class',
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  term: 'Fall 2023',
  classSize: 30
};

const mockUpdateClasses = jest.fn();

describe('EditClassModal Component', () => {
  beforeEach(() => {
    useClass.mockReturnValue({
      updateClasses: mockUpdateClasses,
      isClassLoading: false
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog with form fields', () => {
    render(<EditClassModal open={true} onOpenChange={jest.fn()} classItem={mockClassItem} />);

    expect(screen.getByText('Edit Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Class Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Term')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum number of students')).toBeInTheDocument();
  });

  it('populates form fields with classItem data', () => {
    render(<EditClassModal open={true} onOpenChange={jest.fn()} classItem={mockClassItem} />);

    expect(screen.getByDisplayValue('Test Class')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test class')).toBeInTheDocument();
    expect(screen.getByText('January 1st, 2023')).toBeInTheDocument();
    expect(screen.getByText('December 31st, 2023')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fall 2023')).toBeInTheDocument();
    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    render(<EditClassModal open={true} onOpenChange={jest.fn()} classItem={mockClassItem} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Maximum number of students'), { target: { value: '0' } });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Class name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Class size must be at least 1')).toBeInTheDocument();
    });
  });

  it('calls updateClasses with correct data on form submission', async () => {
    const onOpenChange = jest.fn();
    render(<EditClassModal open={true} onOpenChange={onOpenChange} classItem={mockClassItem} />);

    fireEvent.change(screen.getByLabelText('Class Name'), { target: { value: 'Updated Class' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated description' } });
    fireEvent.change(screen.getByLabelText('Maximum number of students'), { target: { value: '50' } });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockUpdateClasses).toHaveBeenCalledWith('1', {
        classname: 'Updated Class',
        description: 'Updated description',
        startDate: parseISO('2023-01-01'),
        endDate: parseISO('2023-12-31'),
        term: 'Fall 2023',
        classSize: 50
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('displays an error message if updateClasses fails', async () => {
    mockUpdateClasses.mockRejectedValueOnce(new Error('Update failed'));
    render(<EditClassModal open={true} onOpenChange={jest.fn()} classItem={mockClassItem} />);

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Failed to update class. Please try again.')).toBeInTheDocument();
    });
  });

  it('closes the dialog when Cancel button is clicked', () => {
    const onOpenChange = jest.fn();
    render(<EditClassModal open={true} onOpenChange={onOpenChange} classItem={mockClassItem} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});