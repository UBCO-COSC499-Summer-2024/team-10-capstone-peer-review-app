import DataTable from "@/components/ui/data-table";
import NotifCard from "@/components/global/NotifCard";
import DataChart from "@/components/admin/stats/data-chart";

import { getAllUsers } from "@/api/userApi";
import { useEffect, useState } from "react";
import { getAllRoleRequests } from "@/api/authApi";

const usersData = [
	{
		userId: "1",
		username: "johndoe",
		password: "******",
		email: "johndoe@example.com",
		firstname: "John",
		lastname: "Doe",
		isEmailVerified: true,
		role: "STUDENT",
		classes: 4,
		submissions: 10,
		reviewsDone: 5,
		reviewsRecieved: 3,
		classesInstructed: 0,
		Rubric: 1,
		learningInstitution: "ABC University",
		description: "Experienced instructor in Computer Science.",
		dateCreated: "2024-01-01"
	},
	{
		userId: "2",
		username: "janesmith",
		password: "******",
		email: "janesmith@example.com",
		firstname: "Jane",
		lastname: "Smith",
		isEmailVerified: false,
		role: "STUDENT",
		classes: 3,
		submissions: 7,
		reviewsDone: 4,
		reviewsRecieved: 2,
		classesInstructed: 0,
		Rubric: 0,
		learningInstitution: "XYZ College",
		description: "Passionate about teaching mathematics.",
		dateCreated: "2023-07-15"
	}
	// Add more user data here...
];

const userColumns = [
	{ accessorKey: "firstname", header: "First Name" },
	{ accessorKey: "lastname", header: "Last Name" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "password", header: "Password" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "isEmailVerified", header: "Email Verified" },
	{ accessorKey: "isRoleActivated", header: "Role Activated" },
	{ accessorKey: "classes", header: "Classes" },
	{ accessorKey: "submissions", header: "Submissions" },
	{ accessorKey: "reviewsDone", header: "Reviews Done" },
	{ accessorKey: "reviewsRecieved", header: "Reviews Received" },
	{ accessorKey: "classesInstructed", header: "Classes Instructed" },
	{ accessorKey: "Rubric", header: "Rubric" },
	{ accessorKey: "learningInstitution", header: "Learning Institution" },
	{ accessorKey: "description", header: "Description" }
];

const instructorApprovals = [
	{
		id: 1,
		title: "Prof. Pending Approval 1",
		description: "Request to approve Prof. 1"
	},
	{
		id: 2,
		title: "Prof. Pending Approval 2",
		description: "Request to approve Prof. 2"
	},
	{
		id: 3,
		title: "Prof. Pending Approval 3",
		description: "Request to approve Prof. 3"
	},
	{
		id: 4,
		title: "Prof. Pending Approval 4",
		description: "Request to approve Prof. 4"
	},
	{
		id: 5,
		title: "Prof. Pending Approval 5",
		description: "Request to approve Prof. 5"
	},
	{
		id: 6,
		title: "Prof. Pending Approval 6",
		description: "Request to approve Prof. 6"
	},
	{
		id: 7,
		title: "Prof. Pending Approval 7",
		description: "Request to approve Prof. 7"
	},
	{
		id: 8,
		title: "Prof. Pending Approval 8",
		description: "Request to approve Prof. 8"
	}
];

const Users = () => {
	const [usersData, setUsersData] = useState([]);
	const [roleRequests, setRoleRequests] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const allUsers = await getAllUsers();
			if (allUsers.status === "Success") {
				setUsersData(allUsers.data);
			}
			console.log("usersData: ", usersData);
		};

		fetchUsers();
	}, [usersData]);

	useEffect(() => {
		const fetchRoleRequests = async () => {
			const allRoleRequests = await getAllRoleRequests();
			if (allRoleRequests.status === "Success") {
				setRoleRequests(allRoleRequests.data);
			}
			console.log("roleRequestsData: ", roleRequests);
		};

		fetchRoleRequests();
	}, [roleRequests]);

	const chartData = usersData.map((user) => ({
		dateCreated: user.dateCreated,
		role: user.role
	}));

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col pt-3 bg-white">
				<p className="text-xl ml-5">Current Users</p>
				<DataTable
					title="Students"
					data={usersData}
					columns={userColumns}
					pageSize={5}
					enableStatus={true}
				/>
			</div>
			<div className="flex gap-5 pt-3 max-h-taller-than-98">
				<DataChart
					data={chartData}
					title="User Registration Trends"
					xAxisLabel="Date"
					yAxisLabel="Number of Users"
					filterTypes={["All", "Student", "Instructor"]}
				/>
				<div className="flex flex-col md:w-1/3 overflow-y-auto rounded-md">
					<p className="text-xl ml-5 mb-4">Instructor Approvals</p>
					<div className="space-y-1">
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
