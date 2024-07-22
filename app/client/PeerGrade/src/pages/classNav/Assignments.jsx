import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileCheck } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { getAllAssignmentsByClassId, removeAssignmentFromClass } from '@/api/assignmentApi';
import { useUser } from "@/contexts/contextHooks/useUser";

const Assignments = () => {
    const { classId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const { user } = useUser();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedAssignment, setSelectedAssignment] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await getAllAssignmentsByClassId(classId);
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching assignments:", error);
            }
        };

        fetchAssignments();
    }, [user, classId]);

	const handleDeleteClick = (assignment) => {
		// handles the actual click event to delete an assignment
		setConfirmDelete(false);
		setSelectedAssignment(assignment);
		setDialogOpen(true);
	};

	const handleDeleteAssignment = async () => {
		// handles the deletion of an assignment via the backend
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedAssignment) {
				const assignmentData = await removeAssignmentFromClass(selectedAssignment.assignmentId);
				if (assignmentData.status === "Success") {
					console.log("deleted assignment", assignmentData);
					setDialogOpen(false);
					setAssignments((prevAssignments) =>
						prevAssignments.filter(
							(assignment) => assignment.assignmentId !== selectedAssignment.assignmentId
						)
					);
				} else {
					console.error(
						"An error occurred while deleting the assignment.",
						assignmentData.message
					);
				}
			}
		} else {
			setConfirmDelete(true);
		}
	};

    return (
        <div>
            <Card className="w-full">
                <CardHeader className="flex justify-between items-center bg-muted p-4 rounded-t-lg">
                    <CardTitle className="text-xl font-bold">Class Assignments</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {assignments.map((assignment, index) => (
                        <Alert key={index} className="flex justify-between items-center">
                            <div>
                                <AlertTitle className="text-lg font-semibold">{assignment.title}</AlertTitle>
                                <AlertDescription className="text-sm text-gray-600">
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </AlertDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Link to={`/class/${classId}/assignment/${assignment.assignmentId}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                </Link>
                                {user.role !== 'STUDENT' && (
                                <>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteClick(assignment)}>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                                </>
                                )}
                                {user.role === 'STUDENT' && (
                                <Link to={`/class/${classId}/submit/${assignment.assignmentId}`}>

                                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-800">
                                        <FileCheck className="h-4 w-4 mr-1" />
                                        Submit
                                    </Button>
                                </Link>
                                )}
                            </div>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent
                    className={
                        confirmDelete ? "border-red-950 bg-red-500 text-white" : ""
                    }
                >
                    <DialogHeader>
                        <DialogTitle>
                            {confirmDelete ? "Confirm" : ""} Delete Assignment
                        </DialogTitle>
                    </DialogHeader>
                    Are you {confirmDelete ? "really " : ""}sure you want to delete the assignment {selectedAssignment.title} from this class?
                    <DialogFooter>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            className={confirmDelete ? "shadow-md shadow-red-900" : ""}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAssignment}
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

export default Assignments;
