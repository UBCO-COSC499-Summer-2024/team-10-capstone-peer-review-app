import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PDFViewer from '@/components/assign/PDFViewer';
import EditAssignment from './classNav/assignment/EditAssignment';
import Submissions from './classNav/assignment/Submissions';  // Import the new Submissions component
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAssignmentInClass } from '@/api/assignmentApi';
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";

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

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const handleBackClick = () => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="w-full px-6">
      <Tabs defaultValue="view" className="flex-1">
        {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
          <TabsList className="grid w-1/2 grid-cols-3 mb-3 bg-muted">
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="view">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 bg-gray-100 rounded">
              <Card className="mb-8">
                <CardHeader>
                  <div className='flex w-full items-center'>
                    <div className="flex rounded-lg mr-2">
                      <Button onClick={handleBackClick} variant='ghost' className='h-8 w-8'>
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg font-bold w-full">{assignment.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      <p>Required File Type: NA</p>
                    </div>
                   </div>
                  <p className="mb-2">{assignment.description}</p>
                </CardContent>
              </Card>
              <div className='white rounded-md flex justify-center items-center'>
                <PDFViewer url={assignment.assignmentFilePath} scale="1"/>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-white p-4 shadow-md">
                <CardContent className="bg-gray-100 p-4 rounded">Comment Box</CardContent>
              </Card>
              <Card className="bg-white p-4 shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-2">Submissions</CardTitle>
                </CardHeader>
                <CardContent className="bg-gray-100 p-4 rounded">
                  {/* You can display assignment submissions here */}
                </CardContent>
              </Card>
            </div>
          </div>
          </TabsContent>
        {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
          <>
            <TabsContent value="edit">
              <EditAssignment assignment={assignment} />
            </TabsContent>
            <TabsContent value="submissions">
              <Submissions assignmentId={assignmentId} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Assignment;
