// This is the page for viewing the review dashboard for instructors .it allows you to select a class, the assignment and then displays all 
// The submission information for each student of that clss who is a part of the assignment selected
// Furthermore, the instrucgtor is present action buttons depending on the staet of submission.

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Download, Search } from "lucide-react";
import { cn } from "@/utils/utils";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
import { useUser } from "@/contexts/contextHooks/useUser";
import GradeSubmissionDialog from "@/components/assign/assignment/submission/GradeSubmissionDialog";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getRubricsForAssignment } from "@/api/rubricApi";
import reviewAPI from "@/api/reviewApi";

const ManageReviews = () => {
	const { user } = useUser();
	const { classes, loading: classLoading } = useClass();
	const [assignments, setAssignments] = useState([]);
	const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedAssignment, setSelectedAssignment] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [openClass, setOpenClass] = useState(false);
	const [openAssignment, setOpenAssignment] = useState(false);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
	const [rubrics, setRubrics] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

	// Fetch the assignments and rubrics for the selected class
	useEffect(() => {
		if (classes && classes.length > 0 && selectedClass) {
			fetchAssignments(selectedClass);
		}
	}, [selectedClass, classes]);

	// Fetch the submissions and rubrics for the selected assignment
	useEffect(() => {
		if (selectedAssignment) {
			fetchSubmissions(selectedAssignment);
			fetchRubrics(selectedAssignment);
		}
	}, [selectedAssignment]);

	// Fetch the assignments for the selected class
	const fetchAssignments = async (classId) => {
		try {
			const response = await getAllAssignmentsByClassId(classId);
			setAssignments(response.data);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch assignments",
				variant: "destructive"
			});
		}
	};

	// Fetch the submissions for the selected assignment
	const fetchSubmissions = async (assignmentId) => {
		try {
			const response = await getSubmissionsForAssignment(assignmentId);
			const submissionsData = response.data;

			const groupedSubmissions = submissionsData.reduce((acc, submission) => {
				if (!acc[submission.submitterId]) {
					acc[submission.submitterId] = [];
				}
				acc[submission.submitterId].push(submission);
				return acc;
			}, {});

			Object.keys(groupedSubmissions).forEach((studentId) => {
				groupedSubmissions[studentId].sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);
			});

			const studentsWithSubmissionsArray = await Promise.all(
				Object.entries(groupedSubmissions).map(
					async ([studentId, submissions]) => {
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
							userId: studentId,
							name: `${submissions[0].submitter.firstname} ${submissions[0].submitter.lastname}`,
							submissions: submissions,
							hasSubmitted: submissions.length > 0,
							latestGrade: latestGrade
						};
					}
				)
			);

			setStudentsWithSubmissions(studentsWithSubmissionsArray);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch submissions",
				variant: "destructive"
			});
		}
	};

	// Fetch the rubrics for the selected assignment
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
			toast({
				title: "Error",
				description: "Failed to fetch rubrics",
				variant: "destructive"
			});
		}
	};

	// Filter the students with submissions based on the search term
	const filteredStudents = studentsWithSubmissions.filter((student) =>
		student.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Handle downloading a submission file
	const handleDownload = (submission) => {
		const link = document.createElement("a");
		link.href = submission.submissionFilePath;
		link.download = `submission_${submission.submissionId}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Handle grading a submission
	const handleGradeSubmission = (submission) => {
		setSelectedSubmission(submission);
		setGradeDialogOpen(true);
	};

	// Handle submitting a grade for a submission
	const handleGradeSubmit = async (event) => {
		event.preventDefault();

		if (!selectedSubmission) {
			console.error("No submission selected");
			toast({
				title: "Error",
				description: "No submission selected. Please try again.",
				variant: "destructive"
			});
			return;
		}

		const formData = new FormData(event.target);
		let totalMark = 0;
		const criterionGrades = [];

		rubrics.forEach((rubric) => {
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
		});

		const finalScore = (totalMark / totalPoints) * 100;

		try {
			const existingReview = await reviewAPI.getInstructorReview(
				selectedSubmission.submissionId
			);

			let response;
			if (existingReview && existingReview.data) {
				const review = {
					submissionId: selectedSubmission.submissionId,
					reviewGrade: totalMark,
					reviewerId: user.userId,
					revieweeId: selectedSubmission.submitterId,
					updatedAt: new Date(),
					isPeerReview: false,
					isGroup: false,
					criterionGrades: criterionGrades
				};
				response = await reviewAPI.updateReview(
					existingReview.data.reviewId,
					review
				);
			} else {
				const review = {
					submissionId: selectedSubmission.submissionId,
					reviewGrade: totalMark,
					reviewerId: user.userId,
					revieweeId: selectedSubmission.submitterId,
					isPeerReview: false,
					isGroup: false,
					criterionGrades: criterionGrades
				};
				response = await reviewAPI.createReview(user.userId, review);
			}

			// Update the studentsWithSubmissions state to reflect the new grade
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

			toast({
				title: "Success",
				description: "Grade submitted successfully",
				variant: "default"
			});
		} catch (error) {
			console.error("Error submitting/updating grade:", error);
			toast({
				title: "Error",
				description: "Failed to submit/update grade",
				variant: "destructive"
			});
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Assignment Submissions Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex space-x-4 mb-4">
					{classLoading ? (
						<Button variant="outline" disabled>
							Loading Classes...
						</Button>
					) : classes && classes.length > 0 ? (
						<Popover open={openClass} onOpenChange={setOpenClass}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={openClass}
									className="w-[200px] justify-between"
								>
									{selectedClass
										? classes.find((cls) => cls.classId === selectedClass)
												?.classname
										: "Select Class"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandInput placeholder="Search class..." />
									<CommandEmpty>No class found.</CommandEmpty>
									<CommandList>
										<CommandGroup>
											{(classes || []).map((cls) => (
												<CommandItem
													key={cls.classId}
													onSelect={() => {
														setSelectedClass(
															cls.classId === selectedClass ? "" : cls.classId
														);
														setOpenClass(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															selectedClass === cls.classId
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{cls.classname}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					) : (
						<Button variant="outline" disabled>
							No Classes Available
						</Button>
					)}

					{assignments && assignments.length > 0 ? (
						<Popover open={openAssignment} onOpenChange={setOpenAssignment}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={openAssignment}
									className="w-[200px] justify-between"
									disabled={!selectedClass}
								>
									{selectedAssignment
										? assignments.find(
												(a) => a.assignmentId === selectedAssignment
											)?.title
										: "Select Assignment"}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0">
								<Command>
									<CommandInput placeholder="Search assignment..." />
									<CommandEmpty>No assignment found.</CommandEmpty>
									<CommandList>
										<CommandGroup>
											{(assignments || []).map((assignment) => (
												<CommandItem
													key={assignment.assignmentId}
													onSelect={() => {
														setSelectedAssignment(
															assignment.assignmentId === selectedAssignment
																? ""
																: assignment.assignmentId
														);
														setOpenAssignment(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															selectedAssignment === assignment.assignmentId
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{assignment.title}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					) : (
						<Button variant="outline" disabled>
							{selectedClass
								? "No Assignments Available"
								: "Select a Class First"}
						</Button>
					)}

					<div className="flex items-center flex-grow">
						<Search className="mr-2 h-4 w-4 text-gray-500" />
						<Input
							placeholder="Search by student name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex-grow"
						/>
					</div>
				</div>
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
									<span>
										{student.latestGrade !== null
											? `${student.latestGrade.toFixed(2)}%`
											: "Not graded"}
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
															<Link
																to={`/viewSubmission/${submission.submissionId}`}
															>
																<Button variant="outline" size="sm">
																	View
																</Button>
															</Link>
															<Button
																variant="outline"
																size="sm"
																onClick={() => handleDownload(submission)}
															>
																<Download className="h-4 w-4 mr-1" />
																Download
															</Button>
															{subIndex === 0 && (
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		handleGradeSubmission(submission)
																	}
																>
																	{submission.finalGrade !== null
																		? "Re-grade"
																		: "Grade"}
																</Button>
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
			<GradeSubmissionDialog
				submission={selectedSubmission}
				rubrics={rubrics}
				open={gradeDialogOpen && selectedSubmission !== null}
				onClose={() => {
					setGradeDialogOpen(false);
					setSelectedSubmission(null);
				}}
				onGradeSubmit={handleGradeSubmit}
			/>
		</Card>
	);
};

export default ManageReviews;
