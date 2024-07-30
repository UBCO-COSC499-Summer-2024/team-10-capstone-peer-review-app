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
import {
	Check,
	ChevronsUpDown,
	Download,
	Search,
	FileText,
	UserX,
	Clock,
	Info
} from "lucide-react";
import { cn } from "@/utils/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter
} from "@/components/ui/dialog";
import MultiSelect from "@/components/ui/MultiSelect";
import { toast } from "@/components/ui/use-toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip";

import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import reviewAPI from "@/api/reviewApi";
import { getRubricsForAssignment } from "@/api/rubricApi";

import ViewSubmissionDialog from "@/components/assign/assignment/submission/ViewSubmissionDialog";
import GradeSubmissionDialog from "@/components/assign/assignment/submission/GradeSubmissionDialog";
import ReviewDetailsDialog from "@/components/assign/assignment/submission/ReviewDetailsDialog";
import ViewAllPeerReviewsDialog from "@/components/instructorReview/ViewAllPeerReviewsDialog";

const ManageGradesAndReviews = () => {
	const { user } = useUser();
	const { classes, loading: classLoading } = useClass();
	const [assignments, setAssignments] = useState([]);
	const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [openClass, setOpenClass] = useState(false);
	const [openAssignment, setOpenAssignment] = useState(false);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [assignReviewersDialogOpen, setAssignReviewersDialogOpen] =
		useState(false);
	const [selectedReviewers, setSelectedReviewers] = useState([]);
	const [allStudents, setAllStudents] = useState([]);
	const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false);
	const [reviewsPerStudent, setReviewsPerStudent] = useState(1);
	const [rubric, setRubric] = useState(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
	const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
	const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
	const [viewAllPeerReviewsDialogOpen, setViewAllPeerReviewsDialogOpen] =
		useState(false);
	const [
		selectedSubmissionForPeerReviews,
		setSelectedSubmissionForPeerReviews
	] = useState(null);

	useEffect(() => {
		if (selectedClass) {
			fetchAssignments(selectedClass);
		}
	}, [selectedClass]);

	useEffect(() => {
		if (selectedClass && selectedAssignment) {
			fetchStudentsAndSubmissions(
				selectedClass,
				selectedAssignment.assignmentId
			);
			fetchRubrics(selectedAssignment.assignmentId);
		}
	}, [selectedClass, selectedAssignment]);

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

	const fetchStudentsAndSubmissions = async (classId, assignmentId) => {
		try {
			const [studentsResponse, submissionsResponse] = await Promise.all([
				getStudentsByClassId(classId),
				getSubmissionsForAssignment(assignmentId)
			]);

			const students = studentsResponse.data;
			const submissions = submissionsResponse.data;

			const studentsWithSubmissionStatus = students.map((student) => {
				const studentSubmissions = submissions.filter(
					(sub) => sub.submitterId === student.userId
				);

				studentSubmissions.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);

				const mostRecentSubmission = studentSubmissions[0] || null;

				return {
					...student,
					hasSubmitted: !!mostRecentSubmission,
					submission: mostRecentSubmission
				};
			});

			setStudentsWithSubmissions(studentsWithSubmissionStatus);
			setAllStudents(students);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch students and submissions",
				variant: "destructive"
			});
		}
	};

	const fetchRubrics = async (assignmentId) => {
		try {
			const rubricData = await getRubricsForAssignment(assignmentId);
			setRubric(rubricData.data);
		} catch (error) {
			console.error("Error fetching rubric:", error);
			toast({
				title: "Error",
				description: "Failed to fetch rubric",
				variant: "destructive"
			});
		}
	};

	const isDueDatePassed = (dueDate) => {
		if (!dueDate) return false;
		const currentDate = new Date();
		const assignmentDueDate = new Date(dueDate);
		return currentDate > assignmentDueDate;
		// comment this in to test
		// return true;
	};

	const handleAssignReviewers = async (submission) => {
		if (!isDueDatePassed(selectedAssignment.dueDate)) {
			toast({
				title: "Action not allowed",
				description:
					"You must wait for the due date to pass before assigning reviewers",
				variant: "warning"
			});
			return;
		}
		setSelectedSubmission(submission);
		try {
			const reviews = await reviewAPI.getAllReviews(submission.submissionId);
			const existingReviewerIds = reviews.data
				.filter((review) => review.isPeerReview)
				.map((review) => review.reviewerId);
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

	const handleAssignReviewersSubmit = async () => {
		try {
			const existingReviews = await reviewAPI.getPeerReviews(
				selectedSubmission.submissionId
			);
			for (const review of existingReviews.data) {
				if (!selectedReviewers.includes(review.reviewerId)) {
					await reviewAPI.deleteReview(review.reviewId);
				}
			}

			for (const reviewerId of selectedReviewers) {
				if (!existingReviews.data.some((r) => r.reviewerId === reviewerId)) {
					const blankReview = {
						submissionId: selectedSubmission.submissionId,
						reviewGrade: 0,
						reviewerId: reviewerId,
						revieweeId: selectedSubmission.submitterId,
						isPeerReview: true,
						isGroup: false,
						criterionGrades: []
					};
					await reviewAPI.createReview(reviewerId, blankReview);
				}
			}

			setAssignReviewersDialogOpen(false);
			setSelectedSubmission(null);
			setSelectedReviewers([]);
			fetchStudentsAndSubmissions(
				selectedClass,
				selectedAssignment.assignmentId
			);
			toast({
				title: "Success",
				description: "Reviewers assigned successfully",
				variant: "default"
			});
		} catch (error) {
			console.error("Error updating reviewers:", error);
			toast({
				title: "Error",
				description: "Failed to update reviewers",
				variant: "destructive"
			});
		}
	};

	const handleViewAllPeerReviews = (submissionId) => {
		setSelectedSubmissionForPeerReviews(submissionId);
		setViewAllPeerReviewsDialogOpen(true);
	};

	const handleAutoAssignPeerReviews = async () => {
		if (!isDueDatePassed(selectedAssignment.dueDate)) {
			toast({
				title: "Action not allowed",
				description:
					"You must wait for the due date to pass before auto-assigning peer reviews",
				variant: "warning"
			});
			return;
		}
		try {
			await reviewAPI.assignRandomPeerReviews(
				selectedAssignment.assignmentId,
				reviewsPerStudent
			);
			setAutoAssignDialogOpen(false);
			fetchStudentsAndSubmissions(
				selectedClass,
				selectedAssignment.assignmentId
			);
			toast({
				title: "Success",
				description: "Peer reviews automatically assigned",
				variant: "default"
			});
		} catch (error) {
			console.error("Error assigning peer reviews:", error);
			toast({
				title: "Error",
				description: "Failed to assign peer reviews",
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

	const handleViewSubmission = (submission) => {
		setSelectedSubmission(submission);
		setViewDialogOpen(true);
	};

	const handleGradeAssignment = async (submission) => {
		if (!isDueDatePassed(selectedAssignment.dueDate)) {
			toast({
				title: "Action not allowed",
				description: "You must wait for the due date to pass before grading",
				variant: "warning"
			});
			return;
		}
		if (!submission) {
			toast({
				title: "Error",
				description: "Unable to grade submission. Please try again.",
				variant: "destructive"
			});
			return;
		}
		setSelectedSubmission(submission);
		await fetchRubrics(selectedAssignment.assignmentId);
		setGradeDialogOpen(true);
	};

	const handleViewReviewDetails = async (submissionId) => {
		if (!isDueDatePassed(selectedAssignment.dueDate)) {
			toast({
				title: "Action not allowed",
				description:
					"You must wait for the due date to pass before viewing grades",
				variant: "warning"
			});
			return;
		}
		setSelectedSubmissionId(submissionId);
		if (!rubric) {
			await fetchRubrics(selectedAssignment.assignmentId);
		}
		setReviewDialogOpen(true);
	};

	const handleGradeSubmit = async (event) => {
		event.preventDefault();

		if (!selectedSubmission || !rubric) {
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
						return {
							...student,
							submission: {
								...student.submission,
								finalGrade: finalScore
							}
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

	const filteredStudents = studentsWithSubmissions.filter((student) =>
		`${student.firstname} ${student.lastname}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Manage Grades and Reviews</CardTitle>
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
														setSelectedAssignment(null);
														setStudentsWithSubmissions([]);
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
										? selectedAssignment.title
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
															assignment.assignmentId ===
																selectedAssignment?.assignmentId
																? null
																: assignment
														);
														setOpenAssignment(false);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															selectedAssignment?.assignmentId ===
																assignment.assignmentId
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

					{selectedClass && selectedAssignment && (
						<>
							<div className="flex items-center flex-grow">
								<Search className="mr-2 h-4 w-4 text-gray-500" />
								<Input
									placeholder="Search by student name"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="flex-grow"
								/>
							</div>
							<Button
								onClick={() => setAutoAssignDialogOpen(true)}
								disabled={!isDueDatePassed(selectedAssignment.dueDate)}
								className={cn(
									!isDueDatePassed(selectedAssignment.dueDate) &&
										"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
								)}
							>
								Auto Assign Peer Reviews
							</Button>
						</>
					)}
				</div>

				{selectedClass && selectedAssignment && (
					<>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="flex items-center mb-4 text-yellow-800 bg-yellow-100 p-2 rounded">
										<Info className="h-4 w-4 mr-2" />
										<span>
											Some actions are disabled until the assignment due date
											has passed.
										</span>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										Grading, viewing grades, and assigning reviewers are only
										available after the due date.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<Accordion type="single" collapsible className="w-full">
							{filteredStudents.map((student) => (
								<AccordionItem value={student.userId} key={student.userId}>
									<AccordionTrigger
										className={cn(
											student.hasSubmitted ? "bg-green-50" : "bg-red-50",
											"hover:bg-opacity-80 px-4"
										)}
									>
										<div className="flex justify-between w-full items-center">
											<span className="flex items-center">
												{student.hasSubmitted ? (
													<FileText className="mr-2 h-4 w-4 text-green-500" />
												) : (
													<UserX className="mr-2 h-4 w-4 text-red-500" />
												)}
												{`${student.firstname} ${student.lastname}`}
											</span>
											<span>
												{student.hasSubmitted ? "Submitted" : "Not Submitted"}
											</span>
										</div>
									</AccordionTrigger>
									<AccordionContent>
										{student.hasSubmitted ? (
											<div className="p-4 bg-white rounded-lg shadow">
												<h3 className="font-semibold mb-2 flex items-center">
													<Clock className="mr-2 h-4 w-4" />
													Latest Submission
												</h3>
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Submitted At</TableHead>
															<TableHead>Actions</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														<TableRow>
															<TableCell>
																{new Date(
																	student.submission.createdAt
																).toLocaleString()}
															</TableCell>
															<TableCell>
																<div className="flex flex-wrap gap-2">
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleViewSubmission(student.submission)
																		}
																	>
																		View
																	</Button>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleDownload(student.submission)
																		}
																	>
																		<Download className="h-4 w-4 mr-1" />
																		Download
																	</Button>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleGradeAssignment(student.submission)
																		}
																		disabled={
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			)
																		}
																		className={cn(
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			) &&
																				"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																		)}
																	>
																		{student.submission.finalGrade !== null
																			? "Re-grade"
																			: "Grade"}
																	</Button>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleViewReviewDetails(
																				student.submission.submissionId
																			)
																		}
																		disabled={
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			)
																		}
																		className={cn(
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			) &&
																				"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																		)}
																	>
																		View Grade
																	</Button>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleAssignReviewers(student.submission)
																		}
																		disabled={
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			)
																		}
																		className={cn(
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			) &&
																				"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																		)}
																	>
																		Assign Reviewers
																	</Button>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			handleViewAllPeerReviews(
																				student.submission.submissionId
																			)
																		}
																		disabled={
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			)
																		}
																		className={cn(
																			!isDueDatePassed(
																				selectedAssignment.dueDate
																			) &&
																				"bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
																		)}
																	>
																		View Peer Reviews
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</div>
										) : (
											<div className="p-4 bg-white rounded-lg shadow">
												<p className="text-gray-500 italic">
													No submission for this assignment.
												</p>
											</div>
										)}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</>
				)}
			</CardContent>

			{/* Dialogs */}
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
										student.userId !== selectedSubmission?.submitterId
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

			<Dialog
				open={autoAssignDialogOpen}
				onOpenChange={setAutoAssignDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Auto Assign Peer Reviews</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<label>Number of reviews per student:</label>
						<Input
							type="number"
							value={reviewsPerStudent}
							onChange={(e) => setReviewsPerStudent(parseInt(e.target.value))}
							min="1"
						/>
					</div>
					<DialogFooter>
						<Button onClick={handleAutoAssignPeerReviews}>Assign</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

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
			<ViewAllPeerReviewsDialog
				submissionId={selectedSubmissionForPeerReviews}
				open={viewAllPeerReviewsDialogOpen}
				onClose={() => setViewAllPeerReviewsDialogOpen(false)}
			/>
		</Card>
	);
};

export default ManageGradesAndReviews;
