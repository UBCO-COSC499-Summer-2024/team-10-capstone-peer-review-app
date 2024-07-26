import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/utils/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ReviewDetailsDialog from "./submission/ReviewDetailsDialog";
import ViewSubmissionDialog from "./submission/ViewSubmissionDialog";
import GradeSubmissionDialog from "./submission/GradeSubmissionDialog";;
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter
} from "@/components/ui/dialog";
import MultiSelect from "@/components/ui/MultiSelect";

const Submissions = () => {
	const { user } = useUser();
	const { assignmentId, classId } = useParams();
	const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [rubric, setRubric] = useState(null);
    const [totalPoints, setTotalPoints] = useState(0);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
	const [assignReviewersDialogOpen, setAssignReviewersDialogOpen] = useState(false);
	const [selectedReviewers, setSelectedReviewers] = useState([]);
	const [currentSubmission, setCurrentSubmission] = useState(null);
	const [allStudents, setAllStudents] = useState([]);
	const [existingReviewers, setExistingReviewers] = useState([]);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [reviewersToDelete, setReviewersToDelete] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
            try {
              const [submissionsResponse, studentsResponse, rubricData] =
                await Promise.all([
                  getSubmissionsForAssignment(assignmentId),
                  getStudentsByClassId(classId),
                  getRubricsForAssignment(assignmentId)
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

				const studentsWithSubmissionStatus = await Promise.all(
					studentsResponse.data.map(async (student) => {
						const submissions = submissionsMap[student.userId] || [];
						const latestSubmission = submissions[submissions.length - 1];
						let latestGrade = null;
						if (latestSubmission) {
							const reviews = await reviewAPI.getAllReviews(
								latestSubmission.submissionId
							);
							if (reviews.length > 0) {
								const sortedReviews = reviews.sort(
									(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
								);
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
					})
				);
				setAllStudents(studentsResponse.data);
				setStudentsWithSubmissions(studentsWithSubmissionStatus);

                setRubric(rubricData.data);
                if (rubricData.data) {
                  setTotalPoints(rubricData.data.totalMarks);
                }
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to fetch data",
                  variant: "destructive"
                });
              } finally {
                setLoading(false);
              }
            };

		fetchData();
	}, [assignmentId, classId]);

	const handleAssignReviewers = async (submission) => {
		setCurrentSubmission(submission);
		console.log("submission", submission);
		// Fetch existing reviewers
		try {
			const reviews = await reviewAPI.getAllReviews(submission.submissionId);
			console.log("reiveeees", reviews);
			const existingReviewerIds = reviews.data
				.filter((review) => review.isPeerReview)
				.map((review) => review.reviewerId);
			console.log("existingReviewerIds", existingReviewerIds);
			setExistingReviewers(existingReviewerIds);
			setSelectedReviewers(existingReviewerIds);
		} catch (error) {
			console.error("Error fetching existing reviewers:", error);
			toast({
				title: "Error",
				description: "Failed to fetch existing reviewers",
				variant: "destructive"
			});
		}

		setAssignReviewersDialogOpen(true);
	};

	const handleAssignReviewersSubmit = () => {
		const reviewersToRemove = existingReviewers.filter(
			(id) => !selectedReviewers.includes(id)
		);
		if (reviewersToRemove.length > 0) {
			setReviewersToDelete(reviewersToRemove);
			setAssignReviewersDialogOpen(false);
			setConfirmDialogOpen(true);
		} else {
			updateReviewers();
		}
	};

	const handleConfirmDelete = () => {
		updateReviewers();
		setConfirmDialogOpen(false);
	};

	const handleCancelDelete = () => {
		setConfirmDialogOpen(false);
		setAssignReviewersDialogOpen(true);
		setSelectedReviewers(existingReviewers);
	};

	const updateReviewers = async () => {
		try {
			// Delete reviews for unchecked existing reviewers
			for (const reviewerId of existingReviewers) {
				if (!selectedReviewers.includes(reviewerId)) {
					const peerReviewsResponse = await reviewAPI.getPeerReviews(
						currentSubmission.submissionId
					);
					const peerReviews = peerReviewsResponse.data;
					const reviewToDelete = peerReviews.find(
						(review) => review.reviewerId === reviewerId
					);
					if (reviewToDelete) {
						await reviewAPI.deleteReview(reviewToDelete.reviewId);
					}
				}
			}

			// Create new blank reviews for newly selected reviewers
			for (const reviewerId of selectedReviewers) {
				if (!existingReviewers.includes(reviewerId)) {
					const blankReview = {
						submissionId: currentSubmission.submissionId,
						reviewGrade: 0,
						reviewerId: reviewerId,
						revieweeId: currentSubmission.submitterId,
						isPeerReview: true,
						isGroup: false,
						criterionGrades: []
					};
					await reviewAPI.createReview(reviewerId, blankReview);
				}
			}

			setConfirmDialogOpen(false);
			setAssignReviewersDialogOpen(false);

			// Reset states
			setCurrentSubmission(null);
			setSelectedReviewers([]);
			setExistingReviewers([]);
			setReviewersToDelete([]);
		} catch (error) {
			console.error("Error updating reviewers:", error);
			toast({
				title: "Error",
				description: "Failed to update reviewers",
				variant: "destructive"
			});
		}
	};

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
          setRubric(rubricData.data);
          if (rubricData.data) {
            setTotalPoints(rubricData.data.totalMarks);
          }
        } catch (error) {
          console.error("Error fetching rubric:", error);
        }
      };

      const handleGradeSubmit = async (event) => {
        event.preventDefault();
    
        if (!selectedSubmission || !rubric) {
            console.error("No submission selected or no rubric available");
            toast({
                title: "Error",
                description: "Unable to grade. Please try again.",
                variant: "destructive"
            });
            return;
        }
    
        const formData = new FormData(event.target);
        let totalMark = 0;
        const criterionGrades = [];
    
        rubric.criteria.forEach((criterion) => {
            const grade = parseFloat(formData.get(`grade-${criterion.criterionId}`)) || 0;
            totalMark += grade;
            const comment = formData.get(`comment-${criterion.criterionId}`);
            criterionGrades.push({
                criterionId: criterion.criterionId,
                grade,
                comment
            });
        });
    
        const finalScore = (totalMark / rubric.totalMarks) * 100;
    
        try {
            const existingReview = await reviewAPI.getInstructorReview(selectedSubmission.submissionId);
    
            let response;
            if (existingReview && existingReview.data) {
                const review = {
                    submissionId: selectedSubmission.submissionId,
                    reviewGrade: totalMark,
                    reviewerId: user.userId,
                    revieweeId: selectedSubmission.submitterId,
                    updatedAt: new Date(),
                    isPeerReview: false,
                    // Remove isGroup field
                    criterionGrades: criterionGrades
                };
                response = await reviewAPI.updateReview(existingReview.data.reviewId, review);
            } else {
                const review = {
                    submissionId: selectedSubmission.submissionId,
                    reviewGrade: totalMark,
                    reviewerId: user.userId,
                    revieweeId: selectedSubmission.submitterId,
                    isPeerReview: false,
                    // Remove isGroup field
                    criterionGrades: criterionGrades
                };
                response = await reviewAPI.createReview(user.userId, review);
            }
    
            setStudentsWithSubmissions((prev) =>
                prev.map((student) => {
                    if (student.userId === selectedSubmission.submitterId) {
                        const updatedSubmissions = student.submissions.map((sub) =>
                            sub.submissionId === selectedSubmission.submissionId
                                ? { ...sub, finalGrade: finalScore }
                                : sub
                        );
                        return {
                            ...student,
                            submissions: updatedSubmissions,
                            latestGrade: finalScore
                        };
                    }
                    return student;
                })
            );
    
            setGradeDialogOpen(false);
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
		if (!submission) {
			console.error("No submission provided to grade");
			toast({
				title: "Error",
				description: "Unable to grade submission. Please try again.",
				variant: "destructive"
			});
			return;
		}

		setSelectedSubmission(submission);
		await fetchRubrics(assignmentId);

		// if (rubrics.length === 0) {
		//     console.error("No rubrics available to grade with.");
		//     toast({
		//         title: "Error",
		//         description: "Please assign or create a rubric to this assignment to be able to grade it.",
		//         variant: "destructive"
		//     });
		//     return;
		// }

		setGradeDialogOpen(true);
	};

	const handleViewReviewDetails = async (submissionId) => {
		setSelectedSubmissionId(submissionId);
		if (!rubric) {
			await fetchRubrics(assignmentId);
		}
		setReviewDialogOpen(true);
	};

	if (loading) {
		return <div>Loading submissions...</div>;
	}

	return (
		<>
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
																	onClick={() =>
																		handleViewSubmission(submission)
																	}
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
																	onClick={() =>
																		handleGradeAssignment(submission)
																	}
																>
																	Grade
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		handleViewReviewDetails(
																			submission.submissionId
																		)
																	}
																>
																	View Grades
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		handleAssignReviewers(submission)
																	}
																>
																	Assign Reviewers
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
                    rubric={rubric}  // Pass the single rubric object here
                    open={viewDialogOpen}
                    onClose={() => setViewDialogOpen(false)}
                    onDownload={handleDownload}
                />
                <GradeSubmissionDialog
                submission={selectedSubmission}
                rubric={rubric}
                open={gradeDialogOpen && selectedSubmission !== null}
                onClose={() => {
                    setGradeDialogOpen(false);
                    setSelectedSubmission(null);
                }}
                onGradeSubmit={handleGradeSubmit}
                />
				<ReviewDetailsDialog
					submissionId={selectedSubmissionId}
					open={reviewDialogOpen}
					onClose={() => setReviewDialogOpen(false)}
				/>
				<Dialog
					open={assignReviewersDialogOpen}
					onOpenChange={setAssignReviewersDialogOpen}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Assign Peer Reviewers</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 min-h-[4vh] flex items-center justify-center">
							<MultiSelect
								options={allStudents
									.filter(
										(student) =>
											student.userId !== currentSubmission?.submitterId
									)
									.map((student) => ({
										value: student.userId,
										label: `${student.firstname} ${student.lastname}`
									}))}
								value={selectedReviewers}
								onChange={setSelectedReviewers}
							/>
						</div>
						<DialogFooter>
							<Button onClick={handleAssignReviewersSubmit}>
								Update Reviewers
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Reviewer Removal</DialogTitle>
						</DialogHeader>
						<div>
							Are you sure you want to remove the following reviewers? Their
							reviews will be deleted:
							<ul className="list-disc pl-5 mt-2">
								{reviewersToDelete.map((reviewerId) => {
									const reviewer = allStudents.find(
										(student) => student.userId === reviewerId
									);
									return (
										<li key={reviewerId}>
											{reviewer
												? `${reviewer.firstname} ${reviewer.lastname}`
												: reviewerId}
										</li>
									);
								})}
							</ul>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={handleCancelDelete}>
								Cancel
							</Button>
							<Button onClick={handleConfirmDelete}>Confirm</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</Card>
			<Card className="mt-4">
            {rubric && (
                <CardContent>
                <h3 className="text-lg font-semibold underline mb-3">Rubric</h3>
                <div className="mb-4">
                    <h4 className="text-md font-semibold mb-3 text-center">
                    {rubric.title}
                    </h4>
                    {rubric.description && (
                    <p className="text-sm">{rubric.description}</p>
                    )}
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Criterion Title</TableHead>
                        <TableHead>Ratings</TableHead>
                        <TableHead>Max Marks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rubric.criteria.map((criterion, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{criterion.title}</TableCell>
                            <TableCell>
                            <ul className="list-disc pl-4">
                                {criterion.criterionRatings.map((rating, rIdx) => (
                                <li
                                    key={rIdx}
                                    className="flex mb-5 bg-gray-200 rounded-lg p-2 justify-between items-start "
                                >
                                    <span>{rating.description}</span>
                                    <span className="font-bold border border-black rounded-full p-1 w-6 h-6 flex justify-center items-center">
                                    {rating.points}
                                    </span>
                                </li>
                                ))}
                            </ul>
                            </TableCell>
                            <TableCell>{criterion.maxMark}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            )}
            </Card>
		</>
	);
};

export default Submissions;
