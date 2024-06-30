import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClassCard from "@/components/class/ClassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import DataTable from "@/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iClass, assignment, user, Group } from "@/utils/dbData"; // Replace this with actual data, only for GroupCard
import GroupCard from "@/components/class/GroupCard";
import { Skeleton } from "@/components/ui/skeleton";

import { useUser } from "@/contexts/contextHooks/useUser";
import { getClassesByUserId, getAllAssignments } from "@/api/classApi";

function Dashboard() {
	const { user, userLoading } = useUser();

	const [classes, setClasses] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [reviews, setReviews] = useState([]);
	const { toast } = useToast();

	useEffect(() => {
		if (!userLoading && user) {
			const fetchClasses = async () => {
				const classesData = await getClassesByUserId(user.userId);
				if (classesData.status === "Success") {
					setClasses(Array.isArray(classesData) ? classesData : []);
				}
			};

			const fetchAssignments = async () => {
				const assignmentsData = await getAllAssignments(user.userId);
				if (assignmentsData.status === "Success") {
					setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
				}
			};

			// will change once reviews api calls is figured out.
			const fetchReviews = async () => {
				// const reviewsData = await axios.get("/api/users/reviews");
				if (reviewsData.status === "Success") {
					setReviews(Array.isArray(reviewData) ? reviewData : []);
				}
			};

			fetchClasses();
			fetchAssignments();
			fetchReviews();
		}
	}, [user, userLoading]);

	const assignmentData = assignments.filter(
		(assignment) => assignment.evaluation_type !== "peer"
	);
	const reviewData = assignments.filter(
		(assignment) => assignment.evaluation_type === "peer"
	);

	const assignmentColumns = [
		{
			accessorKey: "title",
			header: "Assignment Name"
		},
		{
			accessorKey: "className",
			header: "Class Name"
		},
		{
			accessorKey: "dueDate",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Due
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<Badge variant="destructive">{row.getValue("dueDate")}</Badge>
			)
		},
		{
			accessorKey: "action",
			header: "Actions",
			cell: ({ row }) => (
				<Link
					to={row.original.link}
					className="bg-green-100 text-blue-500 px-2 py-1 rounded-md"
				>
					{row.getValue("action")}
				</Link>
			)
		}
	];

	const reviewColumns = [
		{
			accessorKey: "title",
			header: "Assignment Name"
		},
		{
			accessorKey: "className",
			header: "Class Name"
		},
		{
			accessorKey: "dueDate",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Review Due
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<Badge variant="destructive">{row.getValue("dueDate")}</Badge>
			)
		},
		{
			accessorKey: "action",
			header: "Actions",
			cell: ({ row }) => (
				<Link
					to={row.original.link}
					className="bg-green-100 text-blue-500 px-2 py-1 rounded-md"
				>
					{row.getValue("action")}
				</Link>
			)
		}
	];

	if (userLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <p>No user</p>;
	}

	return (
		<div className="w-full main-container space-y-6 ">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
				{userLoading
					? Array.from({ length: 3 }).map((_, index) => (
							<Skeleton key={index} className="h-48 w-full rounded-lg" />
						))
					: classes.map((classItem) => (
							<ClassCard
								key={classItem.classId}
								classId={classItem.classId}
								className={classItem.classname}
								instructor={`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}
								numStudents={classItem.classSize}
								term={classItem.term}
							/>
						))}
			</div>
			<div className="flex justify-between items-start gap-5 pt-5">
				{/* Need to refactor group card */}
				{/*
		<div className="flex w-1/2">
			{userLoading ? (
				// Skeleton for GroupCard
				<Skeleton className="h-96 w-full rounded-lg" />
			) : (
				<GroupCard
					classes={[iClass[0], iClass[1], iClass[2]]}
					groups={Group}
					classNames={iClassNames}
					users={user}
				/>
			)}
		</div> */}
				<div className="flex w-3/4">
					<Tabs defaultValue="assignments" className="flex-1">
						{userLoading ? (
							<Skeleton className="h-48 w-full rounded-lg" />
						) : (
							<TabsList className="grid w-1/3 grid-cols-2">
								<TabsTrigger value="assignments">Assignments</TabsTrigger>
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
							</TabsList>
						)}
						<TabsContent value="assignments">
							{userLoading ? (
								<Skeleton className="h-48 w-full rounded-lg" />
							) : (
								<DataTable
									title="Upcoming Assignments"
									data={assignmentData}
									columns={assignmentColumns}
									pageSize={4}
								/>
							)}
						</TabsContent>
						<TabsContent value="reviews">
							{userLoading ? (
								<Skeleton className="h-48 w-full rounded-lg" />
							) : (
								<DataTable
									title="Upcoming Reviews"
									data={reviewData}
									columns={reviewColumns}
									pageSize={4}
								/>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
