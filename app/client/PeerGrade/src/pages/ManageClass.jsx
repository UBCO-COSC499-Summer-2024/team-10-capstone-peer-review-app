import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClassCard from "@/components/class/ClassCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useUser } from "@/contexts/contextHooks/useUser";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { format, parseISO } from "date-fns";
import { cn } from "@/utils/utils";

import { useClass } from "@/contexts/contextHooks/useClass";
import AddClassModal from "@/components/class/AddClassDialog";
import DeleteClassDialog from "@/components/class/DeleteClassDialog";

const ManageClass = () => {
	const { user, userLoading } = useUser();
	const [modalOpen, setModalOpen] = useState(false);
	const [classAssignments, setClassAssignments] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedClass, setSelectedClass] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

	const { classes, isClassLoading, removeClass } = useClass();

	// TODO Refactor to get all classes from classContext
	useEffect(() => {
		if (
			!userLoading &&
			user &&
			(user.role === "INSTRUCTOR" || user.role === "ADMIN")
		) {
			console.log(classes);
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
			<DeleteClassDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                confirmDelete={confirmDelete}
                selectedClass={selectedClass}
                handleDeleteClass={handleDeleteClass}
            />
		</div>
	);
};

export default ManageClass;
