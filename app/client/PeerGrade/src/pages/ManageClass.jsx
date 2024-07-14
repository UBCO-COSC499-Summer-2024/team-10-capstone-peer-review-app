import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import AddClassModal from "@/components/manageClass/AddClassDialog";
import DeleteClassDialog from "@/components/maangeClass/DeleteClassDialog";
import EditClassModal from "@/components/manageClass/EditClassModal";
import ManageEnrollmentsModal from "@/components/manageClass/ManageEnrollmentsModal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

const ManageClass = () => {
	const { user } = useUser();
	const { classes, removeClass } = useClass();
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [enrollModalOpen, setEnrollModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedClass, setSelectedClass] = useState(null);

	if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
		return <div>You do not have permission to view this page.</div>;
	}

	const handleDeleteClick = (classItem) => {
		setSelectedClass(classItem);
		setDeleteDialogOpen(true);
	};

	const handleDeleteClass = async () => {
		if (selectedClass) {
			await removeClass(selectedClass.classId);
			setDeleteDialogOpen(false);
		}
	};

	const handleEditClick = (classItem) => {
		setSelectedClass(classItem);
		setEditModalOpen(true);
	};

	const handleEnrollmentClick = (classItem) => {
		setSelectedClass(classItem);
		setEnrollModalOpen(true);
	};

	return (
		<div className="max-w-7xl mx-auto px-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Manage Classes</h1>
				<Button
					onClick={() => setAddModalOpen(true)}
					className="flex items-center"
				>
					<Plus className="mr-2 w-5 h-5" />
					Add a class
				</Button>
			</div>

			{classes.length === 0 ? (
				<div className="text-sm text-gray-500 text-center mt-2 w-full">
					No classes were found.
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Class Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Students</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{classes.map((classItem) => (
							<TableRow key={classItem.classId}>
								<TableCell>{classItem.classname}</TableCell>
								<TableCell>{classItem.description}</TableCell>
								<TableCell>{classItem.classSize}</TableCell>
								<TableCell>
									<div className="flex space-x-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEditClick(classItem)}
										>
											<Edit className="w-4 h-4 mr-1" />
											Edit
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEnrollmentClick(classItem)}
										>
											<Users className="w-4 h-4 mr-1" />
											Enrollments
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteClick(classItem)}
										>
											<Trash2 className="w-4 h-4 mr-1" />
											Delete
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<AddClassModal
				show={addModalOpen}
				onClose={() => setAddModalOpen(false)}
			/>
			<DeleteClassDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				selectedClass={selectedClass}
				handleDeleteClass={handleDeleteClass}
			/>
			<EditClassModal
				open={editModalOpen}
				onOpenChange={setEditModalOpen}
				classItem={selectedClass}
			/>
			<ManageEnrollmentsModal
				open={enrollModalOpen}
				onOpenChange={setEnrollModalOpen}
				classItem={selectedClass}
			/>
		</div>
	);
};

export default ManageClass;
