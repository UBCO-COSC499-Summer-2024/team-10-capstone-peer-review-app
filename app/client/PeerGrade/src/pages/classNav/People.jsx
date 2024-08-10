// This component is used to display the students for a class
// It shows the students/Instructor with their names and avatars
// It also allows the user to delete students if they are instructors

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AddStudentsByCSVDialog from "@/components/class/addStudentsByCSVDialog";
import InfoButton from '@/components/global/InfoButton';
import {
	MinusCircle,
	Plus,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	FileUp
} from "lucide-react";

import { useUser } from "@/contexts/contextHooks/useUser";

import {
	getInstructorByClassId,
	getStudentsByClassId,
	removeStudentFromClass,
	addStudentToClass
} from "@/api/classApi";
import { getUsersByRole, getGroups } from "@/api/userApi";
import DeleteStudentDialog from "@/components/manageClass/DeleteStudentDialog";

const People = ({ classId }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const { user, userLoading } = useUser();
	const [students, setStudents] = useState([]);
	const [instructor, setInstructor] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [addByCSVOpen, setAddByCSVOpen] = useState(false);
	const [studentOptions, setStudentOptions] = useState([]);
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [myGroups, setMyGroups] = useState([]);
	const [open, setOpen] = useState(false);

	// Fetch instructor on component mount
	useEffect(() => {
		const fetchInstructor = async () => {
			const instructor = await getInstructorByClassId(classId);
			console.log("instructor", instructor);
			if (instructor.status === "Success") {
				setInstructor(instructor.data);
			}
		};
		const fetchMyGroups = async () => {
			try {
				const groups = await getGroups(user.userId);
				console.log("my groups", groups.data);
				setMyGroups(
					Array.isArray(groups.data)
						? groups.data.filter((group) => group.classId === classId)
						: []
				);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch user's groups",
					variant: "destructive"
				});
			}
		};

		fetchMyGroups();
		fetchInstructor();
	}, [user, userLoading, classId]);

	// Fetch students on component mount
	useEffect(() => {
		const fetchStudents = async () => {
			const students = await getStudentsByClassId(classId);
			console.log("students", students);
			if (students.status === "Success") {
				setStudents(students.data);
			}
		};

		fetchStudents();
	}, [user, userLoading, classId]);

	// Refresh students on component mount
	const refreshStudents = async () => {
		const students = await getStudentsByClassId(classId);
		if (students.status === "Success") {
			setStudents(students.data);
		}
	};

	// Fetch students on component mount
	useEffect(() => {
		if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
			const fetchAllStudents = async () => {
				try {
					const response = await getUsersByRole("STUDENT");
					if (response.status === "Success") {
						const currentStudentIds = students.map((student) => student.userId);
						const transformedStudents = response.data
							.filter((student) => !currentStudentIds.includes(student.userId))
							.map((student) => ({
								studentId: student.userId,
								label: student.firstname + " " + student.lastname
							}));
						setStudentOptions(transformedStudents);
					} else {
						console.error(
							"An error occurred while getting students.",
							response.message
						);
					}
				} catch (error) {
					console.error("An error occurred while fetching students.", error);
				}
			};

			fetchAllStudents();
		}
	}, [user, userLoading, students]);

	// Handle the student selection
	const handleStudentSelection = (studentId) => {
		setSelectedStudents((prevSelected) => {
			if (prevSelected.includes(studentId)) {
				return prevSelected.filter((id) => id !== studentId);
			} else {
				return [...prevSelected, studentId];
			}
		});
	};

	// Handle the delete student click event
	const handleDeleteClick = (selectedStudent) => {
		setConfirmDelete(false);
		setSelectedStudent(selectedStudent);
		console.log(selectedStudents);
		setDialogOpen(true);
	};

	// Handle the add student click event
	const handleAddClick = () => {
		setSelectedStudents([]);
		setAddDialogOpen(true);
	};

	// Filter students by search term
	const filteredStudents = students.filter((student) =>
		`${student.firstname} ${student.lastname}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const filteredInstructor = `${instructor.firstname} ${instructor.lastname}`
		.toLowerCase()
		.includes(searchTerm.toLowerCase());

	// Handle the delete student confirmation
	const handleDeleteStudent = async () => {
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedStudent) {
				const userData = await removeStudentFromClass(
					classId,
					selectedStudent.userId
				);
				if (userData.status === "Success") {
					console.log("deleted user", userData);
					setDialogOpen(false);
					setStudents((prevStudents) =>
						prevStudents.filter(
							(student) => student.userId !== selectedStudent.userId
						)
					);
				} else {
					console.log(userData);
					console.error(
						"An error occurred while deleting the user.",
						userData.message
					);
				}
			}
		} else {
			setConfirmDelete(true);
		}
	};

	// Handle the add student form submission
	const handleSubmit = async (e) => {
		// handles the submission of the form to add students to the class
		e.preventDefault();
		console.log("Selected Students:", selectedStudents);

		if (selectedStudents.length > 0) {
			for (const student of selectedStudents) {
				const addStudent = await addStudentToClass(classId, student);
				if (addStudent.status === "Success") {
					console.log("added student", addStudent);
					setStudents((prevStudents) => [...prevStudents, addStudent.data]);
				} else {
					console.error(
						"An error occurred while adding the student.",
						addStudent.message
					);
				}
			}
		} else {
			console.error("No students selected.");
		}

		setAddDialogOpen(false);
	};

	// Get the initials of a student
	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	// Information content for the people help guide (infoButton click render)
	const peopleInfoContent = {
		title: "About Class Participants",
		description: (
		  <>
			<p>This page shows all participants in the class:</p>
			<ul className="list-disc list-inside mt-2">
			  <li>View the class instructor</li>
			  <li>See a list of all enrolled students</li>
			  <li>Search for specific participants</li>
			  {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
				<>
				  <li>Add new students to the class</li>
				  <li>Remove students from the class</li>
				  <li>Import students using a CSV file</li>
				</>
			  )}
			</ul>
			{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
			  <p className="mt-2">Use the '+' button to add individual students or the file upload button to import multiple students at once.</p>
			)}
		  </>
		)
	  };

	return (
		<div className="w-full p-6 bg-muted rounded-lg">
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
					<Card key={instructor.userId} className="flex items-center p-4 mb-2">
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-3 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={instructor.avatarUrl}
									alt={`${instructor.firstname} ${instructor.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(instructor.firstname, instructor.lastname)}
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
					{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
						<div>
							<Button
								variant="ghost"
								className="bg-gray-100 h-7 w-7 mr-2"
								onClick={() => setAddByCSVOpen(true)}
								data-testid="add-student-by-email-button"
							>
								<FileUp className="w-5 h-5" />
							</Button>
							<Button
								variant="ghost"
								className="bg-gray-100 h-7 w-7"
								onClick={handleAddClick}
								data-testid="add-student-button"
							>
								<Plus className="w-5 h-5" />
							</Button>
						</div>
					)}
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
							{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
								<Button
									variant="outline"
									className="bg-gray-100"
									onClick={() => handleDeleteClick(student)}
									data-testid={`remove-student-button-${student.userId}`}
								>
									<MinusCircle className="w-5 h-5 mr-2" /> Delete
								</Button>
							)}
						</div>
					</Card>
				))}
			</div>
			<DeleteStudentDialog
				dialogOpen={dialogOpen}
				setDialogOpen={setDialogOpen}
				confirmDelete={confirmDelete}
				selectedStudent={selectedStudent}
				handleDeleteStudent={handleDeleteStudent}
			/>
			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Student</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label
								htmlFor="selectStudents"
								className="block text-sm font-medium text-gray-700 hidden"
							>
								Select students to add to the class:
							</label>
							{/* Label is only present for screen readers, can be removed. */}
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										id="selectStudents"
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={`w-full justify-between bg-white mt-1 border`}
										data-testid="add-student-dropdown"
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
										<CommandInput placeholder="Search students..." />
										<CommandList>
											<CommandEmpty>No students found.</CommandEmpty>
											<CommandGroup>
												{studentOptions.map((student) => (
													<CommandItem
														key={student.studentId}
														value={student.label}
														onSelect={() =>
															handleStudentSelection(student.studentId)
														}
													>
														{student.label}
														<CheckIcon
															className={`ml-auto h-4 w-4 ${selectedStudents.includes(student.studentId) ? "opacity-100" : "opacity-0"}`}
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
							<Button onClick={() => setAddDialogOpen(false)} type="button">
								Cancel
							</Button>
							<Button type="submit">
								Submit
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<AddStudentsByCSVDialog
				classId={classId}
				open={addByCSVOpen}
				onOpenChange={setAddByCSVOpen}
				onStudentsAdded={refreshStudents}
			/>
			<InfoButton content={peopleInfoContent} />

		</div>
	);
};

export default People;
