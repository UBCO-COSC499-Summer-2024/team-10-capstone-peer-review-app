import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, ChevronDown } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import PDFViewer from "@/components/assign/PDFViewer";
import { Input } from "@/components/ui/input";

const Submissions = ({ assignmentId }) => {
	const { classId } = useParams();
	const [studentsWithSubmissions, setStudentsWithSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [rubrics, setRubrics] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

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

				const studentsWithSubmissionStatus = studentsResponse.data.map(
					(student) => ({
						userId: student.userId,
						name: `${student.firstname} ${student.lastname}`,
						submissions: submissionsMap[student.userId] || [],
						hasSubmitted: !!submissionsMap[student.userId]
					})
				);

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

			// Calculate the total points for all rubrics
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

	const handleGradeSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		let totalMark = 0;

		for (let [key, value] of formData.entries()) {
			totalMark += parseFloat(value) || 0;
		}

		const finalScore = (totalMark / totalPoints) * 100;

		console.log("Final Mark:", totalMark);
		console.log("Final Score:", finalScore);

		// Here you would call your API to submit the grades
		// Don't implement this part yet as per your request
	};

	const retrieveLatestSubmissionGrade = (submissions) => {
		const latestSubmission = submissions.reduce((acc, submission) => {
			if (
				!acc ||
				new Date(submission.submissionDate) > new Date(acc.submissionDate)
			) {
				return submission;
			}
			return acc;
		}, null);

		return latestSubmission ? latestSubmission.grade : null;
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
										{retrieveLatestSubmissionGrade(student.submissions)
											? retrieveLatestSubmissionGrade(
													student.submissions
												).toFixed(2)
											: "N/A"}
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
														>
															<Download className="h-4 w-4 mr-1" />
															Download
														</Button>
														<Dialog>
															<DialogTrigger asChild>
																<Button
																	variant="outline"
																	size="sm"
																	className="ml-2"
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
																					(criterion, criterionIndex) => (
																						<div
																							key={criterionIndex}
																							className="mb-4"
																						>
																							<Label className="text-md font-semibold">
																								{criterion.title}
																							</Label>
																							{criterion.criterionRatings.map(
																								(rating, ratingIndex) => (
																									<div
																										key={ratingIndex}
																										className="mt-2 flex items-center justify-between"
																									>
																										<span className="text-sm flex-grow">
																											{rating.description}
																										</span>
																										<Input
																											type="number"
																											min="0"
																											max={rating.points}
																											name={`rating-${criterion.criterionId}-${rating.ratingId}`}
																											defaultValue="0"
																											className="w-[80px] ml-2"
																										/>
																										<span className="text-sm ml-2">
																											/ {rating.points}
																										</span>
																									</div>
																								)
																							)}
																						</div>
																					)
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
		</Card>
	);
};

export default Submissions;
