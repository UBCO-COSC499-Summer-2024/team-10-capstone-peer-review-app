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
	Clock
} from "lucide-react";
import { cn } from "@/utils/utils";
import { Link } from "react-router-dom";
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

import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { getStudentsByClassId } from "@/api/classApi";
import reviewAPI from "@/api/reviewApi";
import { getRubricsForAssignment } from "@/api/rubricApi";

const ManageAssignmentReviewsAndSubmissions = () => {
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
	const [assignReviewersDialogOpen, setAssignReviewersDialogOpen] =
		useState(false);
	const [selectedReviewers, setSelectedReviewers] = useState([]);
	const [allStudents, setAllStudents] = useState([]);
	const [autoAssignDialogOpen, setAutoAssignDialogOpen] = useState(false);
	const [reviewsPerStudent, setReviewsPerStudent] = useState(1);
	const [rubrics, setRubrics] = useState([]);

	useEffect(() => {
		if (selectedClass) {
			fetchAssignments(selectedClass);
			fetchStudents(selectedClass);
		}
	}, [selectedClass]);

	useEffect(() => {
		if (selectedClass && selectedAssignment) {
			fetchStudentsAndSubmissions(selectedClass, selectedAssignment);
			fetchRubrics(selectedAssignment);
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

	const fetchStudents = async (classId) => {
		try {
			const response = await getStudentsByClassId(classId);
			setAllStudents(response.data);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch students",
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
				// Get all submissions for this student
				const studentSubmissions = submissions.filter(
					(sub) => sub.submitterId === student.userId
				);

				// Sort submissions by date, most recent first
				studentSubmissions.sort(
					(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
				);

				// Get the most recent submission (if any)
				const mostRecentSubmission = studentSubmissions[0] || null;

				return {
					...student,
					hasSubmitted: !!mostRecentSubmission,
					submission: mostRecentSubmission
				};
			});

			setStudentsWithSubmissions(studentsWithSubmissionStatus);
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
			setRubrics(rubricData.data);
		} catch (error) {
			console.error("Error fetching rubrics:", error);
			toast({
				title: "Error",
				description: "Failed to fetch rubrics",
				variant: "destructive"
			});
		}
	};

	const handleAssignReviewers = async (submission) => {
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
			// Delete reviews for unchecked existing reviewers
			const existingReviews = await reviewAPI.getPeerReviews(
				selectedSubmission.submissionId
			);
			for (const review of existingReviews.data) {
				if (!selectedReviewers.includes(review.reviewerId)) {
					await reviewAPI.deleteReview(review.reviewId);
				}
			}

			// Create new blank reviews for newly selected reviewers
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
			fetchStudentsAndSubmissions(selectedClass, selectedAssignment);
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

	const handleAutoAssignPeerReviews = async () => {
		try {
			await reviewAPI.assignRandomPeerReviews(
				selectedAssignment,
				reviewsPerStudent
			);
			setAutoAssignDialogOpen(false);
			fetchStudentsAndSubmissions(selectedClass, selectedAssignment);
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

	const filteredStudents = studentsWithSubmissions.filter((student) =>
		`${student.firstname} ${student.lastname}`
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Manage Assignment Reviews and Submissions</CardTitle>
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
					<Button
						onClick={() => setAutoAssignDialogOpen(true)}
						disabled={!selectedAssignment}
					>
						Auto Assign Peer Reviews
					</Button>
				</div>

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
															<Link
																to={`/viewSubmission/${student.submission.submissionId}`}
															>
																<Button variant="outline" size="sm">
																	View
																</Button>
															</Link>
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
																	handleAssignReviewers(student.submission)
																}
															>
																Assign Reviewers
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
			</CardContent>

			{/* Assign Reviewers Dialog */}
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

			{/* Auto Assign Dialog */}
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
		</Card>
	);
};

export default ManageAssignmentReviewsAndSubmissions;
