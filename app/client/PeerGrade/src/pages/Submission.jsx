import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { File, FileUp } from "lucide-react";
import { getAssignmentInClass } from '@/api/assignmentApi';
import { getRubricById } from '@/api/rubricApi';
import { useUser } from "@/contexts/contextHooks/useUser";

const Submission = () => {
    const { classId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [rubrics, setRubrics] = useState([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const assignmentData = await getAssignmentInClass(classId, assignmentId);
                setAssignment(assignmentData.data);

                // Fetch rubrics if linked to the assignment
                if (assignmentData.RubricForAssignment) {
                    console.log("hello");

                    const rubricId = assignmentData.data.rubric[0].rubricId; // Adjust this based on your actual data structure
                    const rubricData = await getRubricById(rubricId);
                    setRubrics(rubricData.data);
                }
            } catch (error) {
                console.error("Error fetching assignment details:", error);
            }
        };

        fetchAssignmentDetails();
    }, [classId, assignmentId]);

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full mb-4">
                <CardHeader className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
                    <CardTitle className="text-xl font-bold">Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {assignment && (
                        <>
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">{assignment.title}</h2>
                                <p className="text-gray-600">{assignment.description}</p>
                                <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                            </div>
                            {rubrics.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold">Rubrics</h3>
                                    <ul className="list-disc pl-4">
                                        {rubrics.map((rubric, index) => (
                                            <li key={index} className="text-gray-600">{rubric.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Button variant="outline" size="lg" onClick={() => setDrawerOpen(true)} className="text-green-600 hover:text-green-800">
                <FileUp className="h-4 w-4 mr-2" />
                Submit Assignment
            </Button>

            <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} position="right">
                <DrawerTrigger asChild>
                    <DrawerContent className="p-4 w-full md:w-1/3 bg-white">
                        <DrawerClose onClick={() => setDrawerOpen(false)} className="absolute top-2 right-2">
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                        <h2 className="text-xl font-bold mb-4">Submit Your Assignment</h2>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="w-full border border-gray-300 p-2 rounded-md"
                        />
                        <Button variant="solid" className="mt-4 w-full">Submit</Button>
                    </DrawerContent>
                </DrawerTrigger>
            </Drawer>
        </div>
    );
};

export default Submission;
