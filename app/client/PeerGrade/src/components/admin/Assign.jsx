import React from 'react';
import DataTable from '@/components/ui/data-table';

const assignmentsData = [
  {
    assignmentId: "1",
    classId: "1",
    title: "Assignment 1",
    description: "This is the first assignment",
    dueDate: "2022-10-10",
    maxSubmissions: 1,
    class: "Math 101"
  },
  {
    assignmentId: "2",
    classId: "2",
    title: "Assignment 2",
    description: "This is the second assignment",
    dueDate: "2022-11-15",
    maxSubmissions: 1,
    class: "Science 101"
  },
  // Add more assignment data here...
];

const assignmentColumns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'maxSubmissions', header: 'Max Submissions' },
  { accessorKey: 'class', header: 'Class' },
];

const submissionsData = [
  {
    submissionId: "1",
    assignmentId: "1",
    submitterId: "1",
    createdAt: "2023-01-01",
    updatedAt: "2023-01-02",
    submissionFilePath: "/path/to/file1",
    finalGrade: 85,
    submitter: "John Doe",
  },
  {
    submissionId: "2",
    assignmentId: "2",
    submitterId: "2",
    createdAt: "2023-02-01",
    updatedAt: "2023-02-02",
    submissionFilePath: "/path/to/file2",
    finalGrade: 90,
    submitter: "Jane Smith",
  },
  // Add more submission data here...
];

const submissionColumns = [
  { accessorKey: 'submissionId', header: 'Submission ID' },
  { accessorKey: 'assignmentId', header: 'Assignment ID' },
  { accessorKey: 'submitter', header: 'Submitter' },
  { accessorKey: 'createdAt', header: 'Created At' },
  { accessorKey: 'updatedAt', header: 'Updated At' },
  { accessorKey: 'submissionFilePath', header: 'Submission File Path' },
  { accessorKey: 'finalGrade', header: 'Final Grade' },
];

const Assign = () => {
  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="pt-6 bg-white rounded-lg">
          <DataTable title="Assignments" data={assignmentsData} columns={assignmentColumns} pageSize={5} enableStatus={true} />
        </div>
      </div>

      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <div className="pt-6 bg-white rounded-lg">
          <DataTable title="Submissions" data={submissionsData} columns={submissionColumns} pageSize={5} enableStatus={true} />
        </div>
      </div>
    </div>
  );
};

export default Assign;
