import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { assignment as assignmentsData, submission as submissionsData } from '@/utils/dbData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Pencil, ArrowLeft } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import PDFViewer from '@/components/assign/PDFViewer';
import EditAssignment from './EditAssignment';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Assignment = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.assignment_id === parseInt(assignmentId));
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isSubmitCardVisible, setSubmitCardVisible] = useState(false);

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const handleBackClick = () => {
    navigate(`/class/${assignment.class_id}`);
  };

  // Filter submissions for the current assignment
  const assignmentSubmissions = submissionsData.filter(submission => submission.assignment_id === assignment.assignment_id);

  return (
    <div className="w-screen main-container mx-5 p-6">
      <Tabs defaultValue="view" className="flex-1">
        {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
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
                      <p>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                      <p>Required File Type: {assignment.file_type.toUpperCase()}</p>
                    </div>
                    <Button onClick={() => setSubmitCardVisible(true)} className="bg-red-200">Submit</Button>
                  </div>
                  <p className="mb-2">{assignment.description}</p>
                </CardContent>
              </Card>
              <div className='white rounded-md flex justify-center items-center'>
                <PDFViewer url="https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK" scale="1"/>
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
                  {assignmentSubmissions.map((submission, index) => (
                    <p key={index}>
                      Submission {index + 1}: {submission.file_path.split('/').pop()} - {new Date(submission.submission_date).toLocaleDateString()}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        {(currentUser.role === 'INSTRUCTOR' || currentUser.role === 'ADMIN') && (
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
