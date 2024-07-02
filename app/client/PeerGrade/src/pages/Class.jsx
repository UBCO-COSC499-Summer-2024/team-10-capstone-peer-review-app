import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Grades from "./classNav/Grades";
import Groups from "./classNav/Groups";
import Files from "./classNav/Files";
import People from "./classNav/People";
import AssignmentCreation from "./classNav/AssignmentCreation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/contextHooks/useUser";
import {
	getAllAssignmentsByClassId,
	getCategoriesByClassId,
	getClassById
} from "@/api/classApi";
import { useToast } from "@/components/ui/use-toast";

const Class = () => {
	const { classId } = useParams();
	const { user, userLoading } = useUser();
	const [currentView, setCurrentView] = useState("home");
	const [classItem, setClassItem] = useState(null);
	const [assignments, setAssignments] = useState([]);
	const [categories, setCategories] = useState([]);
	const { toast } = useToast();

	// Ask kevin about clearn up functions? abort controllers?
	useEffect(() => {
		const fetchClassData = async () => {
			try {
				const fetchedClass = await getClassById(classId);
				setClassItem(fetchedClass.data);
				console.log(fetchedClass.data);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch class data",
					variant: "destructive"
				});
			}
		};

		fetchClassData();
	}, [classId, toast]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const fetchedCategories = await getCategoriesByClassId(classId);
				setCategories(fetchedCategories.data);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch categories",
					variant: "destructive"
				});
			}
		};

		fetchCategories();
	}, [classId, toast]);

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				const fetchedAssignments = await getAllAssignmentsByClassId(classId);
				setAssignments(fetchedAssignments.data);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch assignments",
					variant: "destructive"
				});
			}
		};

		if (!userLoading && user) {
			fetchAssignments();
		}
	}, [classId, user, userLoading, toast]);

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
				return <AssignmentCreation />;
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
												to={`/assignment/${assignment.assignmentId}`}
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
			<div className="flex flex-col gap-4 bg-gray-200 p-4 mb-6 rounded-lg">
				<h1 className="text-3xl font-bold">
					{classItem.classname}: {classItem.instructor?.firstname}{" "}
					{classItem.instructor?.lastname}
				</h1>
				<div className="flex rounded-lg">
					<div className="flex justify-between items-center">
						<Menubar className="bg-gray-200">
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => setCurrentView("home")}
								>
									HOME
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => setCurrentView("grades")}
								>
									GRADES
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => setCurrentView("people")}
								>
									PEOPLE
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => setCurrentView("groups")}
								>
									GROUPS
								</MenubarTrigger>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger
									className="border border-gray-600 rounded-lg hover:bg-gray-300 cursor-pointer"
									onClick={() => setCurrentView("files")}
								>
									FILES
								</MenubarTrigger>
							</MenubarMenu>
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
								onClick={() => setCurrentView("assignmentCreation")}
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
