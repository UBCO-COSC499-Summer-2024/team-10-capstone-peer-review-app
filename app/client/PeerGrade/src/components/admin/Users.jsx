// The main function of this component is to display a table of users that the admin can view on the admin ui users tab.
// It takes in a title, data, and columns as props.
// The component also uses the useUser and useClass hooks to fetch user and class data where its needed.
// It also uses the getAllUsers and getAllRoleRequests functions to fetch data.

import DataTable from "@/components/ui/data-table";
import DataChart from "@/components/admin/stats/data-chart";

import RoleRequestsCard from "@/components/admin/users/RoleRequestsCard";

import { getAllUsers } from "@/api/userApi";
import { useEffect, useState } from "react";
import { getAllRoleRequests } from "@/api/authApi";
import { getStatusDetails } from "@/utils/statusIcons";

const userColumns = [
	{ accessorKey: "firstname", header: "First Name" },
	{ accessorKey: "lastname", header: "Last Name" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "role", header: "Role" },
	{ accessorKey: "isEmailVerified", header: "Email Verified" },
	{ accessorKey: "isRoleActivated", header: "Role Activated" },
	{ accessorKey: "createdAt", header: "Date Joined" },
	{ accessorKey: "updatedAt", header: "Last Updated" }
];

const Users = () => {
	const [usersData, setUsersData] = useState([]);
	const [roleRequests, setRoleRequests] = useState([]);

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

	useEffect(() => {
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
						{roleRequests.length === 0 && (
							<div className="text-gray-500 text-sm px-6">
								No role requests were found.
							</div>
						)}
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
