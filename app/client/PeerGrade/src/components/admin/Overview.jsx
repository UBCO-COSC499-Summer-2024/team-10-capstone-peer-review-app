import { useEffect, useState } from "react";
import {
	UsersIcon,
	AcademicCapIcon,
	DocumentTextIcon,
	ChatBubbleLeftRightIcon,
	CheckCircleIcon,
	XCircleIcon
} from "@heroicons/react/24/outline";
import StatCard from "@/components/admin/stats/StatCard";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getUsersByRole, getAllUsers } from "@/api/userApi";
import { getAllClasses } from "@/api/classApi";
import { getAllAssignments } from "@/api/assignmentApi";

const Overview = () => {
	const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
	const [usersData, setUsersData] = useState([]);
	const [assignmentsData, setAssignmentsData] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const allUsers = await getAllUsers();
			if (allUsers.status === "Success") {
				setUsersData(allUsers.data);
				console.log("usersData: ", usersData);
			}
		};
		const fetchAssignments = async () => {
			const allAssignments = await getAllAssignments();
			if (allAssignments.status === "Success") {
				setAssignmentsData(allAssignments.data);
				console.log("assignmentsData: ", assignmentsData);
			}
		};

		fetchUsers();
		fetchAssignments();
	}, [user, userLoading, classes, isClassLoading]);

	const studentColumns = [
		{ accessorKey: "firstname", header: "First Name" },
		{ accessorKey: "lastname", header: "Last Name" },
		{ accessorKey: "createdAt", header: "Date Joined" },
		{
		  accessorKey: "classes", 
		  header: "Classes",
		  cell: ({ row }) => row.original.classes.length !== 0 ? row.original.classes.length : "No classes" // Check for undefined
		}
	];
	  
	const instructorColumns = [
		{ accessorKey: "firstname", header: "First Name" },
		{ accessorKey: "lastname", header: "Last Name" },
		{ accessorKey: "createdAt", header: "Date Joined" },
		{
		  accessorKey: "classesInstructed", 
		  header: "Classes Instructed",
		  cell: ({ row }) => row.original.classesInstructed !== 0 ? row.original.classesInstructed.length : "No classes" // Check for undefined
		}
	  ];	  

	return (
		<div className="max-w-screen">
			<div className="flex flex-col gap-6">
				<div className="flex w-full max-h-40 gap-2">
					<StatCard
						title="Users"
						number={usersData.length}
						description={
							<>
							  Students - {usersData.filter(user => user.role === 'STUDENT').length}
							  <br />
							  Instructors - {usersData.filter(user => user.role === 'INSTRUCTOR').length}
							</>
						  }
						icon={<UsersIcon className="w-6 h-6" />}
					/>
					{classes && !isClassLoading &&
					<StatCard
						title="Classes"
						number={classes.length}
						icon={<AcademicCapIcon className="w-6 h-6" />}
					/>
					}
					<StatCard
						title="Assignments"
						number={assignmentsData.length}
						icon={<DocumentTextIcon className="w-6 h-6" />}
					/>
					{/* <StatCard
						title="Peer Reviews"
						number={peerReviews}
						description={`Reviews completed - ${3}`}
						icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
					/> */}
				</div>
				<div className="flex flex-col w-full">
					<Tabs defaultValue="students">
						<TabsList>
							<TabsTrigger value="students">Students</TabsTrigger>
							<TabsTrigger value="instructors">Instructors</TabsTrigger>
						</TabsList>
						<TabsContent value="students">
							<div className="mb-6 pt-6 bg-white rounded-lg">
								<DataTable
									title="Students"
									data={usersData.filter(user => user.role === 'STUDENT')}
									columns={studentColumns}
									pageSize={5}
									enableStatus={true}
								/>
							</div>
						</TabsContent>
						<TabsContent value="instructors">
							<div className="mb-6 pt-6 bg-white rounded-lg">
								<DataTable
									title="Instructors"
									data={usersData.filter(user => user.role === 'INSTRUCTOR')}
									columns={instructorColumns}
									pageSize={5}
									enableStatus={true}
								/>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default Overview;
