import React, { useState, useEffect } from "react";
import DataTable from '@/components/ui/data-table';
import NotifCard from '@/components/global/NotifCard';
import DataChart from '@/components/admin/stats/data-chart';
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllUsers } from "@/api/adminApi";

const userColumns = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'password', header: 'Password' },
  { accessorKey: 'firstname', header: 'First Name' },
  { accessorKey: 'lastname', header: 'Last Name' },
  { accessorKey: 'isEmailVerified', header: 'Email Verified' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'classes', header: 'Classes' },
  { accessorKey: 'submissions', header: 'Submissions' },
  { accessorKey: 'reviewsDone', header: 'Reviews Done' },
  { accessorKey: 'reviewsRecieved', header: 'Reviews Received' },
  { accessorKey: 'classesInstructed', header: 'Classes Instructed' },
  { accessorKey: 'Rubric', header: 'Rubric' },
];

const instructorApprovals = [
  { id: 1, title: "Prof. Pending Approval 1", description: "Request to approve Prof. 1" },
  { id: 2, title: "Prof. Pending Approval 2", description: "Request to approve Prof. 2" },
  { id: 3, title: "Prof. Pending Approval 3", description: "Request to approve Prof. 3" },
  { id: 4, title: "Prof. Pending Approval 4", description: "Request to approve Prof. 4" },
  { id: 5, title: "Prof. Pending Approval 5", description: "Request to approve Prof. 5" },
  { id: 6, title: "Prof. Pending Approval 6", description: "Request to approve Prof. 6" },
  { id: 7, title: "Prof. Pending Approval 7", description: "Request to approve Prof. 7" },
  { id: 8, title: "Prof. Pending Approval 8", description: "Request to approve Prof. 8" },
];

const Users = () => {
	const { user, userLoading } = useUser();
	const [usersData, setUsersData] = useState([]);

  useEffect(() => {
		if (!userLoading && user) {
			const fetchAllUsers = async () => {
				// const allUsers = await getAllUsers();
        // console.log(allUsers);
				// if (allUsers.status === "Success") {
				// 	setUsersData(Array.isArray(allUsers) ? allUsers : []);
				// }
			};
			fetchAllUsers();
		}
	}, [user, userLoading]);

  const chartData = usersData.map(user => ({
    dateCreated: user.dateCreated,
    role: user.role
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col pt-3 bg-white">
        <p className='text-xl ml-5'>Current Users</p>
        <DataTable title="Students" data={usersData} columns={userColumns} pageSize={5} enableStatus={true} />
      </div>
      <div className="flex gap-5 pt-3 max-h-taller-than-98">
        <DataChart
          data={chartData}
          title="User Registration Trends"
          xAxisLabel="Date"
          yAxisLabel="Number of Users"
          filterTypes={['All', 'Student', 'Instructor']}
        />
        <div className="flex flex-col md:w-1/3 overflow-y-auto rounded-md">
          <p className='text-xl ml-5 mb-4'>Instructor Approvals</p>
          <div className='space-y-1'>
            {instructorApprovals.map((approval) => (
              <NotifCard 
                key={approval.id} 
                title={approval.title} 
                description={approval.description} 
                showDrawer={true} 
                showAlertDialog={true} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
