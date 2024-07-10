import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClassCard from "@/components/class/ClassCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import DataTable from "@/components/ui/data-table";
import { ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupCard from "@/components/class/GroupCard";
import { Skeleton } from "@/components/ui/skeleton";

import { format, parseISO } from "date-fns";

import { getAllAssignments } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";

function Dashboard() {
	const { user, userLoading } = useUser();

	const { classes, isClassLoading } = useClass();
	const [assignments, setAssignments] = useState([]);
	const [groups, setGroups] = useState([]);
	// const [reviews, setReviews] = useState([]);
	const { toast } = useToast();

	useEffect(() => {
		// No need to check if userLoading, if user is truthy, will not run if its undefined or null
		if (user) {
			const fetchAssignments = async () => {
				try {
					const assignmentsData = await getAllAssignments(user.userId);
					console.log("assignmentsData", assignmentsData);
					setAssignments(
						Array.isArray(assignmentsData.data) ? assignmentsData.data : []
					);
				} catch (error) {
					console.error("Failed to fetch assignments", error);
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
		return <p>User's not logged in.</p>;
	}

	const classNames = classes.map((classItem) => classItem.classname);

	return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

    <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          <div>
            <p>No recent announcements.</p>
          </div>
        </div>
        <div className="bg-white flex justify-center items-center p-2 rounded-lg shadow-md">
          {userLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <GroupCard
              classes={classes}
              groups={groups}
              classNames={classNames}
              users={user}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Tabs defaultValue="assignments">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="assignments">
              <DataTable
                title="Upcoming Assignments"
                data={assignmentData}
                columns={assignmentColumns}
                pageSize={4}
              />
            </TabsContent>
            <TabsContent value="reviews">
              <DataTable
                title="Upcoming Reviews"
                data={reviewData}
                columns={reviewColumns}
                pageSize={4}
              />
            </TabsContent>
          </Tabs>
        </div>
		<div className="flex flex-col bg-[#fff] justify-center gap-2 h-full items-center rounded-lg ">
          {userLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
            <Carousel className="w-3/4 ">
              <CarouselContent>
                {classes.map((classItem) => (
                  <CarouselItem key={classItem.classId}>
                    <ClassCard
                      classId={classItem.classId}
                      className={classItem.classname}
                      instructor={`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}
                      numStudents={classItem.classSize}
                      term={classItem.term}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
