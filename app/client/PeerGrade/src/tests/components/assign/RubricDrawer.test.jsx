import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RubricDrawer from '@/components/assign/RubricDrawer';

describe('RubricDrawer Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <RubricDrawer
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        {...props}
      >
        <button>Open Drawer</button>
      </RubricDrawer>
    );
  };

  test('renders RubricDrawer component', () => {
    renderComponent();
    expect(screen.getByText('Edit Rubric')).toBeInTheDocument();
  });

  test('initial state is correct', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Criteria')).toHaveValue('');
    expect(screen.getByPlaceholderText('Rating')).toHaveValue('');
    expect(screen.getByPlaceholderText('Points')).toHaveValue('');
    expect(screen.getByPlaceholderText('Min Points')).toHaveValue('');
    expect(screen.getByPlaceholderText('Max Points')).toHaveValue('');
  });

  test('handles criteria change', () => {
    renderComponent();
    const criteriaInput = screen.getByPlaceholderText('Criteria');
    fireEvent.change(criteriaInput, { target: { value: 'New Criteria' } });
    expect(criteriaInput).toHaveValue('New Criteria');
  });

  test('handles ratings change', () => {
    renderComponent();
    const ratingInput = screen.getByPlaceholderText('Rating');
    fireEvent.change(ratingInput, { target: { value: 'New Rating' } });
    expect(ratingInput).toHaveValue('New Rating');

    const pointsInput = screen.getByPlaceholderText('Points');
    fireEvent.change(pointsInput, { target: { value: '10' } });
    expect(pointsInput).toHaveValue('10');
  });

  test('adds & removes a criteria', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('add-criteria'));
    await waitFor (() => {
        expect(screen.getAllByPlaceholderText('Criteria').length).toBe(2);
    });
    fireEvent.click(screen.getByTestId('remove-criteria-1'));
    await waitFor (() => {
        expect(screen.getAllByPlaceholderText('Criteria').length).toBe(1);
    });
  });

  test('handles adding and removing ratings', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('add-criteria'));
    await waitFor (() => {
        expect(screen.getAllByPlaceholderText('Criteria').length).toBe(2);
    });
    fireEvent.click(screen.getByTestId('add-rating-1'));
    await waitFor (() => {
        expect(screen.getAllByPlaceholderText('Rating').length).toBe(3);
    });

    fireEvent.click(screen.getByTestId('remove-rating-1-1'));
    await waitFor (() => {
        expect(screen.getAllByPlaceholderText('Rating').length).toBe(2);
    });
  });

  test('handles form submission', () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Max Points'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Points'), { target: { value: '10' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});