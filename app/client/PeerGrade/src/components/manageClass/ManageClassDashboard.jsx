// ClassDashboard.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClass } from "@/contexts/contextHooks/useClass";
import EditClassDialog from "@/components/manageClass/EditClassModal";
import ManageEnrollmentsModal from "@/components/manageClass/ManageEnrollmentsModal";
import { Users, FileText, Edit } from "lucide-react";

const ManageClassDashboard = () => {
	const { classId } = useParams();
	const { classes, updateClasses } = useClass();
	const [classData, setClassData] = useState(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [enrollModalOpen, setEnrollModalOpen] = useState(false);

	useEffect(() => {
		const currentClass = classes.find((c) => c.classId === classId);
		setClassData(currentClass);
	}, [classId, classes]);

	if (!classData) return <div>Loading...</div>;

	return (
		<div className="max-w-7xl mx-auto px-6">
			<h1 className="text-3xl font-bold mb-6">{classData.classname}</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Class Information</h2>
					<p>
						<strong>Description:</strong> {classData.description}
					</p>
					<p>
						<strong>Term:</strong> {classData.term}
					</p>
					<p>
						<strong>Start Date:</strong>{" "}
						{new Date(classData.startDate).toLocaleDateString()}
					</p>
					<p>
						<strong>End Date:</strong>{" "}
						{new Date(classData.endDate).toLocaleDateString()}
					</p>
					<Button className="mt-4" onClick={() => setEditModalOpen(true)}>
						<Edit className="w-4 h-4 mr-2" />
						Edit Class
					</Button>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Students</h2>
					<div className="flex items-center mb-2">
						<Users className="w-4 h-4 mr-2" />
						<span>{classData.userCount} enrolled</span>
					</div>
					<Button onClick={() => setEnrollModalOpen(true)}>
						Manage Enrollments
					</Button>
				</div>
				<div className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-2">Assignments</h2>
					<div className="flex items-center mb-2">
						<FileText className="w-4 h-4 mr-2" />
						<span>{classData.assignmentCount} assignments</span>
					</div>
					<Button>Manage Assignments</Button>
				</div>
			</div>

			<EditClassDialog
				open={editModalOpen}
				onOpenChange={setEditModalOpen}
				classItem={classData}
			/>
			<ManageEnrollmentsModal
				open={enrollModalOpen}
				onOpenChange={setEnrollModalOpen}
				classItem={classData}
			/>
		</div>
	);
};

export default ManageClassDashboard;
