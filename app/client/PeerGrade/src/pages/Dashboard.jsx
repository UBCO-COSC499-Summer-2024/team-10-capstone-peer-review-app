// src/pages/Dashboard.jsx
import React from 'react';
import ClassCard from '@/components/class/ClassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssignmentRow from "@/components/assign/AssignmentRow";
import { classesData, assignmentsData } from '../lib/data';

function AssignmentTable({ title, forReview }) {
  const filteredAssignments = assignmentsData.filter(assignment => assignment.forReview === forReview);

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{title}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {filteredAssignments.map((assignment, index) => (
            <TableRow key={index}>
              <TableCell className="p-0">
                <AssignmentRow
                  id={assignment.id}
                  name={assignment.name}
                  className={assignment.className}
                  dueDate={assignment.dueDate}
                  peerReviewDueDate={assignment.peerReviewDueDate}
                  forReview={assignment.forReview}
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
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classesData.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classId={classItem.id}
            className={classItem.name}
            instructor={classItem.instructor}
            numStudents={classItem.numStudents}
            numAssignments={classItem.numAssignments}
            numPeerReviews={classItem.numPeerReviews}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssignmentTable title="Upcoming Assignments" forReview={false} />
        <AssignmentTable title="Upcoming Reviews" forReview={true} />
      </div>
    </div>
  );
}

export default Dashboard;
