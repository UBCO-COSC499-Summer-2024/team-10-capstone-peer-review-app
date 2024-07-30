import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GradeCard from "@/components/class/GradeCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Users, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GroupCard from "@/components/class/GroupCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, differenceInWeeks } from "date-fns";
import { getAllAssignments } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, deleteNotification } from "@/api/notifsApi";
import NotifCard from "@/components/global/NotifCard";
import reviewAPI from "@/api/reviewAPI";

function Dashboard() {
  const { user, userLoading } = useUser();
  const { classes, isClassLoading } = useClass();
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [assignmentsData, groupsData, notifsData, reviewsData, allReviewsData] = await Promise.all([
            getAllAssignments(user.userId),
            getGroups(user.userId),
            getNotifications(user.userId),
            reviewAPI.getReviewsAssigned(),
            reviewAPI.getAllReviews()
          ]);

          setAssignments(Array.isArray(assignmentsData.data) ? assignmentsData.data : []);
          setGroups(Array.isArray(groupsData.data) ? groupsData.data : []);
          setNotifications(Array.isArray(notifsData.data) ? notifsData.data : []);
          setReviews(Array.isArray(reviewsData.data) ? reviewsData.data : []);
          setAllReviews(Array.isArray(allReviewsData.data) ? allReviewsData.data : []);
        } catch (error) {
          console.error("Failed to fetch data", error);
          toast({
            title: "Error",
            description: "Failed to fetch data",
            variant: "destructive"
          });
        }
        setIsLoading(false);
      };

      fetchData();
      const intervalId = setInterval(() => getNotifications(user.userId), 10000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const handleDeleteNotif = async (notificationId) => {
    const deleteNotif = await deleteNotification(notificationId);
    if (deleteNotif.status === "Success") {
      setNotifications((prevNotifs) =>
        prevNotifs.filter(
          (notification) => notification.notificationId !== notificationId
        )
      );
    } else {
      console.error('An error occurred while deleting the notification.', deleteNotif.message);
    }
  };

  const currentDate = new Date();
  
  const assignmentData = assignments.filter(
    (assignment) => new Date(assignment.dueDate) > currentDate && assignment.evaluation_type !== "peer"
  );

  const reviewData = reviews.filter(
    (review) => {
      const reviewDueDate = new Date(review.submission.assignment.dueDate);
      return review.reviewerId === user.userId && differenceInWeeks(currentDate, reviewDueDate) <= 2;
    }
  );


  const handleViewGradeDetails = (reviewId) => {
    navigate('/peer-review', { state: { defaultTab: 'received', reviewId } });
  };

  const gradeData = allReviews
  .filter(review => 
    review.reviewer.role === 'INSTRUCTOR' &&
    review.reviewee.userId === user.userId &&
    differenceInWeeks(currentDate, new Date(review.updatedAt)) <= 2
  )
  .map(review => ({
    reviewId: review.reviewId,
    assignmentId: review.submission.assignment.assignmentId,
    classId: review.submission.assignment.classes.classId,
    assignmentTitle: review.submission.assignment.title,
    grade: review.reviewGrade,
    totalMarks: review.submission.assignment.rubric?.totalMarks || 0,
    dueDate: format(parseISO(review.submission.assignment.dueDate), "MMM d, yyyy"),
    isGraded: review.criterionGrades.length > 0
  }));


  const renderAssignmentAlert = (assignment) => (
    <Alert key={assignment.assignmentId} className="mb-4">
      <AlertTitle className="flex justify-between items-center">
        <span>{assignment.title}</span>
        <Link to={`/class/${assignment.classId}`}><Badge variant="default">{assignment.classes.classname}</Badge></Link>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center mt-2">
        <span className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Due: {format(parseISO(assignment.dueDate), "MMM d, yyyy")}
        </span>
        <Link
          to={`/class/${assignment.classId}/assignment/${assignment.assignmentId}`}
          className="text-primary hover:text-primary-foreground"
        >
          <Button variant="outline" size="sm">
            Open
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );

  const renderReviewAlert = (review) => (
    <Alert key={review.reviewId} className="mb-4">
      <AlertTitle className="flex justify-between items-center">
        <span>{review.submission.assignment.title}</span>
        <div>
          <Badge variant="default" className="mr-2">
            {review.submission.assignment.classes.classname}
          </Badge>
          {review.criterionGrades && review.criterionGrades.length > 0 && review.criterionGrades.every(cg => cg.grade !== null) && (
            <Badge variant="outline" className="bg-success/30 text-green-700 font-bold">
              Submitted
            </Badge>
          )}
        </div>
      </AlertTitle>
      <AlertDescription className="flex justify-between items-center mt-2">
        <span className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Review Due: {format(parseISO(review.submission.assignment.dueDate), "MMM d, yyyy")}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/peer-review', { state: { defaultTab: 'assigned' } })}
        >
          Review
        </Button>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Dashboard</h1>
      <div className={user.role === "STUDENT" ? "grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" : "grid grid-cols-1 gap-8 mb-8"}>
        <Card className="bg-muted rounded-lg shadow-md">
			<CardHeader>
				<CardTitle className="flex items-center"><Bell className="mr-2" />Recent Class Notifications</CardTitle>
			</CardHeader>
			<CardContent className='space-y-2'>
				{notifications.filter(notification => notification.type === 'announcement').length === 0 && (
				<div className="text-center px-4 pb-4 text-sm">
					You have no notifications!
				</div>
				)}
				{notifications.filter(notification => notification.type === 'announcement').map((notification) => (
				<NotifCard
					key={notification.notificationId}
					notificationData={notification}
					deleteNotifCall={handleDeleteNotif}
				/>
				))}
			</CardContent>
        </Card>
        {user.role === "STUDENT" && 
        <Card className="bg-muted rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2" />My Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <GroupCard groups={groups} />
            )}
          </CardContent>
        </Card>
        }
      </div>
	  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-muted rounded-lg shadow-md">
          <CardContent>
            <Tabs defaultValue="assignments">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="assignments">
                <ScrollArea className="h-[400px] w-full ">
                  {assignmentData.length > 0 ? assignmentData.map(renderAssignmentAlert) : 
                    <p className="text-muted-foreground">No upcoming assignments.</p>}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="reviews">
                <ScrollArea className="h-[400px] w-full ">
                  {reviewData.length > 0 ? reviewData.map(renderReviewAlert) : 
                    <p className="text-muted-foreground">No upcoming reviews.</p>}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="bg-muted rounded-lg shadow-md">
          <CardContent>
            <Tabs defaultValue="grades">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="grades">Recent Grades</TabsTrigger>
              </TabsList>
              <TabsContent value="grades">
			  <ScrollArea className="h-[400px] w-full ">
					{gradeData.length > 0 ? gradeData.map((grade) => (
					<GradeCard 
						key={grade.reviewId}
						reviewId={grade.reviewId}
						assignmentId={grade.assignmentId}
						classId={grade.classId}
						assignmentTitle={grade.assignmentTitle}
						grade={grade.grade}
						totalMarks={grade.totalMarks}
						dueDate={grade.dueDate}
						isGraded={grade.isGraded}
						onViewGradeDetails={handleViewGradeDetails}
					/>
					)) : 
					<p className="text-muted-foreground">No recent grades available.</p>}
				</ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;