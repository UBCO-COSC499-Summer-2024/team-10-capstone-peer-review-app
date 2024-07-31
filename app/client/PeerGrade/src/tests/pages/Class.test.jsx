import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Class from '@/pages/Class';
import { useUser } from '@/contexts/contextHooks/useUser';
import { useClass } from '@/contexts/contextHooks/useClass';
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getCategoriesByClassId } from "@/api/classApi";
import { createCategory, updateCategory, deleteCategory } from "@/api/categoryApi";

jest.mock('@/contexts/contextHooks/useUser');
jest.mock('@/contexts/contextHooks/useClass');
jest.mock('@/api/assignmentApi');
jest.mock('@/api/classApi');
jest.mock('@/api/categoryApi');

const mockUser = {
  user: { role: 'INSTRUCTOR' },
  userLoading: false,
};

const mockClasses = [
  {
    classId: '1',
    classname: 'Test Class',
    description: 'This is a test class',
  },
];

const mockAssignments = {
  data: [
    { assignmentId: '1', title: 'Assignment 1', dueDate: '2023-12-31', status: 'Pending' },
  ],
};

const mockCategories = {
  data: [
    { categoryId: '1', classId: '1', name: 'Category 1', assignments: [] },
  ],
};

describe('Class Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue(mockUser);
    useClass.mockReturnValue({ classes: mockClasses });
    getAllAssignmentsByClassId.mockResolvedValue(mockAssignments);
    getCategoriesByClassId.mockResolvedValue(mockCategories);
    createCategory.mockResolvedValue({ status: 'Success' });
    updateCategory.mockResolvedValue({ status: 'Success' });
    deleteCategory.mockResolvedValue({ status: 'Success' });
  });

  // it('renders the class information', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/class/1']}>
  //       <Routes>
  //         <Route path="/class/:classId" element={<Class />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Test Class')).toBeInTheDocument();
  //     expect(screen.getByText('This is a test class')).toBeInTheDocument();
  //   });
  // });

  // it('displays categories and assignments', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/class/1']}>
  //       <Routes>
  //         <Route path="/class/:classId" element={<Class />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Category 1')).toBeInTheDocument();
  //     expect(screen.getByText('There are no assignments here.')).toBeInTheDocument();
  //   });
  // });

  // it('allows adding a new category', async () => {
  //   render(
  //     <MemoryRouter initialEntries={['/class/1']}>
  //       <Routes>
  //         <Route path="/class/:classId" element={<Class />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   const addButton = screen.getByText('Add Category');
  //   fireEvent.click(addButton);

  //   const input = screen.getByPlaceholderText('Enter category name');
  //   fireEvent.change(input, { target: { value: 'New Category' } });

  //   const saveButton = screen.getByText('Add Category');
  //   fireEvent.click(saveButton);

  //   await waitFor(() => {
  //     expect(createCategory).toHaveBeenCalledWith('1', 'New Category');
  //   });
  // });

  it('handles category deletion', async () => {
    render(
      <MemoryRouter initialEntries={['/class/1']}>
        <Routes>
          <Route path="/class/:classId" element={<Class />} />
        </Routes>
      </MemoryRouter>
    );

    console.log(document.body.innerHTML);

    fireEvent.click(screen.getByTestId('delete-category-1'));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to delete this category?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-dialog-button'));

    await waitFor(() => {
      expect(screen.getByText('Are you really sure you want to delete this category?')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-dialog-button'));

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith('1');
    });
  });
});
