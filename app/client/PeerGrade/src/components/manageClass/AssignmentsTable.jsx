import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

const AssignmentsTable = ({ 
  assignments, 
  classId, 
  handleDeleteClick, 
  user,
  renderPagination,
  currentPage,
  setCurrentPage
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Class Assignments</h2>
      {assignments.length === 0 ? (
        <div className="text-center py-4">No assignments found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.assignmentId}>
                <TableCell>{assignment.title}</TableCell>
                <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/class/${classId}/assignment/${assignment.assignmentId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    {user.role !== 'STUDENT' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClick(assignment)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {renderPagination(currentPage, setCurrentPage, assignments.length)}
    </div>
  );
};

export default AssignmentsTable;