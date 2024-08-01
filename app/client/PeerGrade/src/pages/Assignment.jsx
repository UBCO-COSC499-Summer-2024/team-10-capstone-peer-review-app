import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	Calendar,
	FileText,
	Users,
	Edit,
	Upload,
	Download
} from "lucide-react";
import PDFViewer from "@/components/assign/PDFViewer";
import EditAssignment from "../components/assign/assignment/EditAssignment";
import Submissions from "../components/assign/assignment/Submissions";
import Submission from "../components/assign/assignment/StudentSubmission";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAssignmentInClass } from "@/api/assignmentApi";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ViewSubmissionDialog from "@/components/assign/assignment/submission/ViewSubmissionDialog";
import {
	getStudentSubmission,
	getStudentSubmissionForAssignment
} from "@/api/submitApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	addCommentToAssignment,
	getCommentsForAssignment
} from "@/api/commentApi";
import { Input } from "@/components/ui/input";
import InfoButton from '@/components/global/InfoButton';


const NonPDFFileDownload = ({ url, fileName }) => {
	const fileType = url.split(".").pop().toUpperCase();
	return (
		<div className="flex w-full flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
			<FileText className="w-16 h-16 mb-4 text-gray-400" />
			<p className="mb-2 text-sm text-gray-500">File type: {fileType}</p>
			<p className="mb-4 text-sm text-gray-500">Filename: {fileName}</p>
			<Button
				onClick={() => window.open(url, "_blank")}
				className="flex items-center"
			>
				<Download className="mr-2 h-4 w-4" />
				Download File
			</Button>
		</div>
	);
};

const Assignment = () => {
	const { user, userLoading } = useUser();
	const { classId, assignmentId } = useParams();
	const [assignment, setAssignment] = useState(null);
	const [submissions, setSubmissions] = useState([]);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [selectedStudentForChat, setSelectedStudentForChat] = useState(null);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [currentView, setCurrentView] = useState('view');
	const navigate = useNavigate();
	const scrollAreaRef = useRef(null);
	const selectedStudentIdRef = useRef(null);

	const isPDF =
		assignment?.assignmentFilePath?.toLowerCase().endsWith(".pdf") || false;

	useEffect(() => {
		const fetchAssignment = async () => {
			try {
				const fetchedAssignment = await getAssignmentInClass(
					classId,
					assignmentId
				);
				setAssignment(fetchedAssignment.data);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch assignment data",
					variant: "destructive"
				});
			}
		};

		const fetchSubmissions = async () => {
			if (user.role === "STUDENT") {
				try {
					const fetchedSubmissions = await getStudentSubmissionForAssignment(
						user.userId,
						assignmentId
					);
					// Additional check to ensure only this student's submissions are displayed
					// Prisma will return first element if something in the where clause is undefined
					const filteredSubmissions = fetchedSubmissions.data.filter(
						(submission) => submission.submitterId === user.userId
					);
					setSubmissions(
						filteredSubmissions.sort(
							(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
						)
					);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch submissions data",
						variant: "destructive"
					});
				}
			}
		};

		if (!userLoading) {
			fetchAssignment();
			fetchSubmissions();
		}
	}, [user, userLoading, classId, assignmentId, refresh]);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const fetchedComments = await getCommentsForAssignment(assignmentId);
				setComments(fetchedComments.data);

				// Update selectedStudentForChat if it exists and is still selected
				if (selectedStudentIdRef.current) {
					const updatedStudent = fetchedComments.data.find(
						(chain) => chain.student.userId === selectedStudentIdRef.current
					);
					if (updatedStudent) {
						setSelectedStudentForChat((prevState) => {
							if (
								prevState &&
								prevState.student.userId === selectedStudentIdRef.current
							) {
								return updatedStudent;
							}
							return prevState;
						});
					}
				}
			} catch (error) {
				console.error("Failed to fetch comments:", error);
			}
		};

		fetchComments(); // Initial fetch

		const intervalId = setInterval(fetchComments, 10000); // Fetch every 10 seconds

		return () => clearInterval(intervalId); // Clean up on unmount
	}, [assignmentId]);

	useEffect(() => {
		scrollToBottom();
	}, [comments]);

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollElement) {
				scrollElement.scrollTop = scrollElement.scrollHeight;
			}
		}
	};

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const fetchedComments = await getCommentsForAssignment(assignmentId);
				setComments(fetchedComments.data);
			} catch (error) {
				console.error("Failed to fetch comments:", error);
			}
		};

		fetchComments(); // Initial fetch

		const intervalId = setInterval(fetchComments, 10000); // Fetch every 10 seconds

		return () => clearInterval(intervalId); // Clean up on unmount
	}, [assignmentId]);

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const fetchedComments = await getCommentsForAssignment(assignmentId);
				setComments(fetchedComments.data);

				// Update selectedStudentForChat if it exists
				if (selectedStudentForChat) {
					const updatedStudent = fetchedComments.data.find(
						(chain) =>
							chain.student.userId === selectedStudentForChat.student.userId
					);
					if (updatedStudent) {
						setSelectedStudentForChat(updatedStudent);
					}
				}
			} catch (error) {
				console.error("Failed to fetch comments:", error);
			}
		};

		fetchComments(); // Initial fetch

		const intervalId = setInterval(fetchComments, 10000); // Fetch every 10 seconds

		return () => clearInterval(intervalId); // Clean up on unmount
	}, [assignmentId, selectedStudentForChat]);

	const handleStudentSelect = (student) => {
		setIsTransitioning(true);
		setTimeout(() => {
			setSelectedStudentForChat(student);
			setSelectedStudent(student ? student.student.userId : null);
			setIsTransitioning(false);
		}, 300);
	};

	const handleBackClick = () => {
		navigate(`/class/${classId}`);
	};

	const handleDownload = (submission) => {
		const link = document.createElement("a");
		link.href = submission.submissionFilePath;
		link.download = `submission_${submission.submissionId}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const refreshToggle = () => {
		setRefresh(!refresh);
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) {
			return; // Don't send empty comments
		}

		try {
			const studentId =
				user.role === "STUDENT"
					? user.userId
					: selectedStudentForChat?.student.userId;
			if (!studentId) {
				toast({
					title: "Error",
					description: "No student selected for comment",
					variant: "destructive"
				});
				return;
			}
			const addedComment = await addCommentToAssignment(
				assignmentId,
				newComment.trim(),
				studentId
			);
			setComments((prevComments) => {
				if (user.role === "STUDENT") {
					return [...prevComments, addedComment.data];
				} else {
					return prevComments.map((chain) =>
						chain.student.userId === studentId
							? { ...chain, comments: [...chain.comments, addedComment.data] }
							: chain
					);
				}
			});

			// Update the selectedStudentForChat with the new comment
			if (selectedStudentForChat) {
				setSelectedStudentForChat((prevState) => ({
					...prevState,
					comments: [...prevState.comments, addedComment.data]
				}));
			}

			setNewComment("");
			setTimeout(scrollToBottom, 100); // Scroll to bottom after a short delay to ensure the new comment is rendered
		} catch (error) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to add comment",
				variant: "destructive"
			});
		}
	};

	if (userLoading || !assignment) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	const renderStudentComments = () => (
		<Card className="bg-card">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">Comments</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px] mb-4" ref={scrollAreaRef}>
					{comments.map((comment) => (
						<div
							key={comment.commentId}
							className={`flex items-start space-x-2 mb-4 ${comment.user.role === "INSTRUCTOR" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`flex flex-col ${comment.user.role === "INSTRUCTOR" ? "items-end" : "items-start"}`}
							>
								<div className="flex items-center space-x-2 mb-1">
									<Avatar className="h-6 w-6">
										<AvatarFallback className="text-xs">{`${comment.user.firstname[0]}${comment.user.lastname[0]}`}</AvatarFallback>
									</Avatar>
									<p className="text-sm font-semibold">{`${comment.user.firstname} ${comment.user.lastname}`}</p>
								</div>
								<div
									className={`bg-slate-100 rounded-lg p-2 max-w-[80%] ${comment.user.role === "INSTRUCTOR" ? "rounded-tr-none" : "rounded-tl-none"}`}
								>
									<p className="text-sm">{comment.content}</p>
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{new Date(comment.createdAt).toLocaleString()}
								</p>
							</div>
						</div>
					))}
				</ScrollArea>
				<div className="flex space-x-2">
					<Input
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Add a comment..."
					/>
					<Button onClick={handleAddComment} disabled={!newComment.trim()}>
						Send
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const renderInstructorComments = () => {
		const studentsWithComments =
			comments.length > 0
				? comments
				: [
						{
							student: {
								userId: "default",
								firstname: "No",
								lastname: "Students"
							},
							comments: []
						}
					];

		return (
			<Card className="bg-card">
				<CardHeader>
					<CardTitle className="text-lg font-semibold">
						Student Comments
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
					>
						{!selectedStudentForChat ? (
							<div className="flex flex-wrap justify-center gap-4">
								{studentsWithComments.map((chain) => (
									<div
										key={chain.student.userId}
										className="cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
										onClick={() => handleStudentSelect(chain)}
									>
										<Card className="flex flex-col min-w-[300px] justify-center items-center text-center p-3">
											<Avatar className="mx-auto mb-2">
												<AvatarFallback>{`${chain.student.firstname[0]}${chain.student.lastname[0]}`}</AvatarFallback>
											</Avatar>
											<p className="font-semibold">{`${chain.student.firstname} ${chain.student.lastname}`}</p>
										</Card>
									</div>
								))}
							</div>
						) : (
							<div>
								<ScrollArea className="h-[300px] mb-4" ref={scrollAreaRef}>
									{selectedStudentForChat.comments.length > 0 ? (
										selectedStudentForChat.comments.map((comment) => (
											<div
												key={comment.commentId}
												className={`flex items-start space-x-2 mb-4 ${comment.user.role === "INSTRUCTOR" ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`flex flex-col ${comment.user.role === "INSTRUCTOR" ? "items-end" : "items-start"}`}
												>
													<div className="flex items-center space-x-2 mb-1">
														<Avatar className="h-6 w-6">
															<AvatarFallback className="text-xs">{`${comment.user.firstname[0]}${comment.user.lastname[0]}`}</AvatarFallback>
														</Avatar>
														<p className="text-sm font-semibold">{`${comment.user.firstname} ${comment.user.lastname}`}</p>
													</div>
													<div
														className={`bg-slate-100 rounded-lg p-2 max-w-[80%] ${comment.user.role === "INSTRUCTOR" ? "rounded-tr-none" : "rounded-tl-none"}`}
													>
														<p className="text-sm">{comment.content}</p>
													</div>
													<p className="text-xs text-muted-foreground mt-1">
														{new Date(comment.createdAt).toLocaleString()}
													</p>
												</div>
											</div>
										))
									) : (
										<p>No comments yet.</p>
									)}
								</ScrollArea>
								<div className="flex space-x-2">
									<Input
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										placeholder="Add a comment..."
									/>
									<Button
										onClick={handleAddComment}
										disabled={!newComment.trim()}
									>
										Send
									</Button>
								</div>
								<Button
									// onClick={() => handleStudentSelect(null)} // Animation for going back to student selection was a bit buggy
									onClick={() => window.location.reload()}
									variant="outline"
									className="mt-4"
								>
									<ArrowLeft className="h-4 w-4 mr-2" />
									Back to Students
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		);
	};

	const getInfoContent = () => {
		if (user.role === 'STUDENT') {
		  return {
			title: "Assignment Overview",
			description: (
			  <>
				<p>This page allows you to view and interact with your assignment:</p>
				<ul className="list-disc list-inside mt-2">
				  <li>View assignment details and instructions</li>
				  <li>See the due date and submission requirements</li>
				  <li>Submit your work (if the deadline hasn't passed)</li>
				  <li>View your submitted work and grades (if available)</li>
				  <li>Communicate with your instructor through comments</li>
				</ul>
				<p className="mt-2">Use the tabs at the top to switch between viewing the assignment and submitting your work.</p>
			  </>
			)
		  };
		} else if (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') {
		  switch (currentView) {
			case 'view':
			  return {
				title: "Assignment Overview (Instructor View)",
				description: (
				  <>
					<p>As an instructor, you can manage all aspects of this assignment:</p>
					<ul className="list-disc list-inside mt-2">
					  <li>View the full assignment details</li>
					  <li>Edit the assignment using the 'Edit Assignment' tab</li>
					  <li>View and grade student submissions using the 'View Submissions' tab</li>
					  <li>Communicate with students through comments</li>
					  <li>Extend deadlines for individual students if needed</li>
					</ul>
					<p className="mt-2">Use the tabs at the top to access different functions.</p>
				  </>
				)
			  };
			case 'edit':
			  return {
				title: "Edit Assignment",
				description: (
				  <>
					<p>Here you can modify the assignment details:</p>
					<ul className="list-disc list-inside mt-2">
					  <li>Update the title, description, and due date</li>
					  <li>Change the maximum number of submission attempts</li>
					  <li>Modify the category and rubric</li>
					  <li>Adjust allowed file types for submissions</li>
					  <li>Upload or replace assignment files</li>
					  <li>Extend deadlines for specific students</li>
					</ul>
					<p className="mt-2">Remember to save your changes after editing.</p>
				  </>
				)
			  };
			case 'submissions':
			  return {
				title: "View Submissions",
				description: (
				  <>
					<p>Manage and review student submissions:</p>
					<ul className="list-disc list-inside mt-2">
					  <li>See a list of all student submissions</li>
					  <li>View submission details and downloaded files</li>
					  <li>Grade submissions using the assigned rubric</li>
					  <li>Provide feedback and comments to students</li>
					  <li>Track late submissions and extended deadlines</li>
					</ul>
					<p className="mt-2">Use the table to sort and filter submissions as needed.</p>
				  </>
				)
			  };
			default:
			  return {
				title: "Assignment Management",
				description: "Select a tab to view or manage different aspects of this assignment."
			  };
		  }
		}
	  };

	return (
		<div className="container mx-auto px-4">
			<Card className="mb-8 bg-card">
				<CardHeader>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center ">
							<div className="flex rounded-lg mr-2">
								<Button
									onClick={handleBackClick}
									variant="ghost"
									className="h-8 w-8"
								>
									<ArrowLeft className="h-5 w-5" />
								</Button>
							</div>
							<div className="flex flex-col justify-center space-y-1">
								<CardTitle className="text-2xl font-bold w-full">
									{assignment.title}
								</CardTitle>
								<CardDescription>{assignment.description}</CardDescription>
							</div>
						</div>
						<div className="text-right">
							<span className="text-md font-semibold">
								Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
							</span>
							<p className="text-sm italic bg-slate-200 p-1 px-2 rounded">
								Assignments are due by 11:59 PM on the day before the listed
								date.
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			<Tabs defaultValue="view" className="space-y-4" onValueChange={(value) => setCurrentView(value)}>
				{(user.role !== "STUDENT" ||
					new Date(assignment.dueDate) >= new Date()) && (
					<TabsList className="bg-muted">
						<TabsTrigger value="view">View Assignment</TabsTrigger>
						{user.role !== "STUDENT" && (
							<TabsTrigger value="edit">Edit Assignment</TabsTrigger>
						)}
						{user.role !== "STUDENT" && (
							<TabsTrigger value="submissions">View Submissions</TabsTrigger>
						)}
						{user.role === "STUDENT" && (
							<TabsTrigger value="submission">Submit Assignment</TabsTrigger>
						)}
					</TabsList>
				)}

				<TabsContent value="view">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="rounded-md flex justify-center lg:col-span-2">
							{assignment?.assignmentFilePath ? (
								isPDF ? (
									<PDFViewer url={assignment.assignmentFilePath} scale="0.93" />
								) : (
									<NonPDFFileDownload
										url={assignment.assignmentFilePath}
										fileName={assignment.assignmentFilePath.split("/").pop()}
									/>
								)
							) : (
								<div className="flex items-center justify-center h-full">
									<p>No assignment file available</p>
								</div>
							)}
						</div>

						<div className="space-y-6">
							{user.role === "STUDENT" && (
								<Card className="bg-card">
									<CardHeader>
										<CardTitle className="text-lg font-semibold">
											Submission Details:
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between items-center space-x-2">
											<span>Status:</span>
											{submissions.length > 0 ? (
												<Badge variant="approved">Submitted</Badge>
											) : (
												<div>
													{new Date(assignment.dueDate) < new Date() ? (
														<Badge variant="destructive">Missing</Badge>
													) : (
														<Badge variant="outline" className="bg-warning/30">
															Not Submitted
														</Badge>
													)}
												</div>
											)}
										</div>
										<Separator className="my-4" />
										<div className="flex justify-between items-center space-x-2">
											<span>Allowed File Types:</span>
											<div className="flex flex-wrap justify-end">
												{assignment.allowedFileTypes &&
												assignment.allowedFileTypes.length > 0 ? (
													assignment.allowedFileTypes.map((fileType, index) => (
														<Badge
															key={index}
															variant="outline"
															className="ml-2 mb-2 bg-warning/30"
														>
															{fileType.toUpperCase()}
														</Badge>
													))
												) : (
													<span className="text-muted-foreground">
														No specific file types set
													</span>
												)}
											</div>
										</div>
										{submissions.length > 0 && (
											<div>
												<Separator className="my-4" />
												<div className="flex justify-between items-center space-x-2">
													<span>Last Submitted On:</span>
													<span className="text-end">
														{new Date(
															submissions[0].createdAt
														).toLocaleString()}
													</span>
												</div>
												<Separator className="my-4" />
												<div className="flex justify-between items-center space-x-2">
													<span>Submissions:</span>
													<div className="flex flex-col">
														{submissions
															.sort(
																(a, b) =>
																	new Date(b.createdAt) - new Date(a.createdAt)
															)
															.map((submission, index) => (
																<Button
																	onClick={() => {
																		setSelectedSubmission(submission);
																		setViewDialogOpen(true);
																	}}
																	key={submission.submissionId}
																	variant="ghost"
																	className="flex items-center space-x-2"
																>
																	<FileText className="h-5 w-5" />
																	<span>
																		Attempt {submissions.length - index}
																	</span>
																</Button>
															))}
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							)}

							{user.role === "STUDENT"
								? renderStudentComments()
								: renderInstructorComments()}
						</div>
					</div>
				</TabsContent>

				{user.role !== "STUDENT" && (
					<>
						<TabsContent value="edit">
							<EditAssignment assignment={assignment} />
						</TabsContent>
						<TabsContent value="submissions">
							<Submissions
								assignmentId={assignmentId}
								assignment={assignment}
							/>
						</TabsContent>
					</>
				)}

				{user.role === "STUDENT" && (
					<TabsContent value="submission">
						<Submission
							assignmentId={assignmentId}
							refresh={refreshToggle}
							assignment={assignment}
						/>
					</TabsContent>
				)}
			</Tabs>
			<ViewSubmissionDialog
				submission={selectedSubmission}
				open={viewDialogOpen}
				onClose={() => setViewDialogOpen(false)}
				onDownload={handleDownload}
			/>
			<InfoButton content={getInfoContent()} />

		</div>
	);
};

export default Assignment;
