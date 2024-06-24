import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assignment as assignmentsData, submission as submissionsData } from '@/utils/dbData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Textarea } from "@/components/ui/textarea";
import PDFViewer from '@/components/assign/PDFViewer';

const Assignment = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.assignment_id === parseInt(assignmentId));
  const navigate = useNavigate();

	const [isSubmitCardVisible, setSubmitCardVisible] = useState(false);

	if (!assignment) {
		return <div>Assignment not found</div>;
	}

	const handleBackClick = () => {
		navigate(-1); // This will navigate the user to the previous page
	};

  // Filter submissions for the current assignment
  const assignmentSubmissions = submissionsData.filter(submission => submission.assignment_id === assignment.assignment_id);

  return (
    <div className="w-screen main-container mx-5 p-6">
      <div className="flex rounded-lg mb-6">
        <Button onClick={handleBackClick}>←</Button>
        <div className="flex justify-between items-center ml-4">
          <Menubar className='bg-transparent'>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">HOME</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">GRADES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">PEOPLE</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">GROUPS</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">FILES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600 rounded-lg hover:bg-gray-300">CONTACTS</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-gray-100 p-4 rounded">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div>
                  <p>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                  <p>Attempts: 3</p>
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
