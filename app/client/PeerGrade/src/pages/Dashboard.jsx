import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ClassCard from '@/components/class/ClassCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

function AssignmentTable({ title, assignments, forReview }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 5;

  const sortedAssignments = assignments.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);
  const currentAssignments = sortedAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <TableCell className="p-2">{assignment.className}</TableCell>
              <TableCell className="p-2">{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
              <TableCell className="p-2">
                <Link to={forReview ? `/assignedPR/${assignment.assignmentId}` : `/assignment/${assignment.assignmentId}`} className="bg-green-100 text-blue-500 px-2 py-1 rounded-md">
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
  const currentUser = useSelector((state) => state.user.currentUser);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      const fetchClasses = async () => {
        try {
          const response = await axios.post('/api/users/get-classes', { userId: currentUser.userId });
          setClasses(response.data);
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch classes", variant: "destructive" });
        }
      };

      const fetchAssignments = async () => {
        try {
          const response = await axios.post('/api/users/get-assignments', { userId: currentUser.userId });
          setAssignments(response.data);
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch assignments", variant: "destructive" });
        }
      };

      const fetchReviews = async () => {
        try {
          const response = await axios.get('/api/users/reviews');
          setReviews(response.data);
        } catch (error) {
          toast({ title: "Error", description: "Failed to fetch reviews", variant: "destructive" });
        }
      };

      fetchClasses();
      fetchAssignments();
      fetchReviews();
    }
  }, [currentUser, toast]);

  console.log(classes);

  if (!currentUser) {
    return null;
  }

  const assignmentData = assignments.filter(assignment => assignment.evaluation_type !== 'peer');
  const reviewData = assignments.filter(assignment => assignment.evaluation_type === 'peer');

  return (
    <div className="w-full main-container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.classId}
            classId={classItem.classId}
            className={classItem.classname}
            instructor={`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}
            numStudents={classItem.classSize}
            term={classItem.term}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssignmentTable title="Upcoming Assignments" assignments={assignmentData} forReview={false} />
        <AssignmentTable title="Upcoming Reviews" assignments={reviewData} forReview={true} />
      </div>
      <Toaster />
    </div>
  );
}

export default Dashboard;
