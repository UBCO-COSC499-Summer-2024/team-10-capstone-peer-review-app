// ClassCard.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ClassCard from '@/components/class/GradeCard';

test('renders class card with correct props', () => {
  const classId = '123';
  const className = 'Mathematics';
  const instructor = 'John Doe';
  const numStudents = 20;
  const numAssignments = 5;
  const numPeerReviews = 10;

  const { getByText } = render(
    <MemoryRouter>
      <ClassCard
        classId={classId}
        className={className}
        instructor={instructor}
        numStudents={numStudents}
        numAssignments={numAssignments}
        numPeerReviews={numPeerReviews}
      />
    </MemoryRouter>
  );

  expect(getByText(className)).toBeInTheDocument();
  expect(getByText(instructor)).toBeInTheDocument();
  expect(getByText(`${numStudents} Students`)).toBeInTheDocument();
  expect(getByText(`${numAssignments} Assignments Due`)).toBeInTheDocument();
  expect(getByText(`${numPeerReviews} Peer Reviews Left`)).toBeInTheDocument();
});
