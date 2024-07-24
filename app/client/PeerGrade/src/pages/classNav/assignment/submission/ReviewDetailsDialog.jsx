import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const ReviewDetailsDialog = ({ submissionId, open, onClose }) => {
    const [reviewDetails, setReviewDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            if (!submissionId) return;
            try {
                const review = await reviewAPI.getInstructorReview(submissionId);
                if (review.data) {
                    console.log('review.data', review.data);
                    setReviewDetails(review.data);
                } 
            } catch (error) {
                console.error("Error fetching review details:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch review details",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        if (open && submissionId) {
            fetchReviewDetails();
        }
    }, [submissionId, open]);

    const getTotalMaxPoints = () => {
        if (!reviewDetails || !reviewDetails.criterionGrades) return 0;
        return reviewDetails.criterionGrades.reduce((total, cg) => total + cg.criterion.maxMark, 0);
    };

    const getPercentageGrade = () => {
        if (!reviewDetails || !reviewDetails.criterionGrades) return 0;
        const totalGrade = reviewDetails.criterionGrades.reduce((total, cg) => total + cg.grade, 0);
        const totalMaxPoints = reviewDetails.criterionGrades.reduce((total, cg) => total + cg.criterion.maxMark, 0);
        return totalMaxPoints > 0 ? ((totalGrade / totalMaxPoints) * 100).toFixed(2) : 0;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] overflow-auto">
                {reviewDetails ? (
                    <ScrollArea className="h-full">
                        <Card className="my-6">
                            <CardHeader className="bg-accent">
                                <CardTitle className="text-xl">Review Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Total Grade:</span>
                                    <Badge variant="outline" className="bg-green-200 text-lg px-3 py-1">
                                        {getPercentageGrade()}%
                                    </Badge>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>Reviewed on: {new Date(reviewDetails.updatedAt).toLocaleString()}</p>
                                    <p>Peer Review: {reviewDetails.isPeerReview ? "Yes" : "No"}</p>
                                </div>
                            </CardContent>
                        </Card>
                        {reviewDetails.criterionGrades.map((criterionGrade, index) => (
                            <Card key={index} className="mb-6">
                                <CardContent>
                                    <CardTitle className="text-lg ml-1 mb-3">{criterionGrade.criterion.title}</CardTitle>
                                    <div className="mb-6 bg-slate-200 p-3 rounded-lg last:mb-0">
                                        <h3 className="text-md font-semibold mb-2">{criterionGrade.criterion.title}</h3>
                                        <div className="mt-2">
                                            {criterionGrade.criterion.criterionRatings.map((rating, ratingIndex) => (
                                                <div key={ratingIndex} className="mb-2 bg-gray-100 p-3 rounded-md last:mb-0">
                                                    <p className="text-sm flex flex-col">
                                                        <span className="font-medium underline">{rating.points} points:</span> {rating.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium">Grade:</span>
                                            <Badge variant="default">
                                                {criterionGrade.grade} / {criterionGrade.criterion.maxMark}
                                            </Badge>
                                        </div>
                                        <Progress 
                                            value={(criterionGrade.grade / criterionGrade.criterion.maxMark) * 100} 
                                            className="h-2 mb-2"
                                        />
                                        <Separator className="my-2" />
                                        <p className="text-sm text-wrap bg-gray-50 p-3 rounded-md mt-2">
                                            <span className="font-semibold">Comment: </span>
                                            {criterionGrade.comment ? criterionGrade.comment : "No comment provided."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </ScrollArea>
                ) : (
                    <p className="text-center text-gray-600">No reviews available for this submission.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDetailsDialog;