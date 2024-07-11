import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClassCard from "@/components/class/ClassCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { format, parseISO } from "date-fns";

import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/utils/utils";

import { useClass } from "@/contexts/contextHooks/useClass";

const AddClassModal = ({ show, onClose }) => {
	const [classname, setClassname] = useState("");
	const [description, setDescription] = useState("");
	const [term, setTerm] = useState("");
	const [size, setSize] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");

	const { isClassLoading, addClass } = useClass();

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("start date", startDate);
		console.log("end date", endDate);

		if (startDate === "" || endDate === "") {
			setError("Please select start and end dates for the class.");
			return;
		} else if (startDate > endDate) {
			setError("Please select an end date that is after the start date.");
			return;
      // !!! TODO: CHECK FOR THIS IN THE BACK-END TOO.
    } else if (startDate === endDate) {
      setError("Please select an end date that is not the same as the start date.");
      return;
      // !!! TODO: CHECK FOR THIS IN THE BACK-END TOO.
    }

		const newClass = {
			classname,
			description,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			term,
			classSize: parseInt(size, 10)
		};

		const classCreate = async () => {
			addClass(newClass);
			onClose();
		};

		classCreate();
	};

	if (!show) {
		return null;
	}

	return (
		<div className="fixed px-6 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6rounded-lg shadow-lg w-1/2">
				<h2 className="text-xl font-bold mb-4">Add a New Class</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="classname"
							className="block text-sm font-medium text-gray-700"
						>
							Class Name
						</label>
						<input
							type="text"
							id="classname"
							value={classname}
							onChange={(e) => setClassname(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<input
							type="text"
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="term"
							className="block text-sm font-medium text-gray-700"
						>
							Term
						</label>
						<input
							type="text"
							id="term"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="size"
							className="block text-sm font-medium text-gray-700"
						>
							Size
						</label>
						<input
							type="number"
							id="size"
							value={size}
							min="1"
							onChange={(e) => setSize(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="flex flex-col space-y-1 mb-4">
						<label
							htmlFor="startDate"
							className="block text-sm font-medium text-gray-700"
						>
							Start Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[200px] font-normal bg-white flex flex-start",
										!startDate && "text-muted-foreground"
									)}
									id="startDate"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{startDate ? (
										format(startDate, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={startDate}
									onSelect={(currentValue) => setStartDate(currentValue)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<span className="text-sm text-gray-500">
							Select the end date for the class.
						</span>
					</div>
					<div className="flex flex-col space-y-1 mb-4">
						<label
							htmlFor="endDate"
							className="block text-sm font-medium text-gray-700"
						>
							End Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[200px] font-normal bg-white flex flex-start",
										!endDate && "text-muted-foreground"
									)}
									id="startDate"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={endDate}
									onSelect={(currentValue) => setEndDate(currentValue)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<span className="text-sm text-gray-500">
							Select the end date for the class.
						</span>
					</div>

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

					<div className="flex justify-end">
						<Button
							type="button"
							onClick={onClose}
							disabled={isClassLoading}
							className="mr-2"
						>
							Cancel
						</Button>
						<Button type="submit">Add Class</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

const ManageClass = () => {
	const { user, userLoading } = useUser();
	const [modalOpen, setModalOpen] = useState(false);
	const [classAssignments, setClassAssignments] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedClass, setSelectedClass] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

	const { classes, isClassLoading, removeClass } = useClass();

	// TODO Refactor to get all classed from classContext
	useEffect(() => {
		if (
			!userLoading &&
			user &&
			(user.role === "INSTRUCTOR" || user.role === "ADMIN")
		) {
			const fetchAssignments = async (classId) => {
				const assignmentsData = await getAllAssignmentsByClassId(classId);
				console.log(assignmentsData.data);
				if (assignmentsData.status === "Success") {
					return assignmentsData.data;
				}
			};

			const fetchAllAssignments = async () => {
				const assignments = {};
				for (const classItem of classes) {
					assignments[classItem.classId] = await fetchAssignments(
						classItem.classId
					);
				}
				setClassAssignments(assignments);
			};

			fetchAllAssignments();
		}
	}, [user, userLoading]);

	const handleDeleteClass = async () => {
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedClass) {
				removeClass(selectedClass.classId);
				setDialogOpen(false);
			} else {
				console.error(
					"An error occurred while deleting the class.",
					classData.message
				);
			}
		} else {
			setConfirmDelete(true);
		}
	};

	const handleDeleteClick = (classItem) => {
		setSelectedClass(classItem);
		setDialogOpen(true);
	};

	if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
		return <div>You do not have permission to view this page.</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-3xl font-bold mr-3">My Classrooms</h1>
				<Button
					onClick={() => setModalOpen(true)}
					className="flex items-center"
				>
					<Plus className="mr-2" />
					Add a class
				</Button>
			</div>
			{classes.length === 0 && (
				<div className="text-sm text-gray-500 text-center mt-2 w-full">
					No classes were found.
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{classes.map((classItem) => (
					<div key={classItem.classId} className="relative">
						<Link to={`/class/${classItem.classId}`}>
							<ClassCard
								classId={classItem.classId}
								className={classItem.classname}
								instructor={`${user.firstname} ${user.lastname}`}
								numStudents={classItem.classSize}
								numAssignments={
									classAssignments[classItem.classId]?.length || 0
								}
								// numPeerReviews={PeerReview.filter((review) => {
								//   const sub = submission.find((sub) => sub.submission_id === review.submission_id);
								//   return sub && sub.assignment_id === classItem.classId;
								// }).length}
							/>
						</Link>
						<button
							onClick={() => handleDeleteClick(classItem)}
							className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
							data-testid={`delete-class-${classItem.classId}`}
						>
							&times;
						</button>
					</div>
				))}
			</div>
			<AddClassModal show={modalOpen} onClose={() => setModalOpen(false)} />
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent
					className={
						confirmDelete ? "border-red-950 bg-red-500 text-white" : ""
					}
				>
					<DialogHeader>
						<DialogTitle>
							{confirmDelete ? "Confirm" : ""} Delete Class
						</DialogTitle>
					</DialogHeader>
					Are you {confirmDelete ? "really" : ""} sure you want to delete the
					class {selectedClass.classname}?
					<span className="font-extrabold">
						WARNING: THIS WILL DELETE ALL ASSIGNMENTS, SUBMISSIONS, REVIEWS,
						CATEGORIES, AND GROUPS ASSOCIATED WITH THIS CLASS.
					</span>
					<DialogFooter>
						<Button
							onClick={() => setDialogOpen(false)}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteClass}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ManageClass;
