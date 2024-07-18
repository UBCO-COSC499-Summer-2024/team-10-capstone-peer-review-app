import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClassCard from '@/components/class/ClassCard';

describe('ClassCard Component', () => {
  const renderComponent = (props) => {
    render(
      <BrowserRouter>
        <ClassCard {...props} />
      </BrowserRouter>
    );
  };
  
  test('renders correctly', () => {
    const props = {
      classId: '1',
      className: 'Math 101',
      instructor: 'John Doe',
      numStudents: 25,
      numAssignments: 5,
      numPeerReviews: 3,
    };

    renderComponent(props);

    expect(screen.getByText('Math 101')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('25 Students')).toBeInTheDocument();
    expect(screen.getByText('5 Assignments Due')).toBeInTheDocument();
    expect(screen.getByText('3 Peer Reviews Left')).toBeInTheDocument();
  });

  test('renders link to the class', () => {
    const props = {
      classId: '1',
      className: 'Math 101',
      instructor: 'John Doe',
    };

    renderComponent(props);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/class/1');
  });

  test('does not render numStudents if not provided', () => {
    const props = {
      classId: '1',
      className: 'Math 101',
      instructor: 'John Doe',
    };

    renderComponent(props);

    expect(screen.queryByText(/Students/)).not.toBeInTheDocument();
  });

  test('does not render numAssignments if not provided', () => {
    const props = {
      classId: '1',
      className: 'Math 101',
      instructor: 'John Doe',
    };

    renderComponent(props);

    expect(screen.queryByText(/Assignments Due/)).not.toBeInTheDocument();
  });

  test('does not render numPeerReviews if not provided', () => {
    const props = {
      classId: '1',
      className: 'Math 101',
      instructor: 'John Doe',
    };

    renderComponent(props);

    expect(screen.queryByText(/Peer Reviews Left/)).not.toBeInTheDocument();
  });
});
