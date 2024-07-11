import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileCheck } from "lucide-react";
import { getAllAssignmentsByClassId } from '@/api/assignmentApi';
import { useUser } from "@/contexts/contextHooks/useUser";

const Files = () => {
    const { classId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const { user } = useUser(); // Assume user has a role property

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
    }, [classId]);

    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
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
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
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
    );
};

export default Files;
