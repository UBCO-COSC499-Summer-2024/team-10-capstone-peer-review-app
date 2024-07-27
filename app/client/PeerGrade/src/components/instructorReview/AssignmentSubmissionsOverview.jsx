import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getAllAssignmentsByClassId } from "@/api/classApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { toast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";
import SubmissionDetails from "./SubmissionDetails";

const AssignmentSubmissionsOverview = () => {
  const { classes } = useClass();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);


  useEffect(() => {
    if (selectedClass) {
      fetchAssignments(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment);
    }
  }, [selectedAssignment]);

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      });
    }
  };

  const fetchAssignments = async (classId) => {
    try {
      const response = await getAllAssignmentsByClassId(classId);
      setAssignments(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      });
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const response = await getSubmissionsForAssignment(assignmentId);
      setSubmissions(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.submitter.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submitter.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assignment Submissions Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.classname}
              </option>
            ))}
          </Select>
          <Select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Assignment</option>
            {assignments.map((assignment) => (
              <option key={assignment.assignmentId} value={assignment.assignmentId}>
                {assignment.title}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Search by student name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.submissionId}>
                <TableCell>
                  {submission.submitter.firstname} {submission.submitter.lastname}
                </TableCell>
                <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                <TableCell>{submission.finalGrade || "Not graded"}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelectedSubmission(submission)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {selectedSubmission && (
        <SubmissionDetails
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </Card>
  );
};

export default AssignmentSubmissionsOverview;