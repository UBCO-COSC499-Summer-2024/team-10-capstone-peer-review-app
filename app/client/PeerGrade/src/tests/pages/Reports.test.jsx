import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reports from '@/pages/Reports';
import { useUser } from '@/contexts/contextHooks/useUser';
import { getAdminReports, getInstructorReports, unResolveReport, resolveReport, deleteReport } from '@/api/userApi';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/userApi');

const mockUser = {
  user: { role: 'ADMIN' },
  userLoading: false,
};

const mockReports = [
  { reportId: '1', title: 'Report 1', createdAt: new Date(), isResolved: false },
  { reportId: '2', title: 'Report 2', createdAt: new Date(), isResolved: true },
];

describe('Reports Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue(mockUser);
    getAdminReports.mockResolvedValue({ status: 'Success', data: mockReports });
    getInstructorReports.mockResolvedValue({ status: 'Success', data: [] });
    unResolveReport.mockResolvedValue({ status: 'Success' });
    resolveReport.mockResolvedValue({ status: 'Success' });
    deleteReport.mockResolvedValue({ status: 'Success' });
  });

  it('renders the reports correctly', async () => {
    render(
      <MemoryRouter>
        <Reports role="ADMIN" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Reports Received')).toBeInTheDocument();
      expect(screen.getByText('Report 1')).toBeInTheDocument();
      expect(screen.getByText('Report 2')).toBeInTheDocument();
    });
  });

  it('handles resolve and unresolve actions', async () => {
    render(
      <MemoryRouter>
        <Reports role="ADMIN" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('resolve-button-0')).toBeInTheDocument();
      expect(screen.getByTestId('unresolve-button-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('resolve-button-0'));
    await waitFor(() => {
      expect(resolveReport).toHaveBeenCalledWith('1');
    });

    fireEvent.click(screen.getByTestId('unresolve-button-1'));
    await waitFor(() => {
      expect(unResolveReport).toHaveBeenCalledWith('2');
    });
  });

  it('handles delete action and confirmation dialog', async () => {
    render(
      <MemoryRouter>
        <Reports role="ADMIN" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('delete-button-0')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-button-0'));
    await waitFor(() => {
      expect(screen.getByText('Delete Report')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete Report')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => {
      expect(deleteReport).toHaveBeenCalledWith('1');
    });
  });

  it('displays no reports message when there are no reports', async () => {
    getAdminReports.mockResolvedValue({ status: 'Success', data: [] });
    getInstructorReports.mockResolvedValue({ status: 'Success', data: [] });

    render(
      <MemoryRouter>
        <Reports role="ADMIN" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No reports have been sent to you yet.')).toBeInTheDocument();
    });
  });
});