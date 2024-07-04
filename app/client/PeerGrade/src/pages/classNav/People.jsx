import { useEffect, useState } from "react";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MinusCircle, Plus, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { useUser } from "@/contexts/contextHooks/useUser";
import { getInstructorByClassId, getStudentsByClassId, removeStudentFromClass, addStudentToClass } from "@/api/classApi";
import { getUsersByRole } from "@/api/userApi";

const People = ({ classId }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const { user, userLoading } = useUser();
	const [students, setStudents] = useState([]);
	const [instructor, setInstructor] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [studentOptions, setStudentOptions] = useState([]);
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchInstructor = async () => {
			const instructor = await getInstructorByClassId(classId);
			console.log("instructor", instructor);
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

	useEffect(() => {
		const fetchAllStudents = async () => {
		  try {
			const response = await getUsersByRole("STUDENT");
			if (response.status === "Success") {
				const currentStudentIds = students.map(student => student.userId);
				const transformedStudents = response.data
				.filter(student => !currentStudentIds.includes(student.userId))
				.map(student => ({
				  studentId: student.userId,
				  label: student.firstname + ' ' + student.lastname,
				}));
			  	setStudentOptions(transformedStudents);
			} else {
			  console.error('An error occurred while getting students.', response.message);
			}
		  } catch (error) {
			console.error('An error occurred while fetching students.', error);
		  }
		};
	
		fetchAllStudents();
	  }, [students]);

	const handleStudentSelection = (studentId) => {
		setSelectedStudents((prevSelected) => {
			if (prevSelected.includes(studentId)) {
				return prevSelected.filter(id => id !== studentId);
			} else {
				return [...prevSelected, studentId];
			}
		});
	};

	const handleDeleteClick = (selectedStudent) => {
		setConfirmDelete(false);
		setSelectedStudent(selectedStudent);
		console.log(selectedStudents);
		setDialogOpen(true);
	};

	const handleDeleteStudent = async () => {
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedStudent) {
				const userData = await removeStudentFromClass(classId, selectedStudent.userId);
				if (userData.status === "Success") {
					console.log("deleted user", userData);
					setDialogOpen(false);
					setStudents(prevStudents => prevStudents.filter(student => student.userId !== selectedStudent.userId));
				} else {
					console.log(userData);
					console.error('An error occurred while deleting the user.', userData.message);
				}
			}
		} else {
			setConfirmDelete(true);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Selected Students:', selectedStudents);

		if (selectedStudents.length > 0) {
			for (const student of selectedStudents) {
				const addStudent = await addStudentToClass(classId, student);
				if (addStudent.status === "Success") {
					console.log("added student", addStudent);
					setStudents(prevStudents => [...prevStudents, addStudent.data]);
				} else {
					console.error('An error occurred while adding the student.', addStudent.message);
				}
			}
		} else {
			console.error('No students selected.');
		}

		setAddDialogOpen(false);
	};

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
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
				{instructor && (
					<Card
						key={instructor.userId}
						className="flex items-center p-4 mb-2"
					>
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-3 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={instructor.avatarUrl}
									alt={`${instructor.firstname} ${instructor.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(
										instructor.firstname,
										instructor.lastname
									)}
								</AvatarFallback>
							</Avatar>
							<span>
								{instructor.firstname} {instructor.lastname}
							</span>
						</div>
					</Card>
				)}
			</div>
			<div className="mt-6">
				<div className="flex flex-row items-center justify-between mb-2">
					<h2 className="text-lg font-bold inline-block">Students</h2>
					{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
						<Button variant="ghost" className="bg-gray-100 h-7 w-7" onClick={() => setAddDialogOpen(true)}>
							<Plus className='w-5 h-5'/>
						</Button>
					}
				</div>
				{students.map((student) => (
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
								<Button variant="outline" className="bg-gray-100" onClick={() => handleDeleteClick(student)}>
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
				Are you {confirmDelete ? "really" : ""} sure you want to delete the user {selectedStudent.firstname}{' '}{selectedStudent.lastname}?
				<DialogFooter>
					<Button onClick={() => setDialogOpen(false)} className={confirmDelete ? 'shadow-md shadow-red-900' : ''}>Cancel</Button>
					<Button variant="destructive" onClick={handleDeleteStudent} className={confirmDelete ? 'shadow-md shadow-red-900' : ''}>Delete</Button>
				</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Student</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label
								htmlFor="selectStudents"
								className="block text-sm font-medium text-gray-700"
							>
								Select students to add to the class:
								</label>
							<Popover open={open} onOpenChange={setOpen} id="selectStudents">
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={`w-full justify-between bg-white mt-1 border`}
									>
										{selectedStudents.length > 0
											? `${selectedStudents.length} student(s) selected`
											: "Select students..."}
										{open ? (
											<ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										) : (
											<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="p-5 rounded-md">
									<Command>
										<CommandList>
											<CommandGroup>
												{studentOptions.length === 0 && <span className="text-sm text-gray-500">No students available to add.</span>}
												{studentOptions.map((student) => (
													<CommandItem
														key={student.studentId}
														value={student.studentId}
														onSelect={() => handleStudentSelection(student.studentId)}
													> 
														{student.label}
														<CheckIcon
															className={`ml-auto h-4 w-4 ${selectedStudents.includes(student.studentId) ? 'opacity-100' : 'opacity-0'}`}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<DialogFooter>
							<Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
							<Button variant="destructive" type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default People;
