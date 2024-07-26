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
	const rubrics = assignment?.rubric || [];

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl h-[80vh]">
				<DialogHeader>
					<DialogTitle>Grade Peer Review</DialogTitle>
				</DialogHeader>
				<form onSubmit={onGradeSubmit} className="flex-1 overflow-auto">
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>{assignment?.title}</CardTitle>
						</CardHeader>
						<CardContent>
							{rubrics.map((rubricForAssignment, rubricIndex) => (
								<div
									key={rubricForAssignment.rubricId}
									className="mb-6 last:mb-0"
								>
									<h3 className="text-xl font-bold mb-4">
										Rubric {rubricIndex + 1}: {rubricForAssignment.rubric.title}
									</h3>
									{rubricForAssignment.rubric.criteria.map((criterion) => {
										const criterionGrade = review?.criterionGrades?.find(
											(cg) => cg.criterionId === criterion.criterionId
										);
										return (
											<div
												key={criterion.criterionId}
												className="mb-6 last:mb-0"
											>
												<Label className="text-lg font-semibold mb-2 block">
													{criterion.title}
												</Label>
												<div className="bg-gray-50 p-4 rounded-md mb-4">
													<h4 className="font-semibold mb-2">
														Criterion Ratings:
													</h4>
													{criterion.criterionRatings.map((rating, index) => (
														<div
															key={rating.criterionRatingId}
															className="mb-1"
														>
															<span className="font-medium">
																{rating.points} points:
															</span>{" "}
															{rating.description}
														</div>
													))}
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
															min={criterion.minMark}
															max={criterion.maxMark}
															name={`grade-${criterion.criterionId}`}
															defaultValue={criterionGrade?.grade || 0}
															className="w-[80px] mr-2"
														/>
														<span className="text-sm">
															/ {criterion.maxMark}
														</span>
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
								</div>
							))}
						</CardContent>
					</Card>
					<Button type="submit" className="mt-4">
						Submit Grades
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default GradeReviewDialog;
