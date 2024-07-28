import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";

const AssignedPR = () => {
	const { user } = useUser();
	const { submissionId } = useParams();
	const [instructorReview, setInstructorReview] = useState(null);
	const [peerReviews, setPeerReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user || !user.userId) {
			console.error("User ID is undefined");
			toast({
				title: "Error",
				description: "User information is not available",
				variant: "destructive"
			});
			setLoading(false);
			return;
		}

		const fetchData = async () => {
			try {
				// Fetch reviews using the found submission ID
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

		// Check if rubric is an array or a single object
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

	const renderReview = (review, isInstructor = false) => {
		if (!review || !review.criterionGrades) {
			console.warn("Review data is missing", review);
			return <div>No review data available</div>;
		}

		return (
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1">
					<AccordionTrigger className="bg-slate-100 hover:bg-slate-200 p-4 rounded-t-lg">
						<span className="font-semibold text-lg text-primary">
							Grade: {calculateGradePercentage(review)}%
						</span>
					</AccordionTrigger>
					<AccordionContent className="bg-white p-4 rounded-b-lg">
						<ScrollArea className="h-[60vh] pr-4">
							{review.criterionGrades.map((criterionGrade, index) => (
								<Card key={index} className="mb-6 border border-slate-200">
									<CardContent className="p-4">
										<CardTitle className="text-lg mb-3 text-primary">
											{criterionGrade.criterion?.title || "Unnamed Criterion"}
										</CardTitle>
										<div className="mb-6 bg-slate-50 p-4 rounded-lg">
											<h3 className="text-md font-semibold mb-2 text-slate-700">
												{criterionGrade.criterion?.title || "Unnamed Criterion"}
											</h3>
											{criterionGrade.criterion?.criterionRatings && (
												<div className="mt-2 space-y-2">
													{criterionGrade.criterion.criterionRatings.map(
														(rating, ratingIndex) => (
															<div
																key={ratingIndex}
																className="bg-white p-3 rounded-md border border-slate-100"
															>
																<p className="text-sm flex flex-col text-slate-600">
																	<span className="font-medium text-primary underline">
																		{rating.points} points:
																	</span>{" "}
																	{rating.description}
																</p>
															</div>
														)
													)}
												</div>
											)}
											<Separator className="my-4" />
											<div className="flex justify-between items-center mb-2">
												<span className="text-sm font-medium text-slate-700">
													Grade:
												</span>
												<Badge variant="secondary" className="text-primary">
													{criterionGrade.grade} /{" "}
													{criterionGrade.criterion?.maxMark || "N/A"}
												</Badge>
											</div>
											<Progress
												value={
													criterionGrade.criterion?.maxMark
														? (criterionGrade.grade /
																criterionGrade.criterion.maxMark) *
															100
														: 0
												}
												className="h-2 mb-2"
											/>
											<Separator className="my-4" />
											<p className="text-sm text-wrap bg-white p-3 rounded-md mt-2 text-slate-600">
												<span className="font-semibold text-primary">
													Comment:{" "}
												</span>
												{criterionGrade.comment || "No comment provided."}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</ScrollArea>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		);
	};

	if (loading) {
		return <div className="text-center text-slate-600">Loading...</div>;
	}

	return (
		<div className="w-ful ">
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
					{instructorReview && (
						<Card className="mb-6 border border-slate-200">
							<CardHeader className="bg-slate-50">
								<CardTitle className="text-primary">
									Instructor Review
								</CardTitle>
							</CardHeader>
							<CardContent>{renderReview(instructorReview, true)}</CardContent>
						</Card>
					)}

					{peerReviews.map((review, index) => (
						<Card key={index} className="mb-6 border border-slate-200">
							<CardHeader className="bg-slate-50">
								<CardTitle className="text-primary">
									Peer Review {index + 1}
								</CardTitle>
							</CardHeader>
							<CardContent>{renderReview(review)}</CardContent>
						</Card>
					))}
				</div>

				<div className="space-y-6">
					<Card className="border border-slate-200">
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
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AssignedPR;
