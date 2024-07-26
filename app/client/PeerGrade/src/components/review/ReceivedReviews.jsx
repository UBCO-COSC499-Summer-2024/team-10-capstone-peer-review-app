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
import {
	Search,
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	Check,
	Clipboard
} from "lucide-react";

const ReceivedReviews = ({ receivedReviews, onViewDetails }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedAssignments, setExpandedAssignments] = useState({});

	const isReviewGraded = (review) => {
		return review.criterionGrades && review.criterionGrades.length > 0;
	};

	const groupedReviews = useMemo(() => {
		return receivedReviews.reduce((acc, review) => {
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
	}, [receivedReviews]);

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

	const calculatePercentageGrade = (review, assignment) => {
		if (!isReviewGraded(review)) {
			return "Not graded";
		}
		const totalGrade = review.criterionGrades.reduce(
			(total, cg) => total + cg.grade,
			0
		);
		const totalMaxPoints = assignment.rubric.reduce(
			(total, rubricForAssignment) => {
				return (
					total +
					rubricForAssignment.rubric.criteria.reduce(
						(rubricTotal, criterion) => rubricTotal + criterion.maxMark,
						0
					)
				);
			},
			0
		);
		return totalMaxPoints > 0
			? `${((totalGrade / totalMaxPoints) * 100).toFixed(2)}%`
			: "0%";
	};

	const renderAssignmentCard = (group) => {
		const { assignment, reviews } = group;
		const isExpanded = expandedAssignments[assignment.assignmentId];
		const instructorReview = reviews.find(
			(r) => r.reviewer.role === "INSTRUCTOR"
		);
		const gradedPeerReviews = reviews.filter(
			(r) => r.reviewer.role === "STUDENT" && isReviewGraded(r)
		);
		const gradedReviews = reviews.filter(isReviewGraded);

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
						{gradedReviews.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => toggleExpanded(assignment.assignmentId)}
							>
								{isExpanded ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						)}
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
						<Badge
							variant="outline"
							className={
								instructorReview && isReviewGraded(instructorReview)
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}
						>
							{instructorReview && isReviewGraded(instructorReview) ? (
								<>
									<Check className="h-3 w-3 mr-1" />
									Instructor Reviewed
								</>
							) : (
								<>
									<Clock className="h-3 w-3 mr-1" />
									Instructor Review Pending
								</>
							)}
						</Badge>

						<Badge
							variant="outline"
							className={
								gradedPeerReviews.length > 0
									? "bg-blue-100 text-blue-800"
									: "bg-yellow-100 text-yellow-800"
							}
						>
							{gradedPeerReviews.length > 0 ? (
								<>
									<Check className="h-3 w-3 mr-1" />
									{gradedPeerReviews.length} Peer Review
									{gradedPeerReviews.length !== 1 ? "s" : ""}
								</>
							) : (
								<>
									<Clock className="h-3 w-3 mr-1" />
									Peer Reviews Pending
								</>
							)}
						</Badge>

						<Badge variant="outline" className="bg-purple-100 text-purple-800">
							<Clipboard className="h-3 w-3 mr-1" />
							{assignment.rubric.length} Rubric
							{assignment.rubric.length !== 1 ? "s" : ""}
						</Badge>
					</div>
				</CardContent>
				{gradedReviews.length > 0 && (
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out ${
							isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
						}`}
					>
						<CardContent className="bg-slate-50 rounded-xl mt-2">
							{gradedReviews.map((review, index) => (
								<div
									key={review.reviewId}
									className="mb-2 p-3 bg-white rounded-lg shadow-sm"
								>
									<div className="flex justify-between items-center">
										<p className="font-semibold">
											{review.reviewer.role === "STUDENT"
												? `Peer Review ${index + 1}`
												: "Instructor Review"}
										</p>
										<Badge variant="secondary" className="ml-2">
											{calculatePercentageGrade(review, assignment)}
										</Badge>
									</div>
									<div className="mt-2">
										<Button
											variant="link"
											size="sm"
											className="p-0 h-auto mr-4"
											onClick={() => onViewDetails(review, true)}
										>
											View in Dialog
										</Button>
										<Button
											variant="link"
											size="sm"
											className="p-0 h-auto"
											onClick={() => onViewDetails(review, false)}
										>
											View in New Page
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</div>
				)}
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
					No received reviews found.
				</div>
			)}
		</div>
	);
};

export default ReceivedReviews;
