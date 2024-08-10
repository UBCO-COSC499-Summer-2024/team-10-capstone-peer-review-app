// The main component for the assignment submissions page (within assignments.jsx page)

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
import { Download, Search, Info } from "lucide-react";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import { Input } from "@/components/ui/input";
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
import GradeSubmissionDialog from "./submission/GradeSubmissionDialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";

const Submissions = (assignment) => {
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
	const [searchTerm, setSearchTerm] = useState("");

	// Fetch initial data when component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [submissionsResponse, studentsResponse, rubricData] =
					await Promise.all([
						getSubmissionsForAssignment(assignmentId),
						getStudentsByClassId(classId),
						getRubricsForAssignment(assignmentId)
					]);

				// Group submissions by student
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

				// Process student data and their submissions
				const studentsWithSubmissionStatus = await Promise.all(
					studentsResponse.data.map(async (student) => {
						const submissions = submissionsMap[student.userId] || [];
						submissions.sort(
							(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
						);
						const latestSubmission = submissions[0];
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

	// Handle downloading a submission
	const handleDownload = (submission) => {
		const link = document.createElement("a");
		link.href = submission.submissionFilePath;
		link.download = `submission_${submission.submissionId}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Fetch the rubric for the assignment
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

	// Handle submitting a grade for a submission
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
			const grade =
				parseFloat(formData.get(`grade-${criterion.criterionId}`)) || 0;
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
			const existingReview = await reviewAPI.getInstructorReview(
				selectedSubmission.submissionId
			);

			if (existingReview && existingReview.data) {
				const review = {
					submissionId: selectedSubmission.submissionId,
					reviewGrade: totalMark,
					reviewerId: user.userId,
					revieweeId: selectedSubmission.submitterId,
					updatedAt: new Date(),
					isPeerReview: false,
					criterionGrades: criterionGrades
				};
				await reviewAPI.updateReview(existingReview.data.reviewId, review);
			} else {
				const review = {
					submissionId: selectedSubmission.submissionId,
					reviewGrade: totalMark,
					reviewerId: user.userId,
					revieweeId: selectedSubmission.submitterId,
					isPeerReview: false,
					criterionGrades: criterionGrades
				};

				await reviewAPI.createReview(user.userId, review);
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

	// Handle viewing a submission
	const handleViewSubmission = (submission) => {
		setSelectedSubmission(submission);
		setViewDialogOpen(true);
	};

	// Handle grading an assignment
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
		setGradeDialogOpen(true);
	};

	// Handle viewing review details
	const handleViewReviewDetails = async (submissionId) => {
		setSelectedSubmissionId(submissionId);
		if (!rubric) {
			await fetchRubrics(assignmentId);
		}
		setReviewDialogOpen(true);
	};

	const isDueDatePassed = () => {
		const currentDate = new Date();
		const assignmentDueDate = new Date(assignment.assignment.dueDate);
		return currentDate > assignmentDueDate;
	};

	// Filter students based on search term
	const filteredStudents = studentsWithSubmissions.filter((student) =>
		student.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return <div>Loading submissions...</div>;
	}

	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Submissions</CardTitle>
				</CardHeader>
				<div className="mb-4 flex items-center mx-5">
					<Search className="mr-2 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder="Search by student name"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-grow"
					/>
				</div>
				<CardContent>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center mb-4 text-yellow-800 bg-yellow-100 p-2 rounded">
									<Info className="h-4 w-4 mr-2" />
									<span>
										Some actions are disabled until the assignment due date.
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Grading and viewing grades are only available after the due
									date.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<Accordion type="single" collapsible className="w-full">
						{filteredStudents.map((student, index) => (
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
														<TableCell>
															Attempt {student.submissions.length - subIndex}
														</TableCell>
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
																{subIndex === 0 && user.role !== "STUDENT" && (
																	<>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				handleGradeAssignment(submission)
																			}
																			disabled={!isDueDatePassed()}
																			className={cn(
																				!isDueDatePassed() &&
																					"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																			)}
																		>
																			{submission.finalGrade !== null
																				? "Re-grade"
																				: "Grade"}
																		</Button>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() =>
																				handleViewReviewDetails(
																					submission.submissionId
																				)
																			}
																			disabled={!isDueDatePassed()}
																			className={cn(
																				!isDueDatePassed() &&
																					"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																			)}
																		>
																			View Grade
																		</Button>
																	</>
																)}
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
					rubric={rubric}
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
			</Card>
			{/* Rubrics Card */}
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
