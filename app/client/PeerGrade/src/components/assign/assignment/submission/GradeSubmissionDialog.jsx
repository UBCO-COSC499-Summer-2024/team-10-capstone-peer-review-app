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

const GradeSubmissionDialog = ({
	submission,
	rubrics,
	open,
	onClose,
	onGradeSubmit
}) => (
	<Dialog open={open} onOpenChange={onClose}>
		<DialogContent className="max-w-4xl h-[80vh]">
			<DialogHeader>
				<DialogTitle>Grade Assignment</DialogTitle>
			</DialogHeader>
			<form onSubmit={onGradeSubmit} className="flex-1 overflow-auto">
				{rubrics.length === 0 && (
					<div className="text-center text-gray-500 text-sm">
						No rubrics were found. Please assign a rubric to this assignment
						before grading it.
					</div>
				)}
				{rubrics?.map((rubric, rubricIndex) => (
					<div>
						<Card key={rubricIndex} className="mb-6">
							<CardHeader>
								<CardTitle>{rubric.title}</CardTitle>
							</CardHeader>
							<CardContent>
								{rubric.criteria.map((criterion, criterionIndex) => {
									const totalRatingPoints = criterion.criterionRatings.reduce(
										(sum, rating) => sum + rating.points,
										0
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
														max={totalRatingPoints}
														name={`grade-${criterion.criterionId}`}
														defaultValue="0"
														className="w-[80px] mr-2"
													/>
													<span className="text-sm">/ {totalRatingPoints}</span>
												</div>
											</div>
											<Textarea
												name={`comment-${criterion.criterionId}`}
												placeholder="Add a comment for this criterion"
												className="mt-2"
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
				))}
			</form>
		</DialogContent>
	</Dialog>
);

export default GradeSubmissionDialog;
