// src/pages/Dashboard.jsx
import React from 'react';
import ClassCard from '@/components/class/ClassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssignmentRow from "@/components/assign/AssignmentRow";

const assignments = [
  { name: "Integral Calculations", className: "Math 101", dueDate: "03/14/25" },
  { name: "Linear Algebra", className: "Math 202", dueDate: "04/22/25" },
  { name: "Data Structures", className: "CS 303", dueDate: "05/11/25" },
];

function AssignmentTable({ title }) {
  return (
    <div className="w-full  bg-white shadow-md rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{title}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment, index) => (
            <TableRow key={index}>
              <TableCell className="p-0">
                <AssignmentRow
                  name={assignment.name}
                  className={assignment.className}
                  dueDate={assignment.dueDate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClassCard
          className="COSC499"
          instructor="Instructor Name"
          numStudents={5}
          numAssignments={4}
          numPeerReviews={2}
        />
        <ClassCard
          className="COSC499"
          instructor="Instructor Name"
          numStudents={5}
          numAssignments={4}
          numPeerReviews={2}
        />
        <ClassCard
          className="COSC499"
          instructor="Instructor Name"
          numStudents={5}
          numAssignments={4}
          numPeerReviews={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssignmentTable />
        <AssignmentTable />
      </div>
    </div>
  );
}

export default Dashboard;