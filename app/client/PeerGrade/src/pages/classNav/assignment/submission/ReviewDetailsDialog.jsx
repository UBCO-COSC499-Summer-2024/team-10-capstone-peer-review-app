import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const ReviewDetailsDialog = ({ submissionId, rubrics = [], open, onClose }) => {
    const [reviewDetails, setReviewDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            if (!submissionId) return;
            try {
                const reviews = await reviewAPI.getInstructorReview(submissionId);
                if (reviews.data) {
                    console.log('reviews.data', reviews.data);
                    setReviewDetails(reviews.data);
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

    const getTotalRubricPoints = () => {
        return rubrics.reduce((total, rubric) => total + rubric.totalMarks, 0);
    };

    const getPercentageGrade = () => {
        if (!reviewDetails || !reviewDetails.reviewGrade) return 0;
        const totalPoints = getTotalRubricPoints();
        return totalPoints > 0 ? ((reviewDetails.reviewGrade / totalPoints) * 100).toFixed(2) : 0;
    };

    if (loading) {
        return <div>Loading review details...</div>;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className=" max-w-4xl max-h-[90vh] overflow-auto">
                {reviewDetails ? (
                    <ScrollArea className="h-full pr-4">
                        <Card className="mb-6 ">
                            <CardHeader className="bg-muted">
                                <CardTitle className="text-xl">Review Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold">Final Grade:</span>
                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                        {getPercentageGrade()}%
                                    </Badge>
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>Reviewed on: {new Date(reviewDetails.updatedAt).toLocaleString()}</p>
                                    <p>Peer Review: {reviewDetails.isPeerReview ? "Yes" : "No"}</p>
                                </div>
                            </CardContent>
                        </Card>
                        {rubrics.map((rubric, rubricIndex) => (
                            <Card key={rubricIndex} className="mb-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">{rubric.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {rubric.criteria.map((criterion, criterionIndex) => {
                                        const criterionGrade = reviewDetails.criterionGrades.find(
                                            (cg) => cg.criterionId === criterion.criterionId
                                        );
                                        return (
                                            <div key={criterionIndex} className="mb-6 last:mb-0">
                                                <h3 className="text-md font-semibold mb-2">{criterion.title}</h3>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium">Grade:</span>
                                                    <Badge variant="secondary">
                                                        {criterionGrade ? criterionGrade.grade : 0} / {criterion.maxMark}
                                                    </Badge>
                                                </div>
                                                <Progress 
                                                    value={criterionGrade ? (criterionGrade.grade / criterion.maxMark) * 100 : 0} 
                                                    className="h-2 mb-2"
                                                />
                                                <p className="text-sm text-wrap bg-gray-50 p-3 rounded-md">
                                                    {criterionGrade && criterionGrade.comment ? criterionGrade.comment : "No comment provided."}
                                                </p>
                                            </div>
                                        );
                                    })}
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