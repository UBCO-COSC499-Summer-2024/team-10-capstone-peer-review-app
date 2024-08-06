import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnrollTable from '@/components/manageClass/EnrollTable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

jest.mock('@/components/ui/table', () => ({
  Table: jest.fn(({ children }) => <table>{children}</table>),
  TableBody: jest.fn(({ children }) => <tbody>{children}</tbody>),
  TableCell: jest.fn(({ children }) => <td>{children}</td>),
  TableHead: jest.fn(({ children }) => <thead>{children}</thead>),
  TableHeader: jest.fn(({ children }) => <th>{children}</th>),
  TableRow: jest.fn(({ children }) => <tr>{children}</tr>),
}));

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: jest.fn(({ children, ...props }) => <span {...props}>{children}</span>),
}));

describe('EnrollTable Component', () => {
  const mockHandleUpdateEnrollRequest = jest.fn();
  const mockHandleDeleteEnrollRequest = jest.fn();
  const mockRenderPagination = jest.fn();

  const enrollRequests = [
    {
      enrollRequestId: '1',
      user: { firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com' },
      createdAt: '2023-10-01T00:00:00Z',
      status: 'PENDING',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no enrollment requests', () => {
    render(
      <EnrollTable
        enrollRequests={[]}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    expect(screen.getByText('No enrollment requests')).toBeInTheDocument();
  });

  it('renders correctly with enrollment requests', () => {
    render(
      <EnrollTable
        enrollRequests={enrollRequests}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('9/30/2023')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('handles approve button click', () => {
    render(
      <EnrollTable
        enrollRequests={enrollRequests}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Approve'));
    expect(mockHandleUpdateEnrollRequest).toHaveBeenCalledWith('1', 'APPROVED');
  });

  it('handles deny button click', () => {
    render(
      <EnrollTable
        enrollRequests={enrollRequests}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Deny'));
    expect(mockHandleUpdateEnrollRequest).toHaveBeenCalledWith('1', 'DENIED');
  });

  it('handles delete button click', () => {
    render(
      <EnrollTable
        enrollRequests={enrollRequests}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockHandleDeleteEnrollRequest).toHaveBeenCalledWith('1', enrollRequests[0].user.userId);
  });

  it('renders pagination correctly', () => {
    render(
      <EnrollTable
        enrollRequests={enrollRequests}
        handleUpdateEnrollRequest={mockHandleUpdateEnrollRequest}
        handleDeleteEnrollRequest={mockHandleDeleteEnrollRequest}
        renderPagination={mockRenderPagination}
        currentPage={1}
        setCurrentPage={jest.fn()}
      />
    );

    expect(mockRenderPagination).toHaveBeenCalledWith(1, expect.any(Function), enrollRequests.length);
  });
});