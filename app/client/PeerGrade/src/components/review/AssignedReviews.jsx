import React, { useState, useMemo } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, ChevronDown, ChevronUp, Check } from "lucide-react";
import GradeReviewDialog from "./GradeReviewDialog";
import ViewSubmissionDialog from "@/components/assign/assignment/submission/ViewSubmissionDialog";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const AssignedReviews = ({ assignedReviews, onViewDetails, onUpdate }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedAssignments, setExpandedAssignments] = useState({});
	const [selectedReview, setSelectedReview] = useState(null);
	const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);

	const groupedReviews = useMemo(() => {
		return assignedReviews.reduce((acc, review) => {
			const assignmentId = review.submission.assignment.assignmentId;
			if (!acc[assignmentId]) {
				acc[assignmentId] = {
					assignment: review.submission.assignment,
					reviews: []
				};
			}
			acc[assignmentId].reviews.push(review);
			return acc;
		}, {});
	}, [assignedReviews]);

	const filteredAssignments = useMemo(() => {
		return Object.values(groupedReviews).filter(
			(group) =>
				group.assignment.title
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				group.assignment.classes.classname
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
		);
	}, [groupedReviews, searchTerm]);

	const toggleExpanded = (assignmentId) => {
		setExpandedAssignments((prev) => ({
			...prev,
			[assignmentId]: !prev[assignmentId]
		}));
	};

	const calculatePercentageGrade = (review) => {
		console.log("Review object:", JSON.stringify(review, null, 2));
		if (!review.criterionGrades || review.criterionGrades.length === 0) {
			return "Not graded";
		}
		const totalGrade = review.criterionGrades.reduce(
			(total, cg) => total + (cg.grade || 0),
			0
		);
		const rubric = review.submission.assignment.rubric;
		const totalMaxPoints = rubric
			? rubric.criteria.reduce(
					(total, criterion) => total + (criterion.maxMark || 0),
					0
				)
			: 0;
		return totalMaxPoints > 0
			? `${((totalGrade / totalMaxPoints) * 100).toFixed(2)}%`
			: "0%";
	};

	const handleViewDialogOpen = (review) => {
		setSelectedReview(review);
		setViewDialogOpen(true);
	};

	const handleGradeReview = (review) => {
		setSelectedReview(review);
		setGradeDialogOpen(true);
	};

	const handleGradeSubmit = async (event) => {
		event.preventDefault();

		if (!selectedReview) {
			console.error("No review selected");
			toast({
				title: "Error",
				description: "No review selected. Please try again.",
				variant: "destructive"
			});
			return;
		}

		const formData = new FormData(event.target);
		let totalMark = 0;
		const criterionGrades = [];

		const rubric = selectedReview.submission.assignment.rubric;

		if (rubric && rubric.criteria) {
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
		} else {
			console.error("Rubric or criteria not found");
			toast({
				title: "Error",
				description: "Rubric information is missing. Please try again.",
				variant: "destructive"
			});
			return;
		}

		try {
			const updatedReviewData = {
				reviewGrade: totalMark,
				criterionGrades: criterionGrades
			};

			const response = await reviewAPI.updateReview(
				selectedReview.reviewId,
				updatedReviewData
			);

			const updatedAssignedReviews = assignedReviews.map((review) =>
				review.reviewId === selectedReview.reviewId ? response.data : review
			);

			setGradeDialogOpen(false);
			setSelectedReview(null);

			// Call onUpdate to refresh the data
			await onUpdate();

			toast({
				title: "Success",
				description: "Review graded successfully",
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

	const renderAssignmentCard = (group) => {
		const { assignment, reviews } = group;
		const isExpanded = expandedAssignments[assignment.assignmentId];

		return (
			<Card
				key={assignment.assignmentId}
				className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 mb-4"
			>
				<CardHeader className="pb-2">
					<div className="flex justify-between items-center">
						<CardTitle className="text-lg font-semibold text-primary">
							Reviews for {assignment.title}
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => toggleExpanded(assignment.assignmentId)}
						>
							{isExpanded ? (
								<ChevronUp className="h-4 w-4" data-testid='expander-close' />
							) : (
								<ChevronDown className="h-4 w-4" data-testid='expander-open' />
							)}
						</Button>
					</div>
					<CardDescription className="text-sm text-slate-500">
						{assignment.classes.classname}
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
						<Calendar className="h-4 w-4" />
						<span>
							Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
						</span>
					</div>
					<div className="flex flex-wrap gap-2 mt-2">
						<Badge variant="outline" className="bg-blue-100 text-blue-800">
							<Check className="h-3 w-3 mr-1" />
							{reviews.length} Assigned Review{reviews.length !== 1 ? "s" : ""}
						</Badge>
					</div>
				</CardContent>
				<div
					className={`overflow-hidden transition-all duration-300 ease-in-out ${
						isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<CardContent className="bg-slate-50 rounded-xl mt-2">
						{reviews.map((review, index) => (
							<div
								key={review.reviewId}
								className="mb-2 p-3 bg-white rounded-lg shadow-sm"
							>
								<div className="flex justify-between items-center">
									{review.submission.assignment.isPeerReviewAnonymous ? (
										<p className="font-semibold">Peer Review {index + 1}</p>
									) : (
										<p className="font-semibold">
											Peer Review for {review.reviewee.firstname}{" "}
											{review.reviewee.lastname}
										</p>
									)}
									<Badge variant="secondary" className="ml-2">
										{calculatePercentageGrade(review)}
									</Badge>
								</div>

								<div className="mt-2">
									<Button
										variant="outline"
										size="sm"
										className="mr-2"
										onClick={() => handleGradeReview(review)}
									>
										{review.criterionGrades && review.criterionGrades.length > 0
											? "Re-grade"
											: "Grade"}
									</Button>
									<Button
										variant="link"
										size="sm"
										className="p-0 h-auto mr-4"
										onClick={() => onViewDetails(review, true)}
									>
										View Grade Details
									</Button>
									<Button
										variant="link"
										size="sm"
										className="p-0 h-auto mr-4"
										onClick={() => handleViewDialogOpen(review, true)}
									>
										View Student Submission
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</div>
			</Card>
		);
	};

	return (
		<div>
			<div className="relative w-full md:w-1/3 mb-4">
				<Input
					type="text"
					placeholder="Search assignments..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="pl-10 bg-white border-slate-200"
				/>
				<Search className="absolute top-2.5 left-3 h-5 w-5 text-slate-400" />
			</div>

			{filteredAssignments.map(renderAssignmentCard)}

			{filteredAssignments.length === 0 && (
				<div className="text-center text-slate-500 mt-8">
					No assigned reviews found.
				</div>
			)}

			<GradeReviewDialog
				review={selectedReview}
				open={gradeDialogOpen}
				onClose={() => setGradeDialogOpen(false)}
				onGradeSubmit={handleGradeSubmit}
			/>

			<ViewSubmissionDialog
				submission={selectedReview?.submission}
				rubric={selectedReview?.submission?.assignment?.rubric}
				open={viewDialogOpen}
				onClose={() => setViewDialogOpen(false)}
			/>
		</div>
	);
};

export default AssignedReviews;
