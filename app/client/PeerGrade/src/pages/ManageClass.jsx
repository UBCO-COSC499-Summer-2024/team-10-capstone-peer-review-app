import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import AddClassModal from "@/components/manageClass/AddClassDialog";
import DeleteClassDialog from "@/components/manageClass/DeleteClassDialog";
import EditClassDialog from "@/components/manageClass/EditClassModal";
import ManageEnrollmentsModal from "@/components/manageClass/ManageEnrollmentsModal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";

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
			setSelectedClass(null);
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

	const truncateDescription = (description, maxLength = 50) => {
		if (description.length <= maxLength) return description;
		return description.slice(0, maxLength) + "...";
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

			<div className="flex justify-center">
				{classes.length === 0 ? (
					<div className="text-sm text-gray-500 text-center mt-2 w-full">
						No classes were found.
					</div>
				) : (
					<Table className="border-collapse w-full">
						<TableHeader>
							<TableRow className="bg-gray-100">
								<TableHead className="border px-4 py-2">Class Name</TableHead>
								<TableHead className="border px-4 py-2">Description</TableHead>
								<TableHead className="border px-4 py-2">Start Date</TableHead>
								<TableHead className="border px-4 py-2">End Date</TableHead>
								<TableHead className="border px-4 py-2">Term</TableHead>
								<TableHead className="border px-4 py-2">Class Size</TableHead>
								<TableHead className="border px-4 py-2">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{classes.map((classItem, index) => (
								<TableRow
									key={classItem.classId}
									className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
								>
									<TableCell className="border px-4 py-2">
										{classItem.classname}
									</TableCell>
									<TableCell className="border px-4 py-2">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger className="text-left">
													{truncateDescription(classItem.description)}
												</TooltipTrigger>
												<TooltipContent className=" max-w-64 max-h-40 overflow-y-auto bg-white p-4 rounded shadow-lg">
													<p>{classItem.description}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</TableCell>
									<TableCell className="border px-4 py-2">
										{format(new Date(classItem.startDate), "PP")}
									</TableCell>
									<TableCell className="border px-4 py-2">
										{format(new Date(classItem.endDate), "PP")}
									</TableCell>
									<TableCell className="border px-4 py-2">
										{classItem.term || "N/A"}
									</TableCell>
									<TableCell className="border px-4 py-2">
										{classItem.classSize}
									</TableCell>
									<TableCell className="border px-4 py-2">
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
			</div>

			<AddClassModal
				show={addModalOpen}
				onClose={() => setAddModalOpen(false)}
			/>
			{selectedClass && (
				<DeleteClassDialog
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
					selectedClass={selectedClass}
					handleDeleteClass={handleDeleteClass}
				/>
			)}
			{selectedClass && (
				<EditClassDialog
					open={editModalOpen}
					onOpenChange={setEditModalOpen}
					classItem={selectedClass}
				/>
			)}
			{selectedClass && (
				<ManageEnrollmentsModal
					open={enrollModalOpen}
					onOpenChange={setEnrollModalOpen}
					classItem={selectedClass}
				/>
			)}
		</div>
	);
};

export default ManageClass;
