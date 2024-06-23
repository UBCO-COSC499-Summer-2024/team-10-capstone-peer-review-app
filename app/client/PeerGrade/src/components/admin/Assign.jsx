import React from 'react';
import DataTable from '@/components/ui/data-table';

const assignmentsData = [
  { id: 1, title: "Assignment 1", dueDate: "2022-10-10", class: "Math 101" },
  { id: 2, title: "Assignment 2", dueDate: "2022-11-15", class: "Science 101" },
  // Add more assignment data here...
];

const assignmentColumns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'class', header: 'Class' },
];

const Assign = () => {
  return (
    <div className="wider-table pt-3 bg-white">
      <p className='text-xl ml-5'>Assignments</p>
      <DataTable title="Assignments" data={assignmentsData} columns={assignmentColumns} pageSize={5} enableStatus={true} />
    </div>
  );
};

export default Assign;
