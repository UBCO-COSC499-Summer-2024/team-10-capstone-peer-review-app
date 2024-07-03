import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Pencil, ArrowLeft } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import PDFViewer from '@/components/assign/PDFViewer';
import EditAssignment from './EditAssignment';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAssignmentInClass } from '@/api/assignmentApi';  // Import the API function
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";  // Import useUser hook

const Assignment = () => {
  const { classId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();
  const { user, userLoading } = useUser();
  const [isSubmitCardVisible, setSubmitCardVisible] = useState(false);

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
  }, [classId, assignmentId, toast]);

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
    <div className="w-screen main-container mx-5 p-6">
      <Tabs defaultValue="view" className="flex-1">
        {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
          <TabsList className="grid w-1/3 grid-cols-2 mb-3">
            <TabsTrigger value="view">View</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
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
                    <Button onClick={() => setSubmitCardVisible(true)} className="bg-red-200">Submit</Button>
                  </div>
                  <p className="mb-2">{assignment.description}</p>
                </CardContent>
              </Card>
              <div className='white rounded-md flex justify-center items-center'>
                <PDFViewer url={assignment.fileUrl} scale="1"/>
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
          <TabsContent value="edit">
            <EditAssignment assignment={assignment} />
          </TabsContent>
        )}
      </Tabs>
      {isSubmitCardVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="bg-white p-4 shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Submit Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="file" className="mb-2" />
              <Textarea placeholder="Comments" />
              <Button className="mt-2">Submit</Button>
              <Button onClick={() => setSubmitCardVisible(false)} className="mt-2 bg-red-200">Cancel</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Assignment;
