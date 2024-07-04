import { useEffect, useState } from "react";
import { peopleData } from "../../utils/data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MinusCircle, Plus } from "lucide-react";

import { useUser } from "@/contexts/contextHooks/useUser";
import { getInstructorByClassId, getStudentsByClassId, removeStudentFromClass } from "@/api/classApi";

const People = ({ classId }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const { user, userLoading } = useUser();
	const [students, setStudents] = useState([]);
	const [instructor, setInstructor] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	useEffect(() => {
		const fetchInstructor = async () => {
			const instructor = await getInstructorByClassId(classId);
			console.log("instuctor", instructor);
			if (instructor.status === "Success") {
				setInstructor(instructor.data);
			}
		};

		fetchInstructor();
	}, [classId]);

	useEffect(() => {
		const fetchStudents = async () => {
			const students = await getStudentsByClassId(classId);
			console.log("students", students);
			if (students.status === "Success") {
				setStudents(students.data);
			}
		};

		fetchStudents();
	}, [classId]);

	// TODO: Change this to an array of instructors if we end up deciding to have multiple instructors per class later on
	// const filteredInstructors = instructor.filter((person) =>
	// 	person.name.toLowerCase().includes(searchTerm.toLowerCase())
	// );

	let filteredInstructor = null;
	if (instructor.firstname && instructor.lastname) {
		const fullName =
			`${instructor.firstname} ${instructor.lastname}`.toLowerCase();
		if (fullName.includes(searchTerm.toLowerCase())) {
			filteredInstructor = instructor; // instructor matches the search term
		}
	}

	// For the students array
	const filteredStudents = students.filter((student) => {
		const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
		return fullName.includes(searchTerm.toLowerCase());
	});

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	const handleDeleteStudent = async () => {
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedUser) {
				const userData = await removeStudentFromClass(classId, selectedUser.userId);
				if (userData.status === "Success") {
					console.log("deleted user", userData);
					setDialogOpen(false);
					setStudents(prevStudents => prevStudents.filter(student => student.userId !== selectedUser.userId));
				} else {
					console.error('An error occurred while deleting the user.', userData.message);
				}
			}
		} else {
			setConfirmDelete(true);
		}
	};

	const handleAddStudent = async () => {
		const userData = await removeStudentFromClass(classId, selectedUser.userId);
		if (userData.status === "Success") {
			console.log("deleted user", userData);
			setDialogOpen(false);
			setStudents(prevStudents => prevStudents.filter(student => student.userId !== selectedUser.userId));
		} else {
			console.error('An error occurred while deleting the user.', userData.message);
		}
	};

	return (
		<div className="w-full p-6 bg-white">
			<Input
				type="text"
				placeholder="Search people"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="mb-6"
			/>
			<div>
				<h2 className="text-lg font-bold mb-2">Instructor</h2>
				{filteredInstructor && (
					<Card
						key={filteredInstructor.userId}
						className="flex items-center p-4 mb-2"
					>
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-3 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={filteredInstructor.avatarUrl}
									alt={`${filteredInstructor.firstname} ${filteredInstructor.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(
										filteredInstructor.firstname,
										filteredInstructor.lastname
									)}
								</AvatarFallback>
							</Avatar>
							<span>
								{filteredInstructor.firstname} {filteredInstructor.lastname}
							</span>
						</div>
						{/* <div className="flex flex-row justify-center items-center space-x-2">
							{user.role === "ADMIN" && 
								<Button variant="outline" className="bg-gray-100">
									<MinusCircle className='w-5 h-5 mr-2'/> Delete
								</Button>
							}
						</div> */}
					</Card>
				)}
			</div>
			<div className="mt-6">
				<div className="flex flex-row items-center justify-between mb-2">
					<h2 className="text-lg font-bold inline-block">Students</h2>
					{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
						<Button variant="ghost" className="bg-gray-100 h-7 w-7">
							<Plus className='w-5 h-5'/>
						</Button>
					}
				</div>
				{filteredStudents.map((student) => (
					<Card
						key={student.userId}
						className="flex items-center justify-between p-4 mb-2"
					>
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-2.5 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={student.avatarUrl}
									alt={`${student.firstname} ${student.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(student.firstname, student.lastname)}
								</AvatarFallback>
							</Avatar>
							<span>
								{student.firstname} {student.lastname}
							</span>
						</div>
						<div className="flex flex-row justify-center items-center space-x-2">
							{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
								<Button variant="outline" className="bg-gray-100">
									<MinusCircle className='w-5 h-5 mr-2'/> Delete
								</Button>
							}
							<Button variant="outline" className="bg-gray-100">
								Add to Group
							</Button>
						</div>
					</Card>
				))}
			</div>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className={confirmDelete ? 'border-red-950 bg-red-500 text-white' : ''}>
				<DialogHeader>
					<DialogTitle>{confirmDelete ? "Confirm" : ""} Delete User</DialogTitle>
				</DialogHeader>
				Are you {confirmDelete ? "really" : ""} sure you want to delete the user {selectedUser.classname}?
				<span className='font-extrabold'>WARNING: THIS WILL DELETE ALL ASSIGNMENTS, SUBMISSIONS, REVIEWS, CATEGORIES, AND GROUPS ASSOCIATED WITH THIS USER.</span>
				<DialogFooter>
					<Button onClick={() => setDialogOpen(false)} className={confirmDelete ? 'shadow-md shadow-red-900' : ''}>Cancel</Button>
					<Button variant="destructive" onClick={handleDeleteStudent} className={confirmDelete ? 'shadow-md shadow-red-900' : ''}>Delete</Button>
				</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Students</DialogTitle>
				</DialogHeader>
				
				<DialogFooter>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button variant="destructive" onClick={handleAddStudent}>Delete</Button>
				</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default People;
