import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, CheckCircle } from "lucide-react";
import { getAssignmentInClass } from '@/api/assignmentApi';
import { getRubricsForAssignment } from '@/api/rubricApi';
import { createSubmission } from '@/api/submitApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import DataTable from '@/components/ui/data-table';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast } from '@/components/ui/use-toast';

const Submission = ({refresh}) => {
    const { classId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [rubric, setRubric] = useState(null);
    const [file, setFile] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const { user } = useUser();
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const assignmentData = await getAssignmentInClass(classId, assignmentId);
                setAssignment(assignmentData.data);

                console.log("assign", assignmentData.data.assignmentId);
                
                const rubricData = await getRubricsForAssignment(assignmentData.data.assignmentId);
                setRubric(rubricData.data);
                console.log("rubric", rubricData.data);

                if (!rubricData.data) {
                    toast({ title: "No rubric Assigned", description: "No rubric found for this assignment", variant: "warning" });
                    console.log("No rubric found for this assignment");
                }
            } catch (error) {
                console.error("Error fetching assignment details:", error);
            }
        };

        fetchAssignmentDetails();
    }, [classId, assignmentId]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        console.log("fileExtension", assignment);
        if (!assignment.allowedFileTypes.includes(fileExtension)) {
          toast({
            title: "Invalid file type",
            description: `Please select a file with one of the following extensions: ${assignment.allowedFileTypes.join(', ')}`,
            variant: "destructive",
          });
          return;
        }
        
        setFile(selectedFile);
        setSelectedFileName(selectedFile.name);
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            toast({ title: "Error", description: "Please select a file to upload", variant: "destructive" });
            return;
        }
    
        try {
            const result = await createSubmission(user.userId, assignment.assignmentId, file);

            // Clear the file input
            setFile(null);
            event.target.reset();

            // Create the success message with timestamp
            const timestamp = new Date().toLocaleString();
            const fileName = file.name;
            const fileType = file.type.split('/').pop();
            setSubmissionMessage(`${fileName} successfully submitted at ${timestamp} `);
            refresh();
        } catch (error) {
            console.error("Submission error:", error);
            toast({ 
                title: "Error", 
                description: error.message || "Failed to submit assignment. Please try again.", 
                variant: "destructive" 
            });
        }
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Criterion Title"
        },
        {
            accessorKey: "criterionRatings",
            header: "Ratings",
            cell: ({ cell }) => (
                <ul className="list-disc pl-4">
                    {cell.getValue().map((rating, idx) => (
                        <li key={idx} className='flex mb-5 bg-gray-200 rounded-lg p-2 justify-between items-start '>
                                <span>{rating.description}</span>
                                <span className='font-bold border border-black rounded-full p-1 w-6 h-6 flex justify-center items-center'>{rating.points}</span>
                        </li>
                    ))}
                </ul>
            )
        },
        {
            accessorKey: "maxMark",
            header: "Max Marks"
        }
    ];

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
                            <Accordion type="single" collapsible className="bg-gray-100 rounded-lg px-6">
                                <AccordionItem value="submit-assignment">
                                    <AccordionTrigger className="text-gray-600 hover:text-gray-800 flex items-center">
                                        <div className='flex justify-between items-center w-full mr-3'>
                                        <FileUp className="h-4 w-4 mr-2" />
                                        <span>Submit Assignment</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="p-4 w-full bg-white border border-gray-300 rounded-md">
                                            <h2 className="text-xl font-bold mb-4">Submit Your Assignment</h2>
                                            <form onSubmit={handleSubmit}>
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                    className="w-full border border-gray-300 p-2 rounded-md"
                                                />
                                                <Button type="submit" variant="default" className="mt-4 w-full">Submit</Button>
                                            </form>
                                            {submissionMessage && (
                                                <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded-md flex items-center">
                                                    <CheckCircle className="text-green-600 mr-2" />
                                                    <span>{submissionMessage}</span>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            {rubric && (
                                <div className="mb-4 rounded-lg">
                                    <h3 className="text-lg font-bold mb-3 text-center">Rubric</h3>
                                    <div className="mb-4">
                                        <h4 className="text-md font-semibold text-center">{rubric.title}</h4>
                                        {rubric.description && (
                                            <p className="text-sm text-center mb-3">{rubric.description}</p>
                                        )}
                                        <DataTable
                                            title="Criterion"
                                            data={rubric.criteria}
                                            columns={columns}
                                            pageSize={5}
                                            className="border border-gray-300 bg-gray-100"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Submission;