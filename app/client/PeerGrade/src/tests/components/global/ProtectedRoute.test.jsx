import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useToast } from '@/components/ui/use-toast';
import ProtectedRoute from '@/components/global/ProtectedRoute';
import { Loader } from 'lucide-react';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/components/ui/use-toast');

describe('ProtectedRoute', () => {
  const mockNavigate = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useToast.mockReturnValue({ toast: mockToast });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays loader when user is loading', () => {
    useUser.mockReturnValue({ user: null, userLoading: true });

    render(<ProtectedRoute element={<div>Protected Content</div>} allowedRoles={['ADMIN']} />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('returns null when user is not authenticated', () => {
    useUser.mockReturnValue({ user: null, userLoading: false });

    const { container } = render(<ProtectedRoute element={<div>Protected Content</div>} allowedRoles={['ADMIN']} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('navigates to /dashboard and shows toast when user does not have required role', async () => {
    useUser.mockReturnValue({ user: { role: 'USER' }, userLoading: false });

    render(<ProtectedRoute element={<div>Protected Content</div>} allowedRoles={['ADMIN']} />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Unauthorized',
        description: 'You are not authorized to access this page',
        variant: 'destructive',
      });
    });
  });

  it('renders the element when user has the required role', () => {
    useUser.mockReturnValue({ user: { role: 'ADMIN' }, userLoading: false });

    render(<ProtectedRoute element={<div>Protected Content</div>} allowedRoles={['ADMIN']} />);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});