import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Search from '@/components/admin/Search';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { useNavigate } from 'react-router-dom';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

  const mockClasses = [
    {
      classId: '1',
      classname: 'ART 101',
      instructor: { firstname: 'John', lastname: 'Doe' },
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      term: 'Spring 2023',
      classSize: 30,
    },
    {
      classId: '2',
      classname: 'MATH 101',
      instructor: { firstname: 'Jane', lastname: 'Smith' },
      startDate: '2023-01-01',
      endDate: '2023-06-01',
      term: 'Spring 2023',
      classSize: 25,
    },
    // Add more mock classes as needed
  ];
  
  describe('Search Component', () => {
    const mockNavigate = jest.fn();
  
    beforeEach(() => {
      useNavigate.mockReturnValue(mockNavigate);
  
      useUser.mockReturnValue({
        user: { role: 'ADMIN' },
        userLoading: false,
      });
  
      useClass.mockReturnValue({
        classes: mockClasses,
        isClassLoading: false,
        removeClass: jest.fn(),
      });
    });
  
    test('renders without crashing', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      expect(screen.getByText('All Classes')).toBeInTheDocument();
    });
  
    test('displays classes correctly', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      expect(screen.getByText('ART 101')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('MATH 101')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  
    test('filters classes by class name', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      fireEvent.change(screen.getByPlaceholderText('ART 101'), {
        target: { value: 'ART' },
      });
      expect(screen.getByText('ART 101')).toBeInTheDocument();
      expect(screen.queryByText('MATH 101')).not.toBeInTheDocument();
    });
  
    test('filters classes by instructor name', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      fireEvent.change(screen.getByPlaceholderText('John Doe'), {
        target: { value: 'Jane' },
      });
      expect(screen.getByText('MATH 101')).toBeInTheDocument();
      expect(screen.queryByText('ART 101')).not.toBeInTheDocument();
    });
  
    test('sorts classes by class name', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      fireEvent.click(screen.getByTestId('class-name-header'));
      expect(screen.getAllByTestId('class-name')[0]).toHaveTextContent('MATH 101');
      fireEvent.click(screen.getByTestId('class-name-header'));
      expect(screen.getAllByTestId('class-name')[0]).toHaveTextContent('ART 101');
    });
  
    test('paginates classes correctly', () => {
      render(
        <Router>
          <Search />
        </Router>
      );

      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    //   fireEvent.click(screen.getByText('Next'));
    //   expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    //   fireEvent.click(screen.getByText('Previous'));
    //   expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
  
    test('handles delete class action', async () => {
        render(
            <Router>
            <Search />
            </Router>
        );

        fireEvent.click(screen.getByTestId('delete-button-1'));

        await waitFor(() => {
            expect(screen.getByText('Delete Class')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(screen.getByText('Confirm Delete Class')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Delete'));

        await waitFor(() => {
            expect(useClass().removeClass).toHaveBeenCalledWith('1');
        });
    });
  
    test('handles edit class action', () => {
      render(
        <Router>
          <Search />
        </Router>
      );
      fireEvent.click(screen.getByTestId('edit-button-1'));
      expect(mockNavigate).toHaveBeenCalledWith('/class/1/edit');
    });
  
    test('displays no permission message for non-admin users', () => {
      useUser.mockReturnValue({
        user: { role: 'STUDENT' },
        userLoading: false,
      });
      render(
        <Router>
          <Search />
        </Router>
      );
      expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
    });
  });