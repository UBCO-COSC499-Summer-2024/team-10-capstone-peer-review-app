// The component for displaying an enrollment request table in the Manage class view page for instructors

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EnrollTable = ({ 
  enrollRequests, 
  handleUpdateEnrollRequest, 
  handleDeleteEnrollRequest,
  renderPagination,
  currentPage,
  setCurrentPage
}) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Enrollment Requests</h2>
      {enrollRequests.length === 0 ? (
        <div className="text-center py-4">No enrollment requests</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollRequests.map((request) => (
              <TableRow key={request.enrollRequestId}>
                <TableCell>{`${request.user.firstname} ${request.user.lastname}`}</TableCell>
                <TableCell>{request.user.email}</TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={request.status.toLowerCase()}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleUpdateEnrollRequest(request.enrollRequestId, "APPROVED")}
                    disabled={request.status === "APPROVED"}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleUpdateEnrollRequest(request.enrollRequestId, "DENIED")}
                    disabled={request.status === "DENIED"}
                  >
                    Deny
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteEnrollRequest(request.enrollRequestId, request.userId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {renderPagination(currentPage, setCurrentPage, enrollRequests.length)}
    </div>
  );
};

export default EnrollTable;