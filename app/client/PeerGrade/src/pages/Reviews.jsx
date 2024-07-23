import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { getStudentSubmission } from '@/api/submitApi';
import reviewAPI from '@/api/reviewApi';
import { useUser } from "@/contexts/contextHooks/useUser";

const PeerReview = () => {
  const [view, setView] = useState("mySubmissions");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewsRecieved, setReviewsRecieved] = useState([]); 
  const [reviewsSent, setReviewsSent] = useState([]);
  const { user } = useUser();


  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
    
      try {
        const submissionsResponse = await getStudentSubmission(user.userId);
        console.log('submissionsRespyyyyyyyyyonse', submissionsResponse);
        setSubmissions(submissionsResponse.data || []);
        
        const reviewsResponse = await reviewAPI.getUserReviews(user.userId);
        console.log('reviewsResponse', reviewsResponse);
        
        // Ensure pendingReviews is always an array
        const pendingReviews = Array.isArray(reviewsResponse.data) 
          ? reviewsResponse.data.filter(review => !review.isCompleted)
          : [];
        
        setPendingReviews(pendingReviews);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSubmissions([]);
        setPendingReviews([]);
      }
    };
  
    fetchData();
  }, [user]);


  const fetchReviewsRecieved = async () => {
    const reviewsRecievedData = await getReviewsRecieved(user.userId);
    setReviewsRecieved(reviewsRecievedResponse.data || []);
  };

  const fetchReviewsSent = async () => {
    const reviewsSentData = await getReviewsSent(user.userId);
    setReviewsSent(reviewsSentResponse.data || []);
  };

  const filteredItems = view === "mySubmissions" 
    ? (submissions || []).filter(submission =>
        submission &&
        submission.assignmentId &&
        submission.assignmentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (pendingReviews || []).filter(review =>
        review &&
        review.submission &&
        review.submission.assignment &&
        (review.submission.assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.submission.assignment.classes && review.submission.assignment.classes.classname.toLowerCase().includes(searchTerm.toLowerCase())))
      );

      console.log('filteredItems', filteredItems);

      const renderGridView = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            if (!item || !item.assignment) return null;
            
            const instructorId = item.assignment.classes.instructor.userId;
            const isGradedByInstructor = item.reviews && item.reviews.some(review => 
              review.reviewerId === instructorId && !review.isPeerReview
            );
      
            return (
              <Card key={item.submissionId} className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-primary">{item.assignment.title}</CardTitle>
                  <div className="flex justify-between items-center">
                    <CardDescription className="text-sm text-slate-500 flex justify-between w-full">
                      Instructor: {item.assignment.classes.instructor.firstname} {item.assignment.classes.instructor.lastname}
                      <Badge className="bg-slate-200" variant="outline">{item.assignment.classes.classname}</Badge>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>Last Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className={isGradedByInstructor ? "bg-success text-green-800" : "bg-destructive text-white"}>
                      {isGradedByInstructor ? "Graded" : "Not Graded"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to={`/assignedPR/${item.assignment.assignmentId}`} className="w-full">
                    <Button variant="default" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" /> View Submission
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredItems.map(item => {
        if (!item) return null;
        const isSubmission = view === "mySubmissions";
        const assignment = isSubmission ? item.assignment : item.submission?.assignment;
        if (!assignment) return null;
        return (
          <Alert key={isSubmission ? item.submissionId : item.reviewId} variant="default" className="hover:bg-accent cursor-pointer transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-2 justify-between w-full">
                  <AlertTitle className="text-lg font-semibold text-primary">{assignment.title}</AlertTitle>
                  <Badge variant="default" className="mb-2">
                    {assignment.classes ? assignment.classes.classname : 'No Class'}
                  </Badge>  
                  </div>
                <AlertDescription>
                  <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                    {!isSubmission && (
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Review Due: {new Date(item.reviewDueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </AlertDescription>
              </div>
              <Link to={isSubmission ? `/submission/${item.submissionId}` : `/review/${item.reviewId}`}>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Alert>
        );
      })}
    </div>
  );

  return (
    <div className="w-full px-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Peer Reviews</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:w-1/3">
          <Input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200"
          />
          <Search className="absolute top-2.5 left-3 h-5 w-5 text-slate-400"/>
        </div>
        
        <Tabs defaultValue={view} className="w-full md:w-auto" onValueChange={setView}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mySubmissions">My Submissions</TabsTrigger>
            <TabsTrigger value="reviewsPending">Reviews Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === 'mySubmissions' ? renderGridView() : renderListView()}

      {filteredItems.length === 0 && (
        <div className="text-center text-slate-500 mt-8">
          No {view === 'mySubmissions' ? 'submissions' : 'pending reviews'} found.
        </div>
      )}
    </div>
  );
};

export default PeerReview;