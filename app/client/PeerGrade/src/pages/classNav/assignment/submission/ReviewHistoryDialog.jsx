import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const ReviewHistoryDialog = ({ submissionId, open, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewAPI.getAllReviews(submissionId);
                setReviews(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch review history",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        if (open && submissionId) {
            fetchReviews();
        }
    }, [submissionId, open]);

    if (loading) {
        return <div>Loading review history...</div>;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Review History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <Card key={index} className="mb-4">
                                <CardHeader>
                                    <CardTitle className="text-lg">Review {reviews.length - index}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Grade:</span>
                                            <Badge variant="secondary">{review.reviewGrade}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Reviewer:</span>
                                            <span>{review.reviewerId}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Date:</span>
                                            <span>{new Date(review.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>No review history available for this submission.</p>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewHistoryDialog;