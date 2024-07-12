import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Grades from "./classNav/Grades";
import Groups from "./classNav/Groups";
import Files from "./classNav/Files";
import People from "./classNav/People";
import Rubrics from "./classNav/Rubrics";
import AssignmentCreation from "./classNav/assignment/AssignmentCreation";
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
						<Card className="bg-white p-4 shadow-md mb-6">
							<CardHeader>
								<CardTitle className="text-xl font-bold mb-2">
									Recent Announcements
								</CardTitle>
							</CardHeader>
							<CardContent className="bg-gray-100 p-4 rounded">
								No recent announcements
							</CardContent>
						</Card>
						{categories.map((category) => (
							<Card
								key={category.categoryId}
								className="bg-white p-4 shadow-md mb-6"
							>
								<CardHeader>
									<CardTitle className="text-xl font-bold mb-2">
										{category.name}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									{category.assignments.map((assignment) => (
										<div key={assignment.assignmentId} className="flex w-full">
											<Link
												to={`/class/${classId}/assignment/${assignment.assignmentId}`}
												className="flex items-center space-x-2 bg-gray-100 p-2 rounded hover:bg-gray-200 transition-colors w-full"
											>
												<span>{assignment.title}</span>
											</Link>
										</div>
									))}
								</CardContent>
							</Card>
						))}
					</>
				);
		}
	};

	return (
		<div className="w-screen main-container mx-5 p-6">
			<div className="flex flex-col gap-1 bg-gray-200 p-4 mb-6 rounded-lg">
				<h1 className="text-3xl font-bold">{classItem.classname}</h1>
				<span className="ml-1 text-sm text-gray-500 mb-2 ">
					{" "}
					{classItem.description}{" "}
				</span>
				<div className="flex rounded-lg">
					<div className="flex justify-between items-center">
						<Menubar className="bg-gray-200">
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => handleViewChange("home")}
								>
									HOME
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => handleViewChange("grades")}
								>
									GRADES
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => handleViewChange("people")}
								>
									PEOPLE
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => handleViewChange("groups")}
								>
									GROUPS
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => handleViewChange("files")}
								>
									FILES
								</MenubarTrigger>
							</MenubarMenu>
							{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
								<MenubarMenu>
									<MenubarTrigger
										className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
										onClick={() => handleViewChange("edit")}
									>
										EDIT
									</MenubarTrigger>
								</MenubarMenu>
							)}
							{(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
								<MenubarMenu>
									<MenubarTrigger
										className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
										onClick={() => handleViewChange("rubrics")}
									>
										RUBRICS
									</MenubarTrigger>
								</MenubarMenu>
							)}
						</Menubar>
					</div>
				</div>
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
					<Card className="bg-white p-4 shadow-md">
						<CardContent className="text-center">
							<span className="block text-4xl font-bold">98%</span>
							<span className="text-gray-500">Class Grade</span>
						</CardContent>
					</Card>
					<Card className="bg-white p-4 shadow-md">
						<CardContent className="text-center">
							<span className="block text-4xl font-bold">98%</span>
							<span className="text-gray-500">Avg Peer Grade</span>
						</CardContent>
					</Card>
					<Card className="bg-white p-4 shadow-md">
						<CardHeader>
							<CardTitle className="text-xl font-bold mb-2">To Do</CardTitle>
						</CardHeader>
						<CardContent className="bg-gray-100 p-4 rounded">
							No tasks due
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Class;