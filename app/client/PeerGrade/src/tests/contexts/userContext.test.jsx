// src/contexts/__tests__/ClassContext.test.jsx
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ClassProvider } from '@/contexts/ClassContext';
import { useUser } from '@/contexts/contextHooks/useUser';
import { getClassesByUserId, getAllClasses } from '@/api/classApi';

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/api/classApi');

const mockUserAdmin = {
  user: { role: 'ADMIN', userId: 'admin123' },
  userLoading: false,
};

const mockUserNonAdmin = {
  user: { role: 'INSTRUCTOR', userId: 'instructor123' },
  userLoading: false,
};

const mockClasses = {
  data: [
    { classId: '1', classname: 'Test Class 1', description: 'This is a test class 1' },
    { classId: '2', classname: 'Test Class 2', description: 'This is a test class 2' },
  ],
};

describe('ClassContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls setAdminClasses if user is admin', async () => {
    useUser.mockReturnValue(mockUserAdmin);
    getAllClasses.mockResolvedValue(mockClasses);

    const { getByText } = render(
      <ClassProvider>
        <div>Test</div>
      </ClassProvider>
    );

    await waitFor(() => {
      expect(getAllClasses).toHaveBeenCalled();
    });
  });

  it('calls setUserClasses if user is not admin', async () => {
    useUser.mockReturnValue(mockUserNonAdmin);
    getClassesByUserId.mockResolvedValue(mockClasses);

    const { getByText } = render(
      <ClassProvider>
        <div>Test</div>
      </ClassProvider>
    );

    await waitFor(() => {
      expect(getClassesByUserId).toHaveBeenCalledWith('instructor123');
    });
  });

  it('does nothing if there is no user', async () => {
    useUser.mockReturnValue({ user: null, userLoading: false });

    render(
      <ClassProvider>
        <div>Test</div>
      </ClassProvider>
    );

    await waitFor(() => {
      expect(getAllClasses).not.toHaveBeenCalled();
      expect(getClassesByUserId).not.toHaveBeenCalled();
    });
  });
});