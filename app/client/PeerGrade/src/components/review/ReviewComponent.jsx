// Component for displaying a review Card


import React from "react";
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
import { Card, CardTitle, CardContent } from "@/components/ui/card";

const ReviewComponent = ({ review }) => {
	if (!review) {
		console.warn("Review data is missing", review);
		return <div>No review data available</div>;
	}

	// Check if the review has grades
	const hasGrades = review.criterionGrades && review.criterionGrades.length > 0;

	// Calculate the percentage grade for a review
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

	// Render the component based on the review data
	if (!hasGrades) {
		return (
			<div className="bg-slate-100 p-4 rounded-lg">
				<span className="font-semibold text-lg text-primary">
					Not completed
				</span>
			</div>
		);
	}

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger className="bg-slate-100 hover:bg-slate-200 p-4 rounded-t-lg">
					<span className="font-semibold text-lg text-primary">
						Grade: {calculateGradePercentage(review)}%
					</span>
				</AccordionTrigger>
				<AccordionContent className="bg-white p-4 rounded-b-lg shadow-md">
					<ScrollArea className="h-[60vh] pr-4">
						{review.criterionGrades.map((criterionGrade, index) => (
							<Card
								key={index}
								className="mb-6 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
							>
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
															className="bg-white p-3 rounded-md border border-slate-100 hover:border-primary transition-colors duration-300"
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

export default ReviewComponent;
