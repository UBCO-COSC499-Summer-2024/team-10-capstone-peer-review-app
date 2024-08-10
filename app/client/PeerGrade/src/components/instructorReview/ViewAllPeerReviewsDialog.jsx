// Breif Decription: This component displays a dialog with all peer reviews for a submission. 
// It shows the average peer grade, and allows the user to view the peer reviews.

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReviewComponent from "@/components/review/ReviewComponent";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";

const ViewAllPeerReviewsDialog = ({ submissionId, open, onClose }) => {
	const { user } = useUser();
	const [peerReviews, setPeerReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	const isInstructor = user.role === "INSTRUCTOR";

	// Fetch the peer reviews when the dialog is opened and the submission ID changes
	useEffect(() => {
		if (open && submissionId) {
			fetchPeerReviews();
		}
	}, [open, submissionId]);

	// Fetch the peer reviews for the submission ID
	const fetchPeerReviews = async () => {
		try {
			setLoading(true);
			const response = await reviewAPI.getPeerReviews(submissionId);
			setPeerReviews(response.data);
		} catch (error) {
			console.error("Error fetching peer reviews:", error);
			toast({
				title: "Error",
				description: "Failed to fetch peer reviews",
				variant: "destructive"
			});
		} finally {
			setLoading(false);
		}
	};

	// Calculate the grade percentage for a review
	const calculateGradePercentage = (review) => {
		if (
			!review ||
			!review.criterionGrades ||
			!review.submission ||
			!review.submission.assignment ||
			!review.submission.assignment.rubric
		) {
			return 0;
		}
		const totalGrade = review.criterionGrades.reduce(
			(total, cg) => total + (cg.grade || 0),
			0
		);
		const rubric = review.submission.assignment.rubric;
		let totalMaxPoints = 0;

		if (Array.isArray(rubric)) {
			totalMaxPoints = rubric.reduce(
				(total, r) => total + (r.totalMarks || 0),
				0
			);
		} else if (rubric.criteria) {
			totalMaxPoints = rubric.criteria.reduce(
				(total, criterion) => total + (criterion.maxMark || 0),
				0
			);
		} else if (rubric.totalMarks) {
			totalMaxPoints = rubric.totalMarks;
		}

		return totalMaxPoints > 0
			? ((totalGrade / totalMaxPoints) * 100).toFixed(2)
			: 0;
	};

	// Calculate the average peer grade
	const calculateAveragePeerGrade = () => {
		const filteredReviews = peerReviews.filter(
			review => review.criterionGrades && review.criterionGrades.length > 0
		);
	
		if (filteredReviews.length === 0) return 0;
	
		const totalPercentage = filteredReviews.reduce(
			(sum, review) => sum + parseFloat(calculateGradePercentage(review)),
			0
		);
	
		return (totalPercentage / filteredReviews.length).toFixed(2);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>All Peer Reviews</DialogTitle>
				</DialogHeader>
				{loading ? (
					<div className="text-center">Loading peer reviews...</div>
				) : (
					<>
						<ScrollArea className="h-[75vh]">
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Grade Summary</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold">Average Peer Grade</h3>
											<Progress
												value={parseFloat(calculateAveragePeerGrade())}
												className="h-2 mt-2"
											/>
											<p className="text-sm mt-1">
												{calculateAveragePeerGrade()}%
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
							{peerReviews.map((review, index) => (
								<Card key={index} className="mb-6">
									<CardHeader>
										{isInstructor ||
										!review.submission.assignment.isPeerReviewAnonymous ? (
											<CardTitle>
												{review.reviewer.firstname} {review.reviewer.lastname}
											</CardTitle>
										) : (
											<CardTitle>Peer Review {index + 1}</CardTitle>
										)}
									</CardHeader>
									<CardContent>
										<ReviewComponent review={review} />
									</CardContent>
								</Card>
							))}
						</ScrollArea>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ViewAllPeerReviewsDialog;
