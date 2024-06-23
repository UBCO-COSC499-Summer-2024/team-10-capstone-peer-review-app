import React from 'react';
import DataTable from '@/components/ui/data-table';

const studentsData = [
  { id: 1, name: "John Doe", status: "Active", dateJoined: "2022-01-01", classes: 4 },
  { id: 2, name: "Jane Smith", status: "Inactive", dateJoined: "2021-07-15", classes: 3 },
  // Add more student data here...
];

const studentColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'dateJoined', header: 'Date Joined' },
  { accessorKey: 'classes', header: 'Classes' },
];

const Users = () => {
  return (
    <div className=" pt-3 bg-white">
      <p className='text-xl ml-5'>Current Users</p>
      <DataTable title="Students" data={studentsData} columns={studentColumns} pageSize={5} enableStatus={true} />
    </div>
  );
};

export default Users;
