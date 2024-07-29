import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";
import ReviewComponent from "@/components/review/ReviewComponent";

const ViewAllReviews = () => {
	const { user } = useUser();
	const { submissionId } = useParams();
	const [instructorReview, setInstructorReview] = useState(null);
	const [peerReviews, setPeerReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [instructorReviewRes, peerReviewsRes] = await Promise.all([
					reviewAPI.getInstructorReview(submissionId),
					reviewAPI.getPeerReviews(submissionId)
				]);
				setInstructorReview(instructorReviewRes.data);
				setPeerReviews(peerReviewsRes.data);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast({
					title: "Error",
					description:
						error.message || "Failed to fetch submission and review details",
					variant: "destructive"
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [submissionId]);

	const calculateGradePercentage = (review) => {
		if (
			!review ||
			!review.criterionGrades ||
			!review.submission ||
			!review.submission.assignment ||
			!review.submission.assignment.rubric
		) {
			console.warn("Review or rubric data is missing", review);
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

	const calculateAveragePeerGrade = () => {
		if (peerReviews.length === 0) return 0;
		const totalPercentage = peerReviews.reduce(
			(sum, review) => sum + parseFloat(calculateGradePercentage(review)),
			0
		);
		return (totalPercentage / peerReviews.length).toFixed(2);
	};

	if (loading) {
		return <div className="text-center text-slate-600">Loading...</div>;
	}

	return (
		<div className="w-full">
			<div className="flex items-center space-x-4 mb-4">
				<Button
					variant="ghost"
					onClick={() => navigate(-1)}
					className="text-xl text-primary flex items-center"
				>
					<ChevronLeft className="h-6 w-6 mr-2" />
				</Button>
				<h1 className="text-2xl font-bold text-primary">Review Details</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					{user.role !== "INSTRUCTOR" && instructorReview ? (
						<Card className="mb-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300">
							<CardHeader className="bg-slate-50">
								<CardTitle className="text-primary">
									Instructor Review: {instructorReview.reviewer.firstname}{" "}
									{instructorReview.reviewer.lastname}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ReviewComponent review={instructorReview} />
							</CardContent>
						</Card>
					) : (
						<Card className="mb-6 border border-slate-200">
							<CardContent className="p-4 text-center text-slate-600">
								No instructor review available yet.
							</CardContent>
						</Card>
					)}

					{peerReviews.length > 0 ? (
						peerReviews.map((review, index) => (
							<Card
								key={index}
								className="mb-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
							>
								<CardHeader className="bg-slate-50">
									<CardTitle className="text-primary">
										{!review.submission.assignment.isPeerReviewAnonymous
											? `Peer Review for ${review.reviewer.firstname} ${review.reviewer.lastname}`
											: `Peer Review ${index + 1}`}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ReviewComponent review={review} />
								</CardContent>
							</Card>
						))
					) : (
						<Card className="mb-6 border border-slate-200">
							<CardContent className="p-4 text-center text-slate-600">
								No peer reviews available yet.
							</CardContent>
						</Card>
					)}
				</div>

				<div className="space-y-6">
					<Card className="border border-slate-200 hover:shadow-lg transition-shadow duration-300">
						<CardHeader className="bg-slate-50">
							<CardTitle className="text-primary">Grade Summary</CardTitle>
						</CardHeader>
						<CardContent className="p-4">
							<div className="space-y-4">
								{instructorReview && (
									<div>
										<h3 className="font-semibold text-slate-700">
											Instructor Grade
										</h3>
										<Progress
											value={parseFloat(
												calculateGradePercentage(instructorReview)
											)}
											className="h-2 mt-2"
										/>
										<p className="text-sm mt-1 text-slate-600">
											{calculateGradePercentage(instructorReview)}%
										</p>
									</div>
								)}
								{peerReviews.length > 0 && (
									<div>
										<h3 className="font-semibold text-slate-700">
											Average Peer Grade
										</h3>
										<Progress
											value={parseFloat(calculateAveragePeerGrade())}
											className="h-2 mt-2"
										/>
										<p className="text-sm mt-1 text-slate-600">
											{calculateAveragePeerGrade()}%
										</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ViewAllReviews;
