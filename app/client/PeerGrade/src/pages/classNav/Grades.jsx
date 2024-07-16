import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/contextHooks/useUser";
import reviewAPI from '@/api/reviewApi';
import GradeCard from '@/components/class/GradeCard';
import ReviewDetailsDialog from '@/pages/classNav/assignment/submission/ReviewDetailsDialog';
import { toast } from "@/components/ui/use-toast";

const Grades = ({ classId }) => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewAPI.getAllReviewsByUser(user.userId, user.role);
        console.log('Fetched reviews:', response.data);
        
        // Process the reviews to match the structure we need
        const processedReviews = response.data.map(review => ({
          reviewId: review.reviewId,
          submission: {
            submissionId: review.submission.submissionId,
            assignment: {
              assignmentId: review.submission.assignment.assignmentId,
              title: review.submission.assignment.title,
              dueDate: review.submission.assignment.dueDate,
              rubrics: review.submission.assignment.rubric || [] // Assuming rubrics are included
            }
          },
          reviewGrade: review.reviewGrade,
          criterionGrades: review.criterionGrades || []
        }));

        setReviews(processedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        toast({
          title: "Error",
          description: "Failed to fetch grades",
          variant: "destructive"
        });
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  const handleViewGrade = (review) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const calculateTotalMarks = (rubrics) => {
    return rubrics.reduce((total, rubric) => total + rubric.totalMarks, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center mb-2 bg-muted p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold">Class Grades</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {reviews.map((review) => {
          const totalMarks = calculateTotalMarks(review.submission.assignment.rubrics);
          return (
            <GradeCard
              key={review.reviewId}
              assignmentId={review.submission.assignment.assignmentId}
              classId={classId}
              assignmentTitle={review.submission.assignment.title}
              grade={review.reviewGrade}
              totalMarks={totalMarks}
              dueDate={new Date(review.submission.assignment.dueDate).toLocaleDateString()}
              onViewGradeDetails={() => handleViewGrade(review)}
            />
          );
        })}
      </CardContent>
      {selectedReview && (
        <ReviewDetailsDialog
          submissionId={selectedReview.submission.submissionId}
          rubrics={selectedReview.submission.assignment.rubrics}
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </Card>
  );
};

export default Grades;