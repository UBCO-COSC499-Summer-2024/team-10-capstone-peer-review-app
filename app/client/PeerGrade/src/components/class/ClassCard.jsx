// src/components/ClassCard.jsx
import React from 'react';
import { User, FileText, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const ClassCard = ({ className, instructor, numStudents, numAssignments, numPeerReviews }) => {
  return (
    <Card className="w-full p-4 bg-white shadow-md rounded-lg">
      <CardHeader className="mb-4">
        <CardTitle className="text-xl font-bold">{className}</CardTitle>
        <CardDescription className="text-gray-500">{instructor}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700">{numStudents} Students</span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700">{numAssignments} Assignments Due</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700">{numPeerReviews} Peer Reviews Left</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
