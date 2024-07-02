import React from "react";
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

const generateRandomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const studentsData = [
	{
		id: 1,
		name: "John Doe",
		status: "Active",
		dateJoined: "2022-01-01",
		classes: 4
	},
	{
		id: 2,
		name: "Jane Smith",
		status: "Inactive",
		dateJoined: "2021-07-15",
		classes: 3
	}
	// Add more student data here...
];

const instructorsData = [
	{
		id: 1,
		name: "Prof. John Doe",
		status: "Active",
		dateJoined: "2020-09-01",
		classes: 3
	},
	{
		id: 2,
		name: "Dr. Jane Smith",
		status: "Inactive",
		dateJoined: "2019-11-05",
		classes: 2
	}
	// Add more instructor data here...
];

const instructorApprovalsData = [
	{
		id: 1,
		name: "Prof. Pending Approval",
		status: "Pending",
		dateJoined: "2023-01-01"
	}
	// Add more approval data here...
];

const Overview = () => {
	const users = generateRandomNumber(50, 100);
	const students = generateRandomNumber(30, 50);
	const instructors = generateRandomNumber(2, 5);
	const classes = generateRandomNumber(20, 50);
	const deactivatedClasses = generateRandomNumber(5, 15);
	const assignments = generateRandomNumber(100, 200);
	const peerReviews = generateRandomNumber(200, 400);

	const studentColumns = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "status", header: "Status" },
		{ accessorKey: "dateJoined", header: "Date Joined" },
		{ accessorKey: "classes", header: "Classes" }
	];

	const instructorColumns = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "status", header: "Status" },
		{ accessorKey: "dateJoined", header: "Date Joined" },
		{ accessorKey: "classes", header: "Classes" }
	];

	const approvalColumns = [
		{ accessorKey: "name", header: "Name" },
		{ accessorKey: "status", header: "Status" },
		{ accessorKey: "dateJoined", header: "Date Joined" },
		{
			accessorKey: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex justify-around">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleApprove(row.original)}
					>
						<CheckCircleIcon className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleReject(row.original)}
					>
						<XCircleIcon className="w-4 h-4" />
					</Button>
				</div>
			),
			enableSorting: false,
			enableColumnFilter: false,
			enableActions: false
		}
	];

	const handleApprove = (instructor) => {
		console.log("Approve:", instructor);
		// Implement approval logic here
	};

	const handleReject = (instructor) => {
		console.log("Reject:", instructor);
		// Implement rejection logic here
	};

	const handleMoreInfo = (instructor) => {
		console.log("More Info:", instructor);
		// Implement more info logic here
	};

	return (
		<div className="max-w-screen">
			<div className="flex flex-col gap-6">
				<div className="flex w-full max-h-40 gap-2">
					<StatCard
						title="Users"
						number={users}
						description={`Students - ${students}\nInstructors - ${instructors}`}
						icon={<UsersIcon className="w-6 h-6" />}
					/>
					<StatCard
						title="Classes"
						number={classes}
						description={`Classes deactivated - ${deactivatedClasses}`}
						icon={<AcademicCapIcon className="w-6 h-6" />}
					/>
					<StatCard
						title="Assignments"
						number={assignments}
						description={`Assignments completed - ${generateRandomNumber(50, assignments)}`}
						icon={<DocumentTextIcon className="w-6 h-6" />}
					/>
					<StatCard
						title="Peer Reviews"
						number={peerReviews}
						description={`Reviews completed - ${generateRandomNumber(100, peerReviews)}`}
						icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />}
					/>
				</div>
				<div className="flex flex-col w-full">
					<Tabs defaultValue="students">
						<TabsList>
							<TabsTrigger value="students">Students</TabsTrigger>
							<TabsTrigger value="instructors">Instructors</TabsTrigger>
							<TabsTrigger value="approvals">Approvals</TabsTrigger>
						</TabsList>
						<TabsContent value="students">
							<div className="mb-6 pt-3 bg-white">
								<DataTable
									title="Students"
									data={studentsData}
									columns={studentColumns}
									pageSize={5}
									enableStatus={true}
								/>
							</div>
						</TabsContent>
						<TabsContent value="instructors">
							<div className="mb-6 pt-3 bg-white">
								<DataTable
									title="Instructors"
									data={instructorsData}
									columns={instructorColumns}
									pageSize={5}
									enableStatus={true}
								/>
							</div>
						</TabsContent>
						<TabsContent value="approvals">
							<div className="mb-6 pt-3 bg-white">
								<DataTable
									title="Instructor Approvals"
									data={instructorApprovalsData}
									columns={approvalColumns}
									pageSize={5}
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
