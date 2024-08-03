import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileCheck } from "lucide-react";

import { getAllAssignmentsByClassId, removeAssignmentFromClass } from '@/api/assignmentApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import DeleteAssignmentDialog from '@/components/manageClass/DeleteAssignmentDialog';
import InfoButton from '@/components/global/InfoButton';

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
        if (confirmDelete) {
            setConfirmDelete(false);
            if (selectedAssignment) {
                try {
                    const response = await removeAssignmentFromClass(selectedAssignment.assignmentId);
                    if (response.status === "Success") {
                        console.log("deleted assignment", response.data);
                        setDialogOpen(false);
                        setAssignments((prevAssignments) =>
                            prevAssignments.filter(
                                (assignment) => assignment.assignmentId !== selectedAssignment.assignmentId
                            )
                        );
                    } else {
                        console.error(
                            "An error occurred while deleting the assignment.",
                            response.message
                        );
                    }
                } catch (error) {
                    console.error("Error deleting assignment:", error.response?.data || error.message);
                }
            }
        } else {
            setConfirmDelete(true);
        }
    };


    const assignmentsInfoContent = {
        title: "About Assignments",
        description: (
          <>
            <p>This page shows all assignments for the class.</p>
            {user.role === 'STUDENT' ? (
              <>
                <p className="mt-2">As a student, you can:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>View assignment details</li>
                  <li>Submit your work for assignments</li>
                  <li>Track assignment due dates</li>
                </ul>
                <p className="mt-2">Use the 'View' button to see assignment details and the 'Submit' button to turn in your work.</p>
              </>
            ) : (
              <>
                <p className="mt-2">As an instructor, you can:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>View all assignments for the class</li>
                  <li>Create new assignments</li>
                  <li>Edit existing assignments</li>
                  <li>Delete assignments</li>
                </ul>
                <p className="mt-2">Use the 'View' button to see or edit assignment details, and the 'Delete' button to remove an assignment.</p>
              </>
            )}
            <p className="mt-2">All assignments are listed with their titles and due dates for easy reference.</p>
          </>
        )
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
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteClick(assignment)} data-testid={`delete-assignment-${assignment.assignmentId}`}>
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                                </>
                                )}
                            </div>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
            <DeleteAssignmentDialog 
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                confirmDelete={confirmDelete}
                selectedAssignment={selectedAssignment}
                handleDeleteAssignment={handleDeleteAssignment}
            />
            <InfoButton content={assignmentsInfoContent} />
        </div>
    );
};

export default Assignments;
