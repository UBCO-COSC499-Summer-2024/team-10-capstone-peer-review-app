import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

function Dashboard() {
	const { user } = useUser();

	const [classes, setClasses] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [reviews, setReviews] = useState([]);

	const { toast } = useToast();

	const iClassNames = iClass.map((cls) => ({
		class_id: cls.class_id,
		classname: cls.classname
	})); // only for GroupCard

	console.log("User:", user);

	useEffect(() => {
		if (user) {
			const fetchClasses = async () => {
				try {
					const response = await axios.post("/api/users/get-classes", {
						userId: user.userId
					});
					setClasses(Array.isArray(response.data) ? response.data : []);
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
					const response = await axios.post("/api/users/get-assignments", {
						userId: user.userId
					});
					setAssignments(Array.isArray(response.data) ? response.data : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch assignments",
						variant: "destructive"
					});
				}
			};

			const fetchReviews = async () => {
				try {
					const response = await axios.get("/api/users/reviews");
					setReviews(Array.isArray(response.data) ? response.data : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch reviews",
						variant: "destructive"
					});
				}
			};

			fetchClasses();
			fetchAssignments();
			fetchReviews();
		}
	}, [user, toast]);

	console.log(classes);

	// Loading state
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simulate loading time for now. Replace this with actual API call timing.
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	if (!user) {
		return <p>No user</p>;
	}

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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Due
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Review Due
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
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

	return (
		<div className="w-full main-container space-y-6 ">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
				{loading
					? // Skeleton for ClassCard
						Array.from({ length: 3 }).map((_, index) => (
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
					{loading ? (
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
				</div>
				<div className="flex w-3/4">
					<Tabs defaultValue="assignments" className="flex-1">
						{loading ? (
							<Skeleton className="h-48 w-full rounded-lg" />
						) : (
							<TabsList className="grid w-1/3 grid-cols-2">
								<TabsTrigger value="assignments">Assignments</TabsTrigger>
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
							</TabsList>
						)}
						<TabsContent value="assignments">
							{loading ? (
								// Skeleton for DataTable
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
							{loading ? (
								// Skeleton for DataTable
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
