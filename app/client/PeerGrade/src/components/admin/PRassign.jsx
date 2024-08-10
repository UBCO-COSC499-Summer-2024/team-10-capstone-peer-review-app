// The main function of this component is to display a table of peer reviews and reviews that the admin can view on the admin ui peer-reviews tab.
// It takes in a title, data, and columns as props.
// The component also uses the useUser and useClass hooks to fetch user and class data where its needed.

// IMPORTANT: this component is rendering mock created data for peer reviews and reviews. It is not connected to any actual data.

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
    <div className="flex flex-col justify-center space-y-8">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Peer Reviews</h1>
        <div className="pt-6 bg-white rounded-lg">
          <DataTable title="Peer Reviews" data={peerReviewsData} columns={peerReviewColumns} pageSize={5} enableStatus={true} />
        </div>
      </div>

      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="pt-6 bg-white rounded-lg">
          <DataTable title="Reviews" data={reviewsData} columns={reviewColumns} pageSize={5} enableStatus={true} />
        </div>
      </div>
    </div>
  );
};

export default PRassign;
