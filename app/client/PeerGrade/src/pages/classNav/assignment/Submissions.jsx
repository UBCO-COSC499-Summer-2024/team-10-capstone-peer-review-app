import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {  Download } from "lucide-react";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/utils/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ReviewDetailsDialog from "./submission/ReviewDetailsDialog";
import ViewSubmissionDialog from "./submission/ViewSubmissionDialog";
import GradeSubmissionDialog from "./submission/GradeSubmissionDialog";

const Submissions = () => {
    const { user } = useUser();
    const { assignmentId, classId } = useParams();
    const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [rubrics, setRubrics] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);    
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
            console.log('rubricData', rubricData);
            setRubrics(rubricData.data);

            const totalPoints = rubricData.data.reduce((acc, rubric) => {
                return acc + rubric.totalMarks;
            }, 0);
            setTotalPoints(totalPoints);
        } catch (error) {
            console.error("Error fetching rubrics:", error);
        }
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
            // Check if a review already exists for this submission
            console.log('selectedSubmission', selectedSubmission);
            const existingReviews = await reviewAPI.getAllReviews(selectedSubmission.submissionId);
            console.log('existingReviews', existingReviews);
            const existingReview = existingReviews.data.find(review => review.reviewerId === user.userId);
    
            let response;
            if (existingReview) {
            
            const review = {
              submissionId: selectedSubmission.submissionId,
              reviewGrade: totalMark,
              reviewerId: user.userId,
              revieweeId: selectedSubmission.submitterId,
              updatedAt: new Date(),
              isPeerReview: false,
              isGroup: false,
              criterionGrades: criterionGrades,
            };
              // Update existing review
              console.log('existingReview', existingReview);  
              console.log('review', review);
              response = await reviewAPI.updateReview(existingReview.data.reviewId, review);
              toast({
                  title: "Success",
                  description: "Existing review updated successfully",
                  variant: "success"
              });
          } else {
              // Create new review
              const review = {
                  submissionId: selectedSubmission.submissionId,
                  reviewGrade: totalMark,
                  reviewerId: user.userId,
                  revieweeId: selectedSubmission.submitterId,
                  isPeerReview: false,
                  isGroup: false,
                  criterionGrades: criterionGrades,
              };
              response = await reviewAPI.createReview(review, criterionGrades);
              toast({
                  title: "Success",
                  description: "New review submitted successfully",
                  variant: "success"
              });
          }
  
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
  
          // Close the grade view dialog
          setSelectedSubmission(null);
          
      } catch (error) {
          console.error("Error submitting/updating grade:", error);
          toast({
              title: "Error",
              description: "Failed to submit/update grade",
              variant: "destructive"
          });
      }
  };

      const handleViewSubmission = (submission) => {
        setSelectedSubmission(submission);
        setViewDialogOpen(true);
    };

    const handleGradeAssignment = async (submission) => {
        setSelectedSubmission(submission);
        await fetchRubrics(assignmentId);
        setGradeDialogOpen(true);
    };

    const handleViewReviewDetails = async (submissionId) => {
        setSelectedSubmissionId(submissionId);
        if (rubrics.length === 0) {
            await fetchRubrics(assignmentId);
        }
        setReviewDialogOpen(true);
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
                                    {/* <span>
                                        {student.latestGrade !== null ? student.latestGrade.toFixed(2) : "N/A"}
                                    </span> */}
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
                                                        <div className="flex flex-wrap gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewSubmission(submission)}
                                                            >
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDownload(submission)}
                                                            >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Download
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleGradeAssignment(submission)}
                                                            >
                                                                Grade
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewReviewDetails(submission.submissionId)}
                                                            >
                                                                View Grades
                                                            </Button>
                                                        </div>
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
            <ViewSubmissionDialog
                submission={selectedSubmission}
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                onDownload={handleDownload}
            />
            <GradeSubmissionDialog
                submission={selectedSubmission}
                rubrics={rubrics}
                open={gradeDialogOpen}
                onClose={() => setGradeDialogOpen(false)}
                onGradeSubmit={handleGradeSubmit}
            />
            <ReviewDetailsDialog
                submissionId={selectedSubmissionId}
                rubrics={rubrics}
                open={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
            />
        </Card>
    );
};

export default Submissions;