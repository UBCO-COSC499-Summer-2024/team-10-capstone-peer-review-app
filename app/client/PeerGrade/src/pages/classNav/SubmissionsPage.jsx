import React from 'react';
import { useParams } from 'react-router-dom';
import Submissions from '@/components/assign/assignment/Submissions';

const SubmissionsPage = () => {
  const { assignmentId } = useParams();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <Submissions assignmentId={assignmentId} />
    </div>
  );
};

export default SubmissionsPage;