import React from 'react'

const SubmitReview = () => {
  return (
    <div>
      COMING SOON!
    </div>
  )
}

export default SubmitReview



// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import reviewAPI from '@/api/reviewApi';
// import { getRubricById } from '@/api/rubricApi';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Download, Eye } from "lucide-react";
// import PDFViewer from "@/components/assign/PDFViewer";
// import { toast } from "@/components/ui/use-toast";
// import ReviewDetailsDialog from './classNav/assignment/submission/ReviewDetailsDialog';

// const SubmitReview = () => {
//     const { reviewId } = useParams();
//     const [review, setReview] = useState(null);
//     const [rubrics, setRubrics] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [viewGradeDialogOpen, setViewGradeDialogOpen] = useState(false);

//     useEffect(() => {
//         const fetchReviewDetails = async () => {
//             try {
//                 setLoading(true);
//                 const response = await reviewAPI.getReviewById(reviewId);
//                 console.log('API response:', response.data);
//                 setReview(response.data);

//                 // Fetch rubric data
//                 if (response.data.submission.assignment.rubric && response.data.submission.assignment.rubric.length > 0) {
//                     const rubricPromises = response.data.submission.assignment.rubric.map(r => getRubricById(r.rubricId));
//                     console.log('Rubric promises:', rubricPromises);
//                     const rubricResponses = await Promise.all(rubricPromises);

//                     const fetchedRubrics = rubricResponses.map(r => r.data);
//                     console.log('Rubric responses:', fetchedRubrics);
//                     setRubrics(fetchedRubrics);
//                 }
//             } catch (error) {
//                 console.error("Error fetching review details:", error);
//                 let errorMessage = "Failed to fetch review details. Please try again.";
//                 if (error.response) {
//                   if (error.response.status === 403) {
//                     errorMessage = "You don't have permission to access this rubric. Please contact your administrator.";
//                   } else {
//                     errorMessage = `Server error: ${error.response.data.message || error.message}`;
//                   }
//                 }
//                 toast({
//                   title: "Error",
//                   description: errorMessage,
//                   variant: "destructive"
//                 });
//               } finally {
//                 setLoading(false);
//               }
//         };
    
//         fetchReviewDetails();
//     }, [reviewId]);

//     useEffect(() => {
//         console.log('Updated review state:', review);
//         console.log('Updated rubrics state:', rubrics);
//     }, [review, rubrics]);

//     const handleDownload = () => {
//         if (review && review.submission) {
//             const link = document.createElement("a");
//             link.href = review.submission.submissionFilePath;
//             link.download = `submission_${review.submission.submissionId}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         }
//     };

//     const handleGradeSubmit = async (event) => {
//         event.preventDefault();
        
//         if (!review || rubrics.length === 0) {
//             console.error("No review or rubric data available");
//             toast({
//                 title: "Error",
//                 description: "No review or rubric data available. Please try again.",
//                 variant: "destructive"
//             });
//             return;
//         }
    
//         const formData = new FormData(event.target);
//         let totalMark = 0;
//         const criterionGrades = rubrics.flatMap(rubric => 
//             rubric.criteria.map(criterion => {
//                 const grade = parseFloat(formData.get(`grade-${criterion.criterionId}`)) || 0;
//                 const comment = formData.get(`comment-${criterion.criterionId}`);
//                 totalMark += grade;
//                 return { 
//                     criterionId: criterion.criterionId, 
//                     grade, 
//                     comment 
//                 };
//             })
//         );
    
//         try {
//             const updatedReview = {
//                 reviewId: review.reviewId,
//                 submissionId: review.submissionId,
//                 reviewGrade: totalMark,
//                 reviewerId: review.reviewerId,
//                 revieweeId: review.revieweeId,
//                 updatedAt: new Date(),
//                 isPeerReview: review.isPeerReview,
//                 isGroup: review.isGroup,
//                 criterionGrades: criterionGrades,
//             };

//             const response = await reviewAPI.updateReview(review.reviewId, updatedReview);
            
//             setReview(response.data);

//             toast({
//                 title: "Success",
//                 description: "Review updated successfully",
//                 variant: "success"
//             });
    
//         } catch (error) {
//             console.error("Error updating review:", error);
//             toast({
//                 title: "Error",
//                 description: "Failed to update review",
//                 variant: "destructive"
//             });
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }
    
//     if (!review || !review.submission || rubrics.length === 0) {
//         return <div>No review or rubric data available. Please try again.</div>;
//     }
    
//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6 text-primary">Submit Review</h1>
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card className="col-span-1 lg:col-span-2">
//                     <CardHeader>
//                         <CardTitle>Submission Preview</CardTitle>
//                     </CardHeader>
//                     <CardContent className="h-[50vh]">
//                         <PDFViewer url={review.submission.submissionFilePath} scale="1" />
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Grade Submission</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleGradeSubmit}>
//                             {rubrics.map((rubric, rubricIndex) => (
//                                 <div key={rubricIndex} className="mb-8">
//                                     <h3 className="text-xl font-bold mb-4">{rubric.title}</h3>
//                                     {rubric.criteria.map((criterion, criterionIndex) => (
//                                         <div key={criterionIndex} className="mb-6">
//                                             <Label className="text-lg font-semibold">{criterion.title}</Label>
//                                             <div className="mt-2 bg-gray-100 p-4 rounded-md mb-4">
//                                                 {criterion.criterionRatings.map((rating, ratingIndex) => (
//                                                     <div key={ratingIndex} className="mb-2">
//                                                         <span className="font-medium">{rating.points} points: </span>
//                                                         {rating.description}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                             <div className="mt-2">
//                                                 <Input
//                                                     type="number"
//                                                     min="0"
//                                                     max={criterion.maxMark}
//                                                     name={`grade-${criterion.criterionId}`}
//                                                     placeholder={`Grade (max ${criterion.maxMark})`}
//                                                     className="mb-2"
//                                                     defaultValue={review.criterionGrades.find(cg => cg.criterionId === criterion.criterionId)?.grade || 0}
//                                                 />
//                                                 <Textarea
//                                                     name={`comment-${criterion.criterionId}`}
//                                                     placeholder="Add a comment for this criterion"
//                                                     defaultValue={review.criterionGrades.find(cg => cg.criterionId === criterion.criterionId)?.comment || ''}
//                                                 />
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))}
//                             <Button type="submit" className="mt-4">Submit Grades</Button>
//                         </form>
//                     </CardContent>
//                 </Card>

//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Submission Details</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p><strong>Assignment:</strong> {review.submission.assignment.title}</p>
//                         <p><strong>Submitted on:</strong> {new Date(review.submission.createdAt).toLocaleString()}</p>
//                         <div className="mt-4">
//                             <Button onClick={handleDownload} className="mr-2">
//                                 <Download className="h-4 w-4 mr-1" /> Download Submission
//                             </Button>
//                             <Button onClick={() => setViewGradeDialogOpen(true)}>
//                                 <Eye className="h-4 w-4 mr-1" /> View Grades
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             <ReviewDetailsDialog
//                 submissionId={review.submissionId}
//                 open={viewGradeDialogOpen}
//                 onClose={() => setViewGradeDialogOpen(false)}
//             />
//         </div>
//     );
// };

// export default SubmitReview;