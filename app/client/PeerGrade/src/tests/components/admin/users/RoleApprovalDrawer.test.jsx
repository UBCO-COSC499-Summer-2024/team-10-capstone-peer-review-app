// RoleApprovalDrawer.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleApprovalDrawer from '@/components/admin/users/RoleApprovalDrawer';
import { Button } from "@/components/ui/button";

describe('RoleApprovalDrawer', () => {
  const mockRoleRequest = {
    user: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com'
    },
    roleRequested: 'Admin'
  };

  const mockHandleApprove = jest.fn();
  const mockHandleDeny = jest.fn();
  const mockHandlePending = jest.fn();
  const mockCloseDrawer = jest.fn();

  const defaultProps = {
    children: <Button>Open Drawer</Button>,
    roleRequest: mockRoleRequest,
    handleApprove: mockHandleApprove,
    handleDeny: mockHandleDeny,
    handlePending: mockHandlePending,
    isLoading: false,
    isDrawerOpen: true,
    closeDrawer: mockCloseDrawer
  };

  test('renders RoleApprovalDrawer with role request details', () => {
    render(<RoleApprovalDrawer {...defaultProps} />);

    expect(screen.getByText('Role Request Form')).toBeInTheDocument();
    expect(screen.getByText('Approve or Deny the Role Request.')).toBeInTheDocument();
    expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Requested Role: Admin')).toBeInTheDocument();
  });

  test('calls handleApprove when Approve button is clicked', () => {
    render(<RoleApprovalDrawer {...defaultProps} />);

    fireEvent.click(screen.getByText('Approve'));
    expect(mockHandleApprove).toHaveBeenCalled();
  });

  test('calls handleDeny when Deny button is clicked', () => {
    render(<RoleApprovalDrawer {...defaultProps} />);

    fireEvent.click(screen.getByText('Deny'));
    expect(mockHandleDeny).toHaveBeenCalled();
  });

  test('calls handlePending when Pending button is clicked', () => {
    render(<RoleApprovalDrawer {...defaultProps} />);

    fireEvent.click(screen.getByText('Pending'));
    expect(mockHandlePending).toHaveBeenCalled();
  });

  test('calls closeDrawer when Cancel button is clicked', () => {
    render(<RoleApprovalDrawer {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockCloseDrawer).toHaveBeenCalled();
  });
});