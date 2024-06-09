// src/pages/AssignedPR.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentsData } from '../lib/data';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AssignedPR = () => {
  const { assignmentId } = useParams();
  const assignment = assignmentsData.find((item) => item.id === assignmentId);

  const [expanded, setExpanded] = useState({ box1: false, box2: false });

  if (!assignment) {
    return <div>Assignment not found</div>;
  }

  const toggleExpand = (box) => {
    setExpanded((prev) => ({ ...prev, [box]: !prev[box] }));
  };

  return (
    <div className="w-screen mx-5 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Link to="/peer-review" className="text-xl">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">{assignment.className}: {assignment.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardContent className="bg-gray-100 p-4 rounded">{assignment.description}</CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Peer Review Document 1</CardTitle>
              <Button variant="outline">download</Button>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded relative">
              <div className={`bg-white border border-gray-200 overflow-hidden transition-all duration-300 ${expanded.box1 ? 'h-64' : 'h-32'}`}>
                {/* Preview content */}
                <p className="text-gray-500 p-2">This is a preview of the peer-review document.</p>
              </div>
              <div className="flex justify-center mt-2">
                <Button variant="link" onClick={() => toggleExpand('box1')}>
                  {expanded.box1 ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md mb-6">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Peer Review Document 2</CardTitle>
              <Button variant="outline">download</Button>
            </CardHeader>
            <CardContent className="bg-gray-100 p-4 rounded relative">
              <div className={`bg-white border border-gray-200 overflow-hidden transition-all duration-300 ${expanded.box2 ? 'h-64' : 'h-32'}`}>
                {/* Preview content */}
                <p className="text-gray-500 p-2">This is a preview of the peer-review document.</p>
              </div>
              <div className="flex justify-center mt-2">
                <Button variant="link" onClick={() => toggleExpand('box2')}>
                  {expanded.box2 ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="bg-gray-100 p-4 rounded">Comment Box</CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <h2 className="text-xl font-bold mb-4">Average Peer Review Grade</h2>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={90}
                  text={`${90}%`}
                  styles={buildStyles({
                    textColor: "#4A5568",
                    pathColor: "#4A90E2",
                    trailColor: "#D3D3D3"
                  })}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white p-4 shadow-md">
            <CardContent className="text-center">
              <h2 className="text-xl font-bold mb-4">Assignment Instructor Grade</h2>
              <div className="w-24 mx-auto">
                <CircularProgressbar
                  value={85}
                  text={`${85}%`}
                  styles={buildStyles({
                    textColor: "#4A5568",
                    pathColor: "#4A90E2",
                    trailColor: "#D3D3D3"
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignedPR;
