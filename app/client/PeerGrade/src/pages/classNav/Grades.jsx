import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { submission as submissionsData, user as usersData } from '@/utils/dbData';

const Grades = ({ classAssignments }) => {
  const [expanded, setExpanded] = useState(null);
  const currentUser = usersData[1]; // Assuming the second user is the logged-in user for this example

  const toggleExpand = (submissionId) => {
    setExpanded((prev) => (prev === submissionId ? null : submissionId));
  };

  // Filter submissions for the current user and class assignments
  const userSubmissions = submissionsData.filter(submission => 
    submission.student_id === currentUser.user_id && 
    classAssignments.some(assignment => assignment.assignment_id === submission.assignment_id)
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
        <CardTitle className="text-xl font-bold">Class Grades</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Assignment</TableHead>
              <TableHead className="text-left">Document Status</TableHead>
              <TableHead className="text-left">Due Date</TableHead>
              <TableHead className="text-left">Grade</TableHead>
              <TableHead className="text-left">Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userSubmissions.map((submission) => (
              <React.Fragment key={submission.submission_id}>
                <TableRow>
                  <TableCell className="flex items-center">
                    <FileText className="mr-2" /> {classAssignments.find(assignment => assignment.assignment_id === submission.assignment_id)?.title}
                  </TableCell>
                  <TableCell className="text-center">
                    <FileText className="mx-auto" />
                  </TableCell>
                  <TableCell>{new Date(submission.submission_date).toLocaleDateString()}</TableCell>
                  <TableCell>{submission.marks}/100</TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => toggleExpand(submission.submission_id)}>
                      {expanded === submission.submission_id ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded === submission.submission_id && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-gray-100 p-4 rounded mt-2 transition-all duration-300 ease-in-out">
                        {submission.feedback}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Grades;
