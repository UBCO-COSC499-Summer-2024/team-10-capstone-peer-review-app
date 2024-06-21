import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassCard from '@/components/class/ClassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { iClass as classesData, assignment as assignmentsData, user } from '@/utils/dbData'; //DB CALL
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from 'lucide-react';

// Need to import useSelector from react-redux? 

function AssignmentTable({ title, forReview }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

  // Filter and sort assignments based on review status
  const filteredAssignments = assignmentsData
    .filter(assignment => (forReview ? assignment.evaluation_type === 'peer' : true))
    .sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const currentAssignments = filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
            <TableHead className="text-left flex items-center cursor-pointer" onClick={handleSort}>
              {forReview ? 'Review Due' : 'Due'} {sortOrder === 'asc' ? <ArrowUp className="ml-1 h-5 w-5" /> : <ArrowDown className="ml-1 h-5 w-5" />}
            </TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAssignments.map((assignment, index) => (
            <TableRow key={index}>
              <TableCell className="p-2">{assignment.title}</TableCell>
              <TableCell className="p-2">{classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname}</TableCell>
              <TableCell className="p-2">{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
              <TableCell className="p-2">
                <Link to={forReview ? `/assignedPR/${assignment.assignment_id}` : `/assignment/${assignment.assignment_id}`} className="bg-green-100 text-blue-500 px-2 py-1 rounded-md">
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
  // Eslint is asking to use a namedSelector I.E. 
  /* 
  // selectors/user.js
  export const selectCurrentUser = (state) => state.user.currentUser;

  // Dashboard.jsx
  import { selectCurrentUser } from 'selectors/user';

  function Dashboard() {
  const currentUser = useSelector(selectCurrentUser);

  // ...
  }
  */ 
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return null;
  }

  // Ensure currentUser.class_id is an array
  const userClasses = classesData.filter(classItem => Array.isArray(currentUser.classes) && currentUser.classes.includes(classItem.class_id));

  return (
    <div className="w-full main-container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userClasses.map((classItem) => (
          <ClassCard
            key={classItem.class_id}
            classId={classItem.class_id}
            className={classItem.classname}
            instructor={user.find(instructor => instructor.user_id === classItem.instructor_id)?.firstname + ' ' + user.find(instructor => instructor.user_id === classItem.instructor_id)?.lastname}
            numStudents={user.filter(student => Array.isArray(student.classes) && student.classes.includes(classItem.class_id)).length}
            numAssignments={assignmentsData.filter(assignment => assignment.class_id === classItem.class_id).length}
            numPeerReviews={assignmentsData.filter(assignment => assignment.class_id === classItem.class_id && assignment.evaluation_type === 'peer').length}
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
