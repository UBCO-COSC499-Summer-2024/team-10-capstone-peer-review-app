// AssignmentRow.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AssignmentRow from '@/components/assign/AssignmentRow';

describe('AssignmentRow Component', () => {
  const defaultProps = {
    id: '1',
    name: 'Assignment 1',
    className: 'Class 1',
    dueDate: '2024-06-12',
    peerReviewDueDate: '2024-06-15',
    forReview: false,
  };

  const renderComponent = (props = {}) => {
    const finalProps = { ...defaultProps, ...props };
    return render(
      <MemoryRouter>
        <AssignmentRow {...finalProps} />
      </MemoryRouter>
    );
  };

  test('should render assignment name and class name', () => {
    const { getByText } = renderComponent();
    expect(getByText('Assignment 1')).toBeInTheDocument();
    expect(getByText('Class 1')).toBeInTheDocument();
  });

  test('should display due date if not for review', () => {
    const { getByText } = renderComponent();
    expect(getByText('2024-06-12')).toBeInTheDocument();
  });

  test('should display peer review due date if for review', () => {
    const { getByText } = renderComponent({ forReview: true });
    expect(getByText('2024-06-15')).toBeInTheDocument();
  });

  test('should render link to assignment', () => {
    const { getByRole } = renderComponent();
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/assignment/1');
  });

  test('should render link to assigned peer review if for review', () => {
    const { getByRole } = renderComponent({ forReview: true });
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/viewSubmssion/1');
  });

  test('should render OPEN button', () => {
    const { getByText } = renderComponent();
    expect(getByText('OPEN')).toBeInTheDocument();
  });
});
