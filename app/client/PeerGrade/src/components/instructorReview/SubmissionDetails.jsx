import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import reviewAPI from "@/api/reviewApi";
import { toast } from "@/components/ui/use-toast";

const SubmissionDetails = ({ submission, onClose }) => {
  const [peerReviews, setPeerReviews] = useState([]);
  const [instructorReview, setInstructorReview] = useState(null);

  useEffect(() => {
    if (submission) {
      fetchReviews(submission.submissionId);
    }
  }, [submission]);

  const fetchReviews = async (submissionId) => {
    try {
      const [peerReviewsResponse, instructorReviewResponse] = await Promise.all([
        reviewAPI.getPeerReviews(submissionId),
        reviewAPI.getInstructorReview(submissionId)
      ]);
      setPeerReviews(peerReviewsResponse.data);
      setInstructorReview(instructorReviewResponse.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      });
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>
              {submission.submitter.firstname} {submission.submitter.lastname}'s Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Submitted on: {new Date(submission.createdAt).toLocaleString()}</p>
            <p>Final Grade: {submission.finalGrade || "Not graded"}</p>
            <Button onClick={() => window.open(submission.submissionFilePath, "_blank")}>
              View Submission
            </Button>
          </CardContent>
        </Card>
        {instructorReview && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Instructor Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Grade: {instructorReview.reviewGrade}</p>
              {instructorReview.criterionGrades.map((criterionGrade) => (
                <div key={criterionGrade.criterionGradeId}>
                  <h4>{criterionGrade.criterion.title}</h4>
                  <p>Grade: {criterionGrade.grade}</p>
                  <p>Comment: {criterionGrade.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Peer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {peerReviews.length > 0 ? (
              peerReviews.map((review) => (
                <Card key={review.reviewId} className="mb-4">
                  <CardHeader>
                    <CardTitle>
                      Review by {review.reviewer.firstname} {review.reviewer.lastname}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Grade: {review.reviewGrade}</p>
                    {review.criterionGrades.map((criterionGrade) => (
                      <div key={criterionGrade.criterionGradeId}>
                        <h4>{criterionGrade.criterion.title}</h4>
                        <p>Grade: {criterionGrade.grade}</p>
                        <p>Comment: {criterionGrade.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No peer reviews available</p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetails;