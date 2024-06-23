import React from 'react';
import DataTable from '@/components/ui/data-table';

const peerReviewsData = [
  { id: 1, reviewer: "John Doe", reviewee: "Jane Smith", dueDate: "2022-10-10" },
  { id: 2, reviewer: "Jane Smith", reviewee: "John Doe", dueDate: "2022-11-15" },
  // Add more peer review data here...
];

const peerReviewColumns = [
  { accessorKey: 'reviewer', header: 'Reviewer' },
  { accessorKey: 'reviewee', header: 'Reviewee' },
  { accessorKey: 'dueDate', header: 'Due Date' },
];

const PRassign = () => {
  return (
    <div className="wider-table pt-3 bg-white">
      <p className='text-xl ml-5'>Peer Reviews</p>
      <DataTable title="Peer Reviews" data={peerReviewsData} columns={peerReviewColumns} pageSize={5} enableStatus={true} />
    </div>
  );
};

export default PRassign;
