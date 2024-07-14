import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const ReviewDetailsDialog = ({ submissionId, open, onClose }) => {
    console.log('submissionId', submissionId);
    const [reviewDetails, setReviewDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            if (!submissionId) return;
            try {
                const reviews = await reviewAPI.getAllReviews(submissionId);
                console.log('reviews', reviews);
                if (reviews.data.length > 0) {                    
                    const sortedReviews = reviews.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    console.log('sortedReviews', sortedReviews[0]);
                    setReviewDetails(sortedReviews[0]);
                } else {
                    setReviewDetails(null);
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

    if (loading) {
        return <div>Loading review details...</div>;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Latest Review Details</DialogTitle>
                </DialogHeader>
                {reviewDetails ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review from {new Date(reviewDetails.createdAt).toLocaleString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reviewDetails.criterionGrades && reviewDetails.criterionGrades.map((cg, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg">{cg.criterion ? cg.criterion.title : 'Unknown Criterion'}</h3>
                                        <p className="text-sm text-gray-600">Grade: {cg.grade}</p>
                                        <p className="text-sm mt-2">{cg.comment}</p>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Final Grade:</span>
                                    <span className="text-xl font-bold">{reviewDetails.reviewGrade}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <p>No reviews available for this submission.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDetailsDialog;