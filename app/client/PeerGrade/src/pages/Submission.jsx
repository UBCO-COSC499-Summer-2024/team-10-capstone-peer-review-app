import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { FileUp } from "lucide-react";
import { getAssignmentInClass } from '@/api/assignmentApi';
import { getRubricsForAssignment } from '@/api/rubricApi'; // Ensure this function is correctly defined
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

                console.log("assign", assignmentData.data.assignmentId);
                
                const rubricData = await getRubricsForAssignment(assignmentData.data.assignmentId);
                setRubrics(rubricData.data);
                console.log("rubric", rubricData.data);

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
                                            <li key={index} className="text-gray-600">
                                                {rubric.title}
                                                {rubric.description && (
                                                    <p className="text-sm">{rubric.description}</p>
                                                )}
                                                <ul className="list-disc pl-4">
                                                    {rubric.criteria.map((criterion, idx) => (
                                                        <li key={idx} className="text-gray-600">
                                                            {criterion.title} - Max Marks: {criterion.maxMark}
                                                            <ul className="list-disc pl-4">
                                                                {criterion.criterionRatings.map((rating, id) => (
                                                                    <li key={id} className="text-gray-600">
                                                                        {rating.description}: {rating.points} points
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
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
