import React from 'react';
import DataTable from '@/components/ui/data-table';

const interactionsData = [
  { id: 1, user: "John Doe", action: "Submitted assignment", date: "2022-09-15" },
  { id: 2, user: "Jane Smith", action: "Reviewed assignment", date: "2022-09-16" },
  // Add more interaction data here...
];

const interactionColumns = [
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'date', header: 'Date' },
];

const Interactions = () => {
  return (
		<div className="w-full space-y-6">
			<h1 className="text-2xl font-bold">Interactions</h1>
      
      <div className="pt-6 bg-white rounded-lg">
        <DataTable title="Interactions" data={interactionsData} columns={interactionColumns} pageSize={5} enableStatus={true} />
      </div>
		</div>
  );
};

export default Interactions;
