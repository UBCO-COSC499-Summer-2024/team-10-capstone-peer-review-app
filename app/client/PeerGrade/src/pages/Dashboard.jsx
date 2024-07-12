import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GradeCard from "@/components/class/GradeCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Users, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupCard from "@/components/class/GroupCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { getAllAssignments } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function Dashboard() {
	const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
	const [isLoading, setIsLoading] = useState(false);
	const [assignments, setAssignments] = useState([]);
	const [groups, setGroups] = useState([]);
	const { toast } = useToast();

	useEffect(() => {
		if (user) {
			const fetchAssignments = async () => {
				setIsLoading(true);
				try {
					const assignmentsData = await getAllAssignments(user.userId);
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
				setIsLoading(false);
			};

			const fetchGroups = async () => {
				try {
					const groups = await getGroups(user.userId);
					setGroups(Array.isArray(groups) ? groups : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch groups",
						variant: "destructive"
					});
				}
			};

			fetchAssignments();
			fetchGroups();
		}
	}, [user]);

	const assignmentData = assignments.filter(
		(assignment) => assignment.evaluation_type !== "peer"
	);
	const reviewData = assignments.filter(
		(assignment) => assignment.evaluation_type === "peer"
	);

	const gradeData = assignments.map((assignment) => ({
		assignmentId: assignment.assignmentId,
		classId: assignment.classId,
		className: assignment.classes.classname,
		assignmentTitle: assignment.title,
		grade: assignment.grade, // Assuming grade is part of the assignment data
		dueDate: format(parseISO(assignment.dueDate), "MMM d, yyyy")
	}));

	if (userLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Skeleton className="h-[600px] w-[800px]" />
			</div>
		);
	}

	if (!user) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>User is not logged in.</AlertDescription>
			</Alert>
		);
	}

	const renderAssignmentAlert = (assignment) => (
		<Alert key={assignment.assignmentId} className="mb-4">
			<AlertTitle className="flex justify-between items-center">
				<span>{assignment.title}</span>
				<Badge variant="default">{assignment.classes.classname}</Badge>
			</AlertTitle>
			<AlertDescription className="flex justify-between items-center mt-2">
				<span className="flex items-center">
					<Calendar className="mr-2 h-4 w-4" />
					Due: {format(parseISO(assignment.dueDate), "MMM d, yyyy")}
				</span>
				<Link
					to={`/class/${assignment.classId}/assignment/${assignment.assignmentId}`}
					className="text-primary hover:text-primary-foreground"
				>
					<Button variant="outline" size="sm">
						Open
					</Button>
				</Link>
			</AlertDescription>
		</Alert>
	);

	const renderReviewAlert = (review) => (
		<Alert key={review.assignmentId} className="mb-4">
			<AlertTitle className="flex justify-between items-center">
				<span>{review.title}</span>
				<Badge variant="default">{review.classes.classname}</Badge>
			</AlertTitle>
			<AlertDescription className="flex justify-between items-center mt-2">
				<span className="flex items-center">
					<Calendar className="mr-2 h-4 w-4" />
					Review Due: {format(parseISO(review.dueDate), "MMM d, yyyy")}
				</span>
				<Link
					to={review.link}
					className="text-primary hover:text-primary-foreground"
				>
					<Button variant="outline" size="sm">
						Review
					</Button>
				</Link>
			</AlertDescription>
		</Alert>
	);

	return (
		<div className="mx-auto px-4">
			<h1 className="text-3xl font-bold mb-8 text-primary">Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<Card className="bg-muted rounded-lg shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center">
							<Bell className="mr-2" /> Recent Announcements
						</CardTitle>
					</CardHeader>
					<CardContent>
						{/* <p className="text-muted-foreground">No recent announcements.</p> */}
					</CardContent>
				</Card>
				<Card className="bg-muted rounded-lg shadow-md">
					<CardHeader>
						<CardTitle className="flex items-center">
							<Users className="mr-2" /> My Groups
						</CardTitle>
					</CardHeader>
					<CardContent>
						{userLoading ? (
							<Skeleton className="h-48 w-full" />
						) : (
							<GroupCard
								classes={classes}
								groups={groups}
								classNames={classes.map((c) => c.classname)}
								users={user}
							/>
						)}
					</CardContent>
				</Card>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card className="bg-muted rounded-lg shadow-md">
					<CardContent>
						<Tabs defaultValue="assignments">
							<TabsList className="grid w-full grid-cols-2 mb-4">
								<TabsTrigger value="assignments">Assignments</TabsTrigger>
								<TabsTrigger value="reviews">Reviews</TabsTrigger>
							</TabsList>
							<TabsContent value="assignments">
								<ScrollArea className="h-[400px] w-full ">
									{assignmentData.length > 0 ? (
										assignmentData.map(renderAssignmentAlert)
									) : (
										<p className="text-muted-foreground">
											No upcoming assignments.
										</p>
									)}
								</ScrollArea>
							</TabsContent>
							<TabsContent value="reviews">
								<ScrollArea className="h-[400px] w-full ">
									{reviewData.length > 0 ? (
										reviewData.map(renderReviewAlert)
									) : (
										<p className="text-muted-foreground">
											No upcoming reviews.
										</p>
									)}
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
				<Card className="bg-muted rounded-lg shadow-md">
					<CardContent>
						<Tabs defaultValue="grades">
							<TabsList className="grid w-full grid-cols-1 mb-4">
								<TabsTrigger value="grades">Recent Grades</TabsTrigger>
							</TabsList>
							<TabsContent value="grades">
								<ScrollArea className="h-[400px] w-full ">
									{gradeData.length > 0 ? (
										gradeData.map((grade) => (
											<GradeCard key={grade.assignmentId} {...grade} />
										))
									) : (
										<p className="text-muted-foreground">
											No recent grades available.
										</p>
									)}
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default Dashboard;
