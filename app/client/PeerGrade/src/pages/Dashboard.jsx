// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClassCard from '@/components/class/ClassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { classesData, assignmentsData } from '../lib/data';
import { Button } from "@/components/ui/button";
import {  ArrowUp, ArrowDown } from 'lucide-react';

function AssignmentTable({ title, forReview }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 5;

  const filteredAssignments = assignmentsData
    .filter(assignment => assignment.forReview === forReview)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const currentAssignments = filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">{title}</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-left">Assignment Name</TableHead>
            <TableHead className="text-left">Class Name</TableHead>
            {forReview ? (
              <TableHead className="text-left flex items-center cursor-pointer" onClick={handleSort}>
                Review Due {sortOrder === 'asc' ? <ArrowUp className="ml-1 h-5 w-5" /> : <ArrowDown className="ml-1 h-5 w-5" />}
              </TableHead>
            ) : (
              <TableHead className="text-left flex items-center cursor-pointer" onClick={handleSort}>
                Due {sortOrder === 'asc' ? <ArrowUp className="ml-1" /> : <ArrowDown className="ml-1" />}
              </TableHead>
            )}
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAssignments.map((assignment, index) => (
            <TableRow key={index}>
              <TableCell className="p-2">{assignment.name}</TableCell>
              <TableCell className="p-2">{assignment.className}</TableCell>
              {forReview && <TableCell className="p-2">{assignment.peerReviewDueDate}</TableCell>}
              {!forReview && <TableCell className="p-2">{assignment.dueDate}</TableCell>}
              <TableCell className="p-2">
                <Link to={forReview ? `/assignedPR/${assignment.id}` : `/assignment/${assignment.id}`} className="bg-green-100 text-blue-500 px-2 py-1 rounded-md">
                  {forReview ? 'Review' : 'Open'}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between p-4">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
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
