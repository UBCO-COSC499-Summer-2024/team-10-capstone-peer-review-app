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

const GradeReviewDialog = ({ review, open, onClose, onGradeSubmit }) => (
	<Dialog open={open} onOpenChange={onClose}>
		<DialogContent className="max-w-4xl h-[80vh]">
			<DialogHeader>
				<DialogTitle>Grade Peer Review</DialogTitle>
			</DialogHeader>
			<form onSubmit={onGradeSubmit} className="flex-1 overflow-auto">
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>{review?.submission?.assignment?.title}</CardTitle>
					</CardHeader>
					<CardContent>
						{review?.criterionGrades?.map((criterionGrade, index) => (
							<div key={index} className="mb-6 last:mb-0">
								<Label className="text-lg font-semibold mb-2 block">
									{criterionGrade.criterion.title}
								</Label>
								<div className="bg-gray-50 p-4 rounded-md mb-4">
									<p className="text-sm">{criterionGrade.comment}</p>
								</div>
								<div className="flex items-center justify-between mt-2">
									<Label
										htmlFor={`grade-${criterionGrade.criterionId}`}
										className="mr-2"
									>
										Grade:
									</Label>
									<div className="flex items-center">
										<Input
											id={`grade-${criterionGrade.criterionId}`}
											type="number"
											min="0"
											max={criterionGrade.criterion.maxMark}
											name={`grade-${criterionGrade.criterionId}`}
											defaultValue={criterionGrade.grade || 0}
											className="w-[80px] mr-2"
										/>
										<span className="text-sm">
											/ {criterionGrade.criterion.maxMark}
										</span>
									</div>
								</div>
								<Textarea
									name={`comment-${criterionGrade.criterionId}`}
									placeholder="Add a comment for this criterion"
									className="mt-2"
									defaultValue={criterionGrade.comment || ""}
								/>
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

export default GradeReviewDialog;
