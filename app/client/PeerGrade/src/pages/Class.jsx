import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Grades from "./classNav/Grades";
import Groups from "./classNav/Groups";
import Files from "./classNav/Files";
import People from "./classNav/People";
import Rubrics from "./classNav/Rubrics";
import AssignmentCreation from "./classNav/AssignmentCreation";
import EditClass from "./classNav/EditClass";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getCategoriesByClassId } from "@/api/classApi";
import { useToast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";

const Class = () => {
	const { classId } = useParams();
	const [currentView, setCurrentView] = useState("home");
	const [assignments, setAssignments] = useState([]);
	const [categories, setCategories] = useState([]);

	const { toast } = useToast();
	const { user, userLoading } = useUser();
	const { classes } = useClass();

	const classItem = classes.find((classItem) => classItem.classId === classId);

	const fetchClassData = async () => {
		try {
			const [fetchedAssignments, fetchedCategories] = await Promise.all([
				getAllAssignmentsByClassId(classId),
				getCategoriesByClassId(classId)
			]);
			setAssignments(fetchedAssignments.data);
			setCategories(fetchedCategories.data);
		} catch (error) {
			console.error("Failed to fetch class data", error);
			toast({
				title: "Error",
				description: "Failed to fetch class data",
				variant: "destructive"
			});
		}
	};

	useEffect(() => {
		if (!userLoading && user) {
			fetchClassData();
		}
	}, [classId, user, userLoading, currentView]);

	const handleViewChange = (view) => {
		setCurrentView(view);
		fetchClassData();
	};

	if (!classItem) {
		return <div>Class not found</div>;
	}

	const renderContent = () => {
		switch (currentView) {
		  case "grades":
			return <Grades classAssignments={assignments} classId={classId} />;
		  case "people":
			return <People classId={classId} />;
		  case "groups":
			return <Groups classId={classId} />;
		  case "files":
			return <Files classId={classId} />;
		  case "assignmentCreation":
			return <AssignmentCreation onAssignmentCreated={() => {
			  fetchClassData();
			  handleViewChange("files");
			}} />;
		  case "edit":
			return <EditClass classItem={classItem} />;
		  case "rubrics":
			return <Rubrics />;
			default:
				return (
					<>
					<Alert className="mb-6">
						<AlertTitle>Recent Announcements</AlertTitle>
						<AlertDescription>
						No recent announcements
						</AlertDescription>
					</Alert>
					<Accordion type="single" collapsible className="w-full bg-muted p-4 rounded-lg">
						{categories.map((category) => (
						<AccordionItem value={category.categoryId} key={category.categoryId}>
							<AccordionTrigger className="text-lg font-semibold">
							{category.name}
							</AccordionTrigger>
							<AccordionContent>
							<div className="space-y-4">
								{category.assignments.map((assignment) => (
								<Link
									key={assignment.assignmentId}
									to={`/class/${classId}/assignment/${assignment.assignmentId}`}
									className="block"
								>
									<Alert 
									variant="default" 
									className="hover:bg-accent cursor-pointer transition-colors"
									>
									<div className="flex items-center justify-between">
										<div>
										<AlertTitle className="text-base font-medium flex items-center gap-2">
											{assignment.title}
											{assignment.status === 'Completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
										</AlertTitle>
										<AlertDescription className="text-sm text-muted-foreground mt-1">
											Due: {new Date(assignment.dueDate).toLocaleDateString()}
										</AlertDescription>
										</div>
										<div className="flex items-center gap-2">
										<Badge variant={assignment.status === 'Completed' ? "secondary" : "default"}>
											{assignment.status}
										</Badge>
										<Button variant="outline" size="sm">
											<Clock className="h-4 w-4 mr-1" />
											Start
										</Button>
										</div>
									</div>
									</Alert>
								</Link>
								))}
							</div>
							</AccordionContent>
						</AccordionItem>
						))}
					</Accordion>
					</>
				);
		}
	  };
	
	  return (
		<div className="w-full px-6">
		  <div className="flex flex-col gap-1 mt-5 mb-6 rounded-lg">
			<h1 className="text-3xl font-bold">{classItem.classname}</h1>
			<span className="ml-1 text-sm text-gray-500 mb-2">
			  {classItem.description}
			</span>
	
			<Menubar className="flex gap-2">
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "home"}
							className="cursor-pointer"
							onClick={() => handleViewChange("home")}
						>
							HOME
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "grades"}
							className="cursor-pointer"
							onClick={() => handleViewChange("grades")}
						>
							GRADES
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "people"}
							className="cursor-pointer"
							onClick={() => handleViewChange("people")}
						>
							PEOPLE
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "groups"}
							className="cursor-pointer"
							onClick={() => handleViewChange("groups")}
						>
							GROUPS
						</MenubarTrigger>
					</MenubarMenu>
					<MenubarMenu>
						<MenubarTrigger
							isActive={currentView === "files"}
							className="cursor-pointer"
							onClick={() => handleViewChange("files")}
						>
							FILES
						</MenubarTrigger>
					</MenubarMenu>
					{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
						<MenubarMenu>
							<MenubarTrigger
								isActive={currentView === "edit"}
								className="cursor-pointer"
								onClick={() => handleViewChange("edit")}
							>
								EDIT
							</MenubarTrigger>
						</MenubarMenu>
					)}
					{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
						<MenubarMenu>
							<MenubarTrigger
								isActive={currentView === "rubrics"}
								className="cursor-pointer"
								onClick={() => handleViewChange("rubrics")}
							>
								RUBRICS
							</MenubarTrigger>
						</MenubarMenu>
					)}
				</Menubar>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">{renderContent()}</div>
				<div className="space-y-6">
				{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") &&
					currentView !== "assignmentCreation" && (
					<Button
						variant="outline"
						onClick={() => handleViewChange("assignmentCreation")}
						className="w-full bg-white"
					>
						Create Assignment
					</Button>
					)}
				<Card>
					<CardContent className="text-center py-6">
					<span className="block text-4xl font-bold">98%</span>
					<span className="text-gray-500">Class Grade</span>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="text-center py-6">
					<span className="block text-4xl font-bold">98%</span>
					<span className="text-gray-500">Avg Peer Grade</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
					<CardTitle>To Do</CardTitle>
					</CardHeader>
					<CardContent>
					<Alert>
						<AlertDescription>No tasks due</AlertDescription>
					</Alert>
					</CardContent>
				</Card>
				</div>
			</div>
			</div>
		);
		};

		export default Class;
