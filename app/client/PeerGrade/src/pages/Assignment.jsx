import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText, Users, Edit, Upload } from 'lucide-react';
import PDFViewer from '@/components/assign/PDFViewer';
import EditAssignment from './classNav/assignment/EditAssignment';
import Submissions from './classNav/assignment/Submissions';
import Submission from './classNav/assignment/StudentSubmission';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAssignmentInClass } from '@/api/assignmentApi';
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Assignment = () => {
  const { user, userLoading } = useUser();
  const { classId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const fetchedAssignment = await getAssignmentInClass(classId, assignmentId);
        setAssignment(fetchedAssignment.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch assignment data",
          variant: "destructive",
        });
      }
    };

    fetchAssignment();
  }, [classId, assignmentId]);

  if (userLoading || !assignment) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleBackClick = () => {
    navigate(`/class/${classId}`);
  };

  const isInstructor = user.role === 'INSTRUCTOR';

  return (
    <div className="container mx-auto px-4 pb-8">
      <Card className="mb-8 bg-card">
        <CardHeader>
          <div className='flex w-full items-center'>
            <div className="flex rounded-lg mr-2">
              <Button onClick={handleBackClick} variant='ghost' className='h-8 w-8'>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold w-full">{assignment.title}</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="view" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="view">View Assignment</TabsTrigger>
          {isInstructor && <TabsTrigger value="edit">Edit Assignment</TabsTrigger>}
          <TabsTrigger value={isInstructor ? "submissions" : "submission"}>
            {isInstructor ? "View Submissions" : "Submit Assignment"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="view">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-card">
              <CardHeader>
                <CardTitle>Assignment File</CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <div className='bg-accent rounded-md flex justify-center items-center p-4 pt-12'>
                  <PDFViewer url={assignment.assignmentFilePath} scale="1"/>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
            <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Submission Details:</CardTitle>
                  <p className="text-foreground ">{assignment.description}</p>
                </CardHeader>
                <CardContent>
                  {user.role === "STUDENT" &&
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <Badge variant="secondary">Not Submitted</Badge>
                  </div>
                  }
                  {user.role === "STUDENT" && <Separator className="my-4" />}
                  <div className="flex justify-between items-center">
                    <span>Due Date:</span>
                    <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <p className="text-muted-foreground">No comments yet.</p>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Add Comment</Button>
                </CardFooter>
              </Card>
              
             
            </div>
          </div>
        </TabsContent>
        
        {isInstructor && (
          <>
            <TabsContent value="edit">
              <EditAssignment assignment={assignment} />
            </TabsContent>
            <TabsContent value="submissions">
              <Submissions assignmentId={assignmentId} />
            </TabsContent>
          </>
        )}
        
        {!isInstructor && (
          <TabsContent value="submission">
            <Submission assignmentId={assignmentId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Assignment;