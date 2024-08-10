// The main function of this component is to view and submit an assignment

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getAssignmentInClass } from '@/api/assignmentApi';
import { getRubricsForAssignment } from '@/api/rubricApi';
import { createSubmission } from '@/api/submitApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import DataTable from '@/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';

const Submission = ({ refresh, switchToViewOnSubmit }) => {
    const { classId, assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [rubric, setRubric] = useState(null);
    const [file, setFile] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState('');
    const { user } = useUser();
    const [selectedFileName, setSelectedFileName] = useState('');
    const [textSubmission, setTextSubmission] = useState('');

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const assignmentData = await getAssignmentInClass(classId, assignmentId);
                setAssignment(assignmentData.data);

                const rubricData = await getRubricsForAssignment(assignmentData.data.assignmentId);
                setRubric(rubricData.data);

                if (!rubricData.data) {
                    toast({ title: "No rubric assigned", description: "No rubric found for this assignment", variant: "warning" });
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

    const handleTextChange = (event) => {
        setTextSubmission(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            console.log("uhoh");
            toast({ title: "Error", description: "Please select a file to upload", variant: "destructive" });
            return;
        }

        try {
            const result = await createSubmission(user.userId, assignment.assignmentId, file);

            setFile(null);
            event.target.reset();

            const timestamp = new Date().toLocaleString();
            const fileName = file.name;
            setSubmissionMessage(`${fileName} successfully submitted at ${timestamp}`);
            switchToViewOnSubmit();
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

    const handleTextSubmit = async (event) => {
        event.preventDefault();
        if (!textSubmission) {
            toast({ title: "Error", description: "Please enter your submission text", variant: "destructive" });
            return;
        }

        try {
            const textFile = new Blob([textSubmission], { type: 'text/plain' });
            const textFileObj = new File([textFile], `${assignment.title}-submission.txt`, { type: 'text/plain' });

            const result = await createSubmission(user.userId, assignment.assignmentId, textFileObj);

            setTextSubmission('');
            event.target.reset();

            const timestamp = new Date().toLocaleString();
            setSubmissionMessage(`Text submission successfully submitted at ${timestamp}`);
            switchToViewOnSubmit();
            refresh();
        } catch (error) {
            console.error("Text submission error:", error);
            toast({ 
                title: "Error", 
                description: error.message || "Failed to submit text. Please try again.", 
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
                <div className="flex gap-2 w-full items-center justify-center flex-wrap">
                    {cell.getValue().map((rating, idx) => (
                        <li key={idx} className='flex bg-gray-200 rounded-lg p-2 justify-center items-center w-auto'>
                                <span>{rating.description}</span>
                                <span className='font-bold border border-black rounded-full ml-2 p-2 h-6 flex justify-center items-center'>{rating.points} pts</span>
                        </li>
                    ))}
                </div>
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
                <CardContent className="p-4 space-y-4">
                    {assignment && (
                        <>
                            <Tabs defaultValue="file-upload" className="space-y-4">
                                <TabsList className="bg-muted">
                                    <TabsTrigger value="file-upload">File Upload</TabsTrigger>
                                    <TabsTrigger value="text-submission">Text Submission</TabsTrigger>
                                </TabsList>
                                <TabsContent value="file-upload">
                                    <div className="p-4 w-full bg-white border border-gray-300 rounded-md">
                                        <h2 className="text-xl font-bold">Submit Your Assignment</h2>
                                        {assignment.allowedFileTypes.length > 0 && <span className='text-gray-500 italic'>Allowed file types are: {assignment.allowedFileTypes.join(', ')}</span>}
                                        <form onSubmit={handleSubmit}>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="w-full border border-gray-300 p-2 mt-4 rounded-md"
                                                data-testid="file-input"
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
                                </TabsContent>
                                <TabsContent value="text-submission">
                                    <div className="p-4 w-full bg-white border border-gray-300 rounded-md">
                                        <h2 className="text-xl font-bold mb-4">Submit Text</h2>
                                        <form onSubmit={handleTextSubmit}>
                                            <textarea
                                                value={textSubmission}
                                                onChange={handleTextChange}
                                                className="w-full border border-gray-300 p-2 rounded-md"
                                                rows="5"
                                                placeholder="Write your submission here..."
                                                data-testid="text-input"
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
                                </TabsContent>
                            </Tabs>
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
