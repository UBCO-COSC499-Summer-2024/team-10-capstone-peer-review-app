// src/pages/Assignment.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assignmentsData } from '../lib/data';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Textarea } from "@/components/ui/textarea";

const Assignment = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.id === assignmentId);
  const navigate = useNavigate();

  const [isSubmitCardVisible, setSubmitCardVisible] = useState(false);

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const handleBackClick = () => {
    navigate(-1); // This will navigate the user to the previous page
  };

  return (
    <div className="w-screen mx-5 p-6">

      <div className="flex rounded-lg">
      <Button onClick={handleBackClick}>←</Button>

        <div className="flex justify-between items-center">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">HOME</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">GRADES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">PEOPLE</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">GROUPS</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">FILES</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="border border-gray-600  rounded-lg hover:bg-gray-300">CONTACTS</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-gray-100 p-4 rounded">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">{assignment.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div>
                  <p>Due: {assignment.dueDate}</p>
                  <p>Attempts: 3</p>
                  <p>Required File Type: PDF</p>
                </div>
                <Button onClick={() => setSubmitCardVisible(true)} className="bg-red-200">Submit</Button>
              </div>
              <p className="mb-2">{assignment.description}</p>
            </CardContent>
          </Card>
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
              <p>Submission 1: File.pdf - 03/12/25</p>
              <p>Submission 2: File2.pdf - 03/14/25</p>
              <p>Submission 3: File3.pdf - 03/16/25</p>
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
