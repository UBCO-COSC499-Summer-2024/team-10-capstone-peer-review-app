import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClassCard from "@/components/class/ClassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import DataTable from "@/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupCard from "@/components/class/GroupCard";
import { Skeleton } from "@/components/ui/skeleton";

import { format, parseISO } from "date-fns";
import { useUser } from "@/contexts/contextHooks/useUser";
import { getClassesByUserId, getAllAssignments } from "@/api/classApi";
import { getGroups } from "@/api/userApi";

function Dashboard() {
	const { user, userLoading } = useUser();

	const [classes, setClasses] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [groups, setGroups] = useState([]);
	const [reviews, setReviews] = useState([]);
	const { toast } = useToast();

	useEffect(() => {
		if (!userLoading && user) {
			const fetchClasses = async () => {
				try {
					const classesData = await getClassesByUserId(user.userId);
					console.log(classesData);
					setClasses(Array.isArray(classesData) ? classesData : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch classes",
						variant: "destructive"
					});
				}
			};

			const fetchAssignments = async () => {
				try {
					const assignmentsData = await getAllAssignments(user.userId);
					console.log(assignmentsData);
					setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch assignments",
						variant: "destructive"
					});
				}
			};

			const fetchGroups = async () => {
				try {
					const groups = await getGroups(user.userId);
					console.log("groups", groups);
					setGroups(Array.isArray(groups) ? groups : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch groups",
						variant: "destructive"
					});
				}
			};

			// will change once reviews api calls is figured out.
			// const fetchReviews = async () => {
			// 	try {
			// 		const response = await axios.get("/api/users/reviews");
			// 		setReviews(Array.isArray(response.data) ? response.data : []);
			// 	} catch (error) {
			// 		toast({
			// 			title: "Error",
			// 			description: "Failed to fetch reviews",
			// 			variant: "destructive"
			// 		});
			// 	}
			// };

			fetchClasses();
			fetchAssignments();
			fetchGroups();
			// fetchReviews();
		}
	}, [user]);

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
			accessorKey: "classes.classname",
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
				<span>{format(parseISO(row.getValue("dueDate")), "yyyy-MM-dd")}</span>
			)
		},
		{
			accessorKey: "action",
			header: "Actions",
			cell: ({ row }) => (
				<Link
					to={`/class/${row.original.classId}/assignment/${row.original.assignmentId}`}
					className="bg-green-100 px-2 py-1 rounded-md"
				>
					Open
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
			accessorKey: "classes.classname",
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
			cell: ({ row }) => <span>{parseISO(row.getValue("dueDate"))}</span>
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

	const classNames = classes.map((classItem) => classItem.classname);

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
				<div className="flex w-1/2">
					{userLoading ? (
						// Skeleton for GroupCard
						<Skeleton className="h-96 w-full rounded-lg" />
					) : (
						<GroupCard
							classes={classes}
							groups={groups}
							classNames={classNames}
							users={user}
						/>
					)}
				</div>
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
