import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const GradeReviewDialog = ({ review, open, onClose, onGradeSubmit }) => {
	const assignment = review?.submission?.assignment;
	const rubric = assignment?.rubric;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-lg h-[80vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>Grade Peer Review</DialogTitle>
				</DialogHeader>
				<form onSubmit={onGradeSubmit} className="flex-1 overflow-auto">
					{!rubric && (
						<div className="text-center text-gray-500 text-sm">
							No rubric was found. Please assign a rubric to this assignment
							before grading it.
						</div>
					)}
					{rubric && (
						<div>
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>{rubric.title}</CardTitle>
								</CardHeader>
								<CardContent>
									{rubric.criteria.map((criterion, criterionIndex) => {
										const criterionGrade = review?.criterionGrades?.find(
											(cg) => cg.criterionId === criterion.criterionId
										);
										const maxRatingPoints = Math.max(
											...criterion.criterionRatings.map(
												(rating) => rating.points
											)
										);
										return (
											<div key={criterionIndex} className="mb-6 last:mb-0">
												<Label className="text-lg font-semibold mb-2 block">
													{criterion.title}
												</Label>
												<div className="bg-gray-50 p-4 rounded-md mb-4">
													{criterion.criterionRatings.map(
														(rating, ratingIndex) => (
															<div
																key={ratingIndex}
																className="flex justify-between items-center mb-2 last:mb-0"
															>
																<span className="text-sm flex-1 mr-4">
																	{rating.description}
																</span>
																<Badge variant="outline">
																	{rating.points} pts
																</Badge>
															</div>
														)
													)}
												</div>
												<div className="flex items-center justify-between mt-2">
													<Label
														htmlFor={`grade-${criterion.criterionId}`}
														className="mr-2"
													>
														Grade:
													</Label>
													<div className="flex items-center">
														<Input
															id={`grade-${criterion.criterionId}`}
															type="number"
															min="0"
															max={maxRatingPoints}
															name={`grade-${criterion.criterionId}`}
															defaultValue={criterionGrade?.grade || 0}
															className="w-[80px] mr-2"
														/>
														<span className="text-sm">/ {maxRatingPoints}</span>
													</div>
												</div>
												<Textarea
													name={`comment-${criterion.criterionId}`}
													placeholder="Add a comment for this criterion"
													className="mt-2"
													defaultValue={criterionGrade?.comment || ""}
												/>
											</div>
										);
									})}
								</CardContent>
							</Card>
							<Button type="submit" className="mt-4">
								Submit Grades
							</Button>
						</div>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default GradeReviewDialog;
