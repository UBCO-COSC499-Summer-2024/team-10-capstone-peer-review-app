import DataTable from "@/components/ui/data-table";
import DataChart from "@/components/admin/stats/data-chart";

import RoleRequestsCard from "@/components/admin/users/RoleRequestsCard";

import { getAllUsers } from "@/api/userApi";
import { useEffect, useState } from "react";
import { getAllRoleRequests } from "@/api/authApi";
import { getStatusDetails } from "@/utils/statusIcons";

const usersData2 = [
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
	// { accessorKey: "password", header: "Password" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "isEmailVerified", header: "Email Verified" },
	{ accessorKey: "isRoleActivated", header: "Role Activated" },
	{ accessorKey: "createdAt", header: "Date Joined" },
	{ accessorKey: "updatedAt", header: "Last Updated" }
	// { accessorKey: "classes", header: "Classes" },
	// { accessorKey: "submissions", header: "Submissions" },
	// { accessorKey: "reviewsDone", header: "Reviews Done" },
	// { accessorKey: "reviewsRecieved", header: "Reviews Received" },
	// { accessorKey: "classesInstructed", header: "Classes Instructed" },
	// { accessorKey: "Rubric", header: "Rubric" },
	// { accessorKey: "learningInstitution", header: "Learning Institution" },
	// { accessorKey: "description", header: "Description" }
];

const Users = () => {
	const [usersData, setUsersData] = useState([]);
	const [roleRequests, setRoleRequests] = useState([]);

	// TODO -> decrypt passwords for admins to view them in plain text
	// Abdul - i don't think admins should be able to view passwords (change them, maybe, but not view them)
	useEffect(() => {
		const fetchRoleRequests = async () => {
			const allRoleRequests = await getAllRoleRequests();
			if (allRoleRequests.status === "Success") {
				setRoleRequests(allRoleRequests.data);
			}
			console.log("roleRequestsData: ", roleRequests);
		};
	
		const fetchUsers = async () => {
			const allUsers = await getAllUsers();
			if (allUsers.status === "Success") {
				setUsersData(allUsers.data);
			}
			console.log("usersData: ", usersData);
		};

		fetchUsers();
		fetchRoleRequests();
	}, []);

	const chartData = usersData.map((user) => ({
		dateCreated: user.createdAt,
		role: user.role
	}));

	return (
		<div className="flex flex-col gap-6">
			<div className="w-full space-y-6">
				<h1 className="text-2xl font-bold">Current Users</h1>
				<div className="pt-6 bg-white rounded-lg">
					<DataTable
						title="Students"
						data={usersData}
						columns={userColumns}
						pageSize={5}
						enableStatus={true}
					/>
				</div>
			</div>
			<div className="flex gap-5 pt-3 max-h-taller-than-98">
				<DataChart
					title="User Registration Trends"
					data={chartData}
					xAxisLabel="Date"
					yAxisLabel="Number of Users"
					filterTypes={["All", "Student", "Instructor"]}
				/>
				<div className="flex flex-col w-1/2 overflow-y-auto rounded-md">
					<h1 className="text-2xl font-semibold mb-6">Role Requests</h1>
					<div className="p-5 bg-white rounded-lg space-y-1">
						{roleRequests.length === 0 && <div className="text-gray-500 text-sm px-6">No role requests were found.</div>}
						{roleRequests.map((roleRequest) => {
							const { color } = getStatusDetails(roleRequest.status);
							return (
								<RoleRequestsCard
									key={roleRequest.roleRequestId}
									roleRequest={roleRequest}
									refreshRoleRequests={fetchRoleRequests}
									title={`Role Request: ${roleRequest.roleRequested}`}
									description={
										<>
											<p className={color}>
												Role Request for {roleRequest.user.firstname}{" "}
												{roleRequest.user.lastname}
											</p>
											<p className="text-gray-500">
												Status: {roleRequest.status}
											</p>
										</>
									}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Users;
