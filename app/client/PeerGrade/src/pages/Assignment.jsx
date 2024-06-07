// src/pages/Assignment.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { assignmentsData } from '../lib/data';

const Assignment = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.id === assignmentId);

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{assignment.name}</h1>
      <p className="text-gray-700">{assignment.description}</p>
      <div className="text-sm text-gray-500">Due Date: {assignment.dueDate}</div>
      <div className="text-sm text-gray-500">Class: {assignment.className}</div>
    </div>
  );
};

export default Assignment;
