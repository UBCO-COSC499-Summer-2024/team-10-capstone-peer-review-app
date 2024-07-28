import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import DeleteAssignmentDialog from './DeleteAssignmentDialog';
import { removeAssignmentFromClass } from '@/api/assignmentApi';

const AssignmentsTable = ({ 
  assignments, 
  setAssignments,
  classId,
  user,
  renderPagination,
  currentPage,
  setCurrentPage
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteAssignmentOpen, setDeleteAssignmentOpen] = useState(false);

  const handleDeleteClick = (assignment) => {
    setConfirmDelete(false);
    setSelectedAssignment(assignment);
    setDeleteAssignmentOpen(true);
  };

  const handleDeleteAssignment = async () => {
    if (confirmDelete && selectedAssignment) {
        setConfirmDelete(false);
        try {
            const response = await removeAssignmentFromClass(selectedAssignment.assignmentId);
            if (response.status === "Success") {
                setAssignments((prevAssignments) =>
                    prevAssignments.filter(
                        (assignment) => assignment.assignmentId !== selectedAssignment.assignmentId
                    )
                );
                setDeleteAssignmentOpen(false);
            } else {
                console.error("An error occurred while deleting the assignment.", response.message);
            }
        } catch (error) {
            console.error("Error deleting assignment:", error.response?.data || error.message);
        }
    } else {
        setConfirmDelete(true);
    }
  };

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
      <DeleteAssignmentDialog 
        dialogOpen={deleteAssignmentOpen}
        setDialogOpen={setDeleteAssignmentOpen}
        confirmDelete={confirmDelete}
        selectedAssignment={selectedAssignment}
        handleDeleteAssignment={handleDeleteAssignment}
      />
    </div>
  );
};

export default AssignmentsTable;
