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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/utils/utils";
import { getAllAssignmentsByClassId } from "@/api/assignmentApi";
import { getSubmissionsForAssignment } from "@/api/submitApi";
import { toast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";
import SubmissionDetails from "@/components/instructorReview/SubmissionDetails";

const ManageReviews = () => {
  const { classes, loading } = useClass();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openClass, setOpenClass] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);

  useEffect(() => {
    if (classes && classes.length > 0 && selectedClass) {
      fetchAssignments(selectedClass);
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment);
    }
  }, [selectedAssignment]);

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
          {loading ? (
            <Button variant="outline" disabled>Loading Classes...</Button>
          ) : classes && classes.length > 0 ? (
            <Popover open={openClass} onOpenChange={setOpenClass}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClass}
                  className="w-[200px] justify-between"
                >
                  {selectedClass
                    ? classes.find((cls) => cls.classId === selectedClass)?.classname
                    : "Select Class"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search class..." />
                  <CommandEmpty>No class found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {(classes || []).map((cls) => (
                        <CommandItem
                          key={cls.classId}
                          onSelect={() => {
                            setSelectedClass(cls.classId === selectedClass ? "" : cls.classId);
                            setOpenClass(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClass === cls.classId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {cls.classname}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" disabled>No Classes Available</Button>
          )}

          {assignments && assignments.length > 0 ? (
            <Popover open={openAssignment} onOpenChange={setOpenAssignment}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAssignment}
                  className="w-[200px] justify-between"
                  disabled={!selectedClass}
                >
                  {selectedAssignment
                    ? assignments.find((a) => a.assignmentId === selectedAssignment)?.title
                    : "Select Assignment"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search assignment..." />
                  <CommandEmpty>No assignment found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {(assignments || []).map((assignment) => (
                        <CommandItem
                          key={assignment.assignmentId}
                          onSelect={() => {
                            setSelectedAssignment(
                              assignment.assignmentId === selectedAssignment ? "" : assignment.assignmentId
                            );
                            setOpenAssignment(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedAssignment === assignment.assignmentId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {assignment.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <Button variant="outline" disabled>
              {selectedClass ? "No Assignments Available" : "Select a Class First"}
            </Button>
          )}

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

export default ManageReviews;