import React from 'react';
import DataTable from '@/components/ui/data-table';

const peerReviewsData = [
  {
    peerReviewId: "1",
    submissionId: "1",
    studentReviewerId: "1",
    revieweeId: "2",
    createdAt: "2022-10-01",
    updatedAt: "2022-10-10",
    peerReviewGrade: 85,
    reviewer: "John Doe",
    reviewee: "Jane Smith",
  },
  {
    peerReviewId: "2",
    submissionId: "2",
    studentReviewerId: "2",
    revieweeId: "1",
    createdAt: "2022-11-01",
    updatedAt: "2022-11-15",
    peerReviewGrade: 90,
    reviewer: "Jane Smith",
    reviewee: "John Doe",
  },
  // Add more peer review data here...
];

const reviewsData = [
  {
    reviewId: "1",
    submissionId: "1",
    reviewerId: "1",
    revieweeId: "2",
    createdAt: "2022-10-01",
    updatedAt: "2022-10-10",
    reviewGrade: 85,
    reviewer: "John Doe",
    reviewee: "Jane Smith",
  },
  {
    reviewId: "2",
    submissionId: "2",
    reviewerId: "2",
    revieweeId: "1",
    createdAt: "2022-11-01",
    updatedAt: "2022-11-15",
    reviewGrade: 90,
    reviewer: "Jane Smith",
    reviewee: "John Doe",
  },
  // Add more review data here...
];

const peerReviewColumns = [
  { accessorKey: 'reviewer', header: 'Reviewer' },
  { accessorKey: 'reviewee', header: 'Reviewee' },
  { accessorKey: 'createdAt', header: 'Created At' },
  { accessorKey: 'updatedAt', header: 'Updated At' },
  { accessorKey: 'peerReviewGrade', header: 'Grade' },
];

const reviewColumns = [
  { accessorKey: 'reviewer', header: 'Reviewer' },
  { accessorKey: 'reviewee', header: 'Reviewee' },
  { accessorKey: 'createdAt', header: 'Created At' },
  { accessorKey: 'updatedAt', header: 'Updated At' },
  { accessorKey: 'reviewGrade', header: 'Grade' },
];

const PRassign = () => {
  return (
    <div className="flex gap-4 pt-3 bg-white">
      <div>
        <p className='text-xl ml-5'>Peer Reviews</p>
        <DataTable title="Peer Reviews" data={peerReviewsData} columns={peerReviewColumns} pageSize={5} enableStatus={true} />
      </div>
      <div>
        <p className='text-xl ml-5 mt-5'>Reviews</p>
        <DataTable title="Reviews" data={reviewsData} columns={reviewColumns} pageSize={5} enableStatus={true} />
      </div>

    </div>
  );
};

export default PRassign;
