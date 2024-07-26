import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const ViewReviewGradeDialog = ({ review, open, onClose, onUpdate }) => {
    const getTotalMaxPoints = () => {
        if (
            !review ||
            !review.submission ||
            !review.submission.assignment ||
            !review.submission.assignment.rubric
        )
            return 0;
        return review.submission.assignment.rubric.criteria.reduce(
            (total, criterion) => total + criterion.maxMark,
            0
        );
    };

    const getPercentageGrade = () => {
        if (!review || !review.criterionGrades) return 0;
        const totalGrade = review.criterionGrades.reduce(
            (total, cg) => total + cg.grade,
            0
        );
        const totalMaxPoints = getTotalMaxPoints();
        return totalMaxPoints > 0
            ? ((totalGrade / totalMaxPoints) * 100).toFixed(2)
            : 0;
    };

    const handleClose = async () => {
        onClose();
        if (onUpdate) {
            await onUpdate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] overflow-auto">
                {review ? (
                    <ScrollArea className="h-full">
                        <Card className="my-6">
                            <CardHeader className="bg-accent">
                                <CardTitle className="text-xl">Review Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Total Grade:</span>
                                    <Badge
                                        variant="outline"
                                        className="bg-green-200 text-lg px-3 py-1"
                                    >
                                        {getPercentageGrade()}%
                                    </Badge>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>
                                        Reviewed on: {new Date(review.updatedAt).toLocaleString()}
                                    </p>
                                    <p>Peer Review: {review.isPeerReview ? "Yes" : "No"}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {review.submission.assignment.rubric.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {review.submission.assignment.rubric.criteria.map((criterion) => {
                                    const criterionGrade = review.criterionGrades.find(
                                        (cg) => cg.criterionId === criterion.criterionId
                                    );
                                    return (
                                        <div
                                            key={criterion.criterionId}
                                            className="mb-6 bg-slate-200 p-3 rounded-lg last:mb-0"
                                        >
                                            <h3 className="text-md font-semibold mb-2">
                                                {criterion.title}
                                            </h3>
                                            <div className="mt-2">
                                                {criterion.criterionRatings.map(
                                                    (rating, ratingIndex) => (
                                                        <div
                                                            key={ratingIndex}
                                                            className="mb-2 bg-gray-100 p-3 rounded-md last:mb-0"
                                                        >
                                                            <p className="text-sm flex flex-col">
                                                                <span className="font-medium underline">
                                                                    {rating.points} points:
                                                                </span>{" "}
                                                                {rating.description}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">Grade:</span>
                                                <Badge variant="default">
                                                    {criterionGrade ? criterionGrade.grade : 0} /{" "}
                                                    {criterion.maxMark}
                                                </Badge>
                                            </div>
                                            <Progress
                                                value={
                                                    criterionGrade
                                                        ? (criterionGrade.grade / criterion.maxMark) * 100
                                                        : 0
                                                }
                                                className="h-2 mb-2"
                                            />
                                            <Separator className="my-2" />
                                            <p className="text-sm text-wrap bg-gray-50 p-3 rounded-md mt-2">
                                                <span className="font-semibold">Comment: </span>
                                                {criterionGrade && criterionGrade.comment
                                                    ? criterionGrade.comment
                                                    : "No comment provided."}
                                            </p>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </ScrollArea>
                ) : (
                    <p className="text-center text-gray-600">No review available.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewReviewGradeDialog;