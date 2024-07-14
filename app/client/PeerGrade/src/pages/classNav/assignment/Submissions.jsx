import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, ChevronDown, History } from "lucide-react";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/utils/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PDFViewer from "@/components/assign/PDFViewer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ReviewDetailsDialog from "./submission/ReviewDetailsDialog";
import ReviewHistoryDialog from "./submission/ReviewHistoryDialog";

const Submissions = () => {
    const { user } = useUser();
    const { assignmentId, classId } = useParams();
    const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [rubrics, setRubrics] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [showReviewHistoryDialog, setShowReviewHistoryDialog] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [submissionsResponse, studentsResponse] = await Promise.all([
                    getSubmissionsForAssignment(assignmentId),
                    getStudentsByClassId(classId)
                ]);

                const submissionsMap = submissionsResponse.data.reduce(
                    (acc, submission) => {
                        if (!acc[submission.submitterId]) {
                            acc[submission.submitterId] = [];
                        }
                        acc[submission.submitterId].push(submission);
                        return acc;
                    },
                    {}
                );

                const studentsWithSubmissionStatus = await Promise.all(studentsResponse.data.map(
                    async (student) => {
                        const submissions = submissionsMap[student.userId] || [];
                        const latestSubmission = submissions[submissions.length - 1];
                        let latestGrade = null;
                        if (latestSubmission) {
                            const reviews = await reviewAPI.getAllReviews(latestSubmission.submissionId);
                            if (reviews.length > 0) {
                                const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                                latestGrade = sortedReviews[0].reviewGrade;
                            }
                        }
                        
                        return {
                            userId: student.userId,
                            name: `${student.firstname} ${student.lastname}`,
                            submissions: submissions,
                            hasSubmitted: !!submissions.length,
                            latestGrade: latestGrade
                        };
                    }
                ));

                setStudentsWithSubmissions(studentsWithSubmissionStatus);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch submissions or student data",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [assignmentId, classId]);

    const handleDownload = (submission) => {
        const link = document.createElement("a");
        link.href = submission.submissionFilePath;
        link.download = `submission_${submission.submissionId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchRubrics = async (assignmentId) => {
        try {
            const rubricData = await getRubricsForAssignment(assignmentId);
            setRubrics(rubricData.data);

            const totalPoints = rubricData.data.reduce((acc, rubric) => {
                return acc + rubric.totalMarks;
            }, 0);
            setTotalPoints(totalPoints);
        } catch (error) {
            console.error("Error fetching rubrics:", error);
        }
    };

    const handleGradeAssignment = async (submission) => {
        setSelectedSubmission(submission);
        await fetchRubrics(assignmentId);
    };

    const handleGradeSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let totalMark = 0;
        const criterionGrades = [];

        rubrics.forEach(rubric => {
            rubric.criteria.forEach(criterion => {
                const grade = parseFloat(formData.get(`grade-${criterion.criterionId}`)) || 0;
                totalMark += grade;
                const comment = formData.get(`comment-${criterion.criterionId}`);
                criterionGrades.push({ criterionId: criterion.criterionId, grade, comment });
            });
        });

        const finalScore = (totalMark / totalPoints) * 100;

        try {
            const review = {
                submissionId: selectedSubmission.submissionId,
                reviewGrade: totalMark,
                reviewerId: user.userId,
                revieweeId: selectedSubmission.submitterId,
                isPeerReview: false,
                isGroup: false,
                criterionGrades: criterionGrades,
            };

            await reviewAPI.createReview(review, criterionGrades);
            toast({
                title: "Success",
                description: "Grade submitted successfully",
                variant: "success"
            });

            // Update the submission's grade in the UI
            setStudentsWithSubmissions(prev => 
                prev.map(student => {
                    if (student.userId === selectedSubmission.submitterId) {
                        const updatedSubmissions = student.submissions.map(sub => 
                            sub.submissionId === selectedSubmission.submissionId 
                                ? { ...sub, finalGrade: finalScore } 
                                : sub
                        );
                        return { ...student, submissions: updatedSubmissions, latestGrade: finalScore };
                    }
                    return student;
                })
            );
            
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit grade",
                variant: "destructive"
            });
        }
    };

    const handleViewReviewDetails = (submissionId) => {
        setSelectedSubmissionId(submissionId);
        setShowReviewDialog(true);
    };

    const handleViewReviewHistory = (submissionId) => {
        setSelectedSubmissionId(submissionId);
        setShowReviewHistoryDialog(true);
    };

    if (loading) {
        return <div>Loading submissions...</div>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {studentsWithSubmissions.map((student, index) => (
                        <AccordionItem value={`item-${index}`} key={student.userId}>
                            <AccordionTrigger
                                className={cn(
                                    student.hasSubmitted ? "bg-green-50" : "bg-red-50",
                                    "hover:bg-opacity-80 px-4"
                                )}
                            >
                                <div className="flex justify-between w-full">
                                    <span>{student.name}</span>
                                    <span>
                                        {student.hasSubmitted ? "Submitted" : "No Submission"}
                                    </span>
                                    <span>
                                        {student.latestGrade !== null ? student.latestGrade.toFixed(2) : "N/A"}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Attempt</TableHead>
                                            <TableHead>Submitted At</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {student.submissions.length > 0 ? (
                                            student.submissions.map((submission, subIndex) => (
                                                <TableRow key={submission.submissionId}>
                                                    <TableCell>Attempt {subIndex + 1}</TableCell>
                                                    <TableCell>
                                                        {new Date(submission.createdAt).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="mr-2"
                                                                    onClick={() =>
                                                                        setSelectedSubmission(submission)
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    View
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl h-[80vh]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Submission View</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex-1 overflow-auto">
                                                                    <PDFViewer
                                                                        url={submission.submissionFilePath}
                                                                        scale="1"
                                                                    />
                                                                </div>
                                                                <Button
                                                                    onClick={() => handleDownload(submission)}
                                                                >
                                                                    <Download className="h-4 w-4 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDownload(submission)}
                                                            className="mr-2"
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download
                                                        </Button>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="mr-2"
                                                                    onClick={() =>
                                                                        handleGradeAssignment(submission)
                                                                    }
                                                                >
                                                                    <ChevronDown className="h-4 w-4 mr-1" />
                                                                    Grade
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl h-[80vh]">
                                                                <DialogHeader>
                                                                    <DialogTitle>Grade Assignment</DialogTitle>
                                                                </DialogHeader>
                                                                <form
                                                                    onSubmit={handleGradeSubmit}
                                                                    className="flex-1 overflow-auto"
                                                                >
                                                                    {rubrics.map((rubric, rubricIndex) => (
                                                                        <Card key={rubricIndex} className="mb-6">
                                                                            <CardHeader>
                                                                                <CardTitle>{rubric.title}</CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent>
                                                                                {rubric.criteria.map(
                                                                                    (criterion, criterionIndex) => {
                                                                                        const totalRatingPoints = criterion.criterionRatings.reduce(
                                                                                            (sum, rating) => sum + rating.points,
                                                                                            0
                                                                                        );
                                                                                        return (
                                                                                            <div
                                                                                                key={criterionIndex}
                                                                                                className="mb-4"
                                                                                            >
                                                                                                <Label className="text-md font-semibold">
                                                                                                    {criterion.title}
                                                                                                </Label>
                                                                                                <div className="ml-4">
                                                                                                    {criterion.criterionRatings.map(
                                                                                                        (rating, ratingIndex) => (
                                                                                                            <div
                                                                                                                key={ratingIndex}
                                                                                                                className="flex justify-between"
                                                                                                            >
                                                                                                                <span className="text-sm">
                                                                                                                    {rating.description}
                                                                                                                </span>
                                                                                                                <span className="text-sm rounded-full p-2 border border-slate-800 w-6 h-6 flex items-center justify-center">
                                                                                                                    {rating.points}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center justify-between mt-2">
                                                                                                    <Input
                                                                                                        type="number"
                                                                                                        min="0"
                                                                                                        max={totalRatingPoints}
                                                                                                        name={`grade-${criterion.criterionId}`}
                                                                                                        defaultValue="0"
                                                                                                        className="w-[80px] mr-2"
                                                                                                    />
                                                                                                    <span className="text-sm ml-2">
                                                                                                        / {totalRatingPoints}
                                                                                                    </span>
                                                                                                </div>
                                                                                                <Textarea
                                                                                                    name={`comment-${criterion.criterionId}`}
                                                                                                    placeholder="Add a comment for this criterion"
                                                                                                    className="mt-2"
                                                                                                />
                                                                                            </div>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </CardContent>
                                                                        </Card>
                                                                    ))}
                                                                    <Button type="submit" className="mt-4">
                                                                        Submit Grades
                                                                    </Button>
                                                                </form>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewReviewDetails(submission.submissionId)}
                                                            className="mr-2"
                                                        >
                                                            View Grades
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewReviewHistory(submission.submissionId)}
                                                        >
                                                            History
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">
                                                    No submissions
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
            <ReviewDetailsDialog
                submissionId={selectedSubmissionId}
                open={showReviewDialog}
                onClose={() => setShowReviewDialog(false)}
            />
            <ReviewHistoryDialog
                submissionId={selectedSubmissionId}
                open={showReviewHistoryDialog}
                onClose={() => setShowReviewHistoryDialog(false)}
            />
        </Card>
    );
};

export default Submissions;