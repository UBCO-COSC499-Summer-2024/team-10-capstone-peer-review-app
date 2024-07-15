// components/ClassCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassCard = ({ classItem, onEdit, onDelete }) => {
	const navigate = useNavigate();

	return (
		<Card
			className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300"
			onClick={() => navigate(`/manageClass/${classItem.classId}`)}
		>
			<CardHeader>
				<CardTitle>{classItem.classname}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-500 mb-4">{classItem.description}</p>
				<div className="flex justify-between items-center">
					<div className="flex space-x-4">
						<div className="flex items-center">
							<Users className="w-4 h-4 mr-1" />
							<span>{classItem.userCount} students</span>
						</div>
						<div className="flex items-center">
							<FileText className="w-4 h-4 mr-1" />
							<span>{classItem.assignmentCount} assignments</span>
						</div>
					</div>
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onEdit(classItem);
							}}
						>
							<Edit className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onDelete(classItem);
							}}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ClassCard;
