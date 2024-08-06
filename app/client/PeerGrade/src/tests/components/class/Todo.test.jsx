import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Todo from '@/components/class/Todo';
import { getTodosByClassAndUser, createTodo, updateTodo, deleteTodo } from '@/api/todoApi';
import { useToast } from '@/components/ui/use-toast';

// Mock the API calls
jest.mock('@/api/todoApi');
jest.mock('@/components/ui/use-toast');

describe('Todo Component', () => {
  const classId = 'class123';
  const userId = 'user123';
  const mockTodos = [
    { todoId: '1', content: 'Test Todo 1', completed: false },
    { todoId: '2', content: 'Test Todo 2', completed: true },
  ];

  beforeEach(() => {
    getTodosByClassAndUser.mockResolvedValue({ data: mockTodos });
    createTodo.mockResolvedValue({ data: { todoId: '3', content: 'New Todo', completed: false } });
    updateTodo.mockResolvedValue({});
    deleteTodo.mockResolvedValue({});
    useToast.mockReturnValue({ toast: jest.fn() });
  });

  test('fetches and displays todos', async () => {
    render(<Todo classId={classId} userId={userId} />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  test('adds a new todo', async () => {
    render(<Todo classId={classId} userId={userId} />);

    fireEvent.change(screen.getByPlaceholderText('Add a new todo'), { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('toggles a todo', async () => {
    render(<Todo classId={classId} userId={userId} />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('toggle-todo-1'));

    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  test('deletes a todo', async () => {
    render(<Todo classId={classId} userId={userId} />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-todo-1'));

    await waitFor(() => {
      expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
    });
  });
});