import { useSelector } from 'react-redux';
import ClassCard from '@/components/class/ClassCard';
import DataTable from '@/components/ui/data-table';
import { iClass as classesData, assignment as assignmentsData, user } from '@/lib/dbData';
import { ArrowUpDown } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Dashboard() {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!currentUser) {
    return null;
  }

  const userClasses = classesData.filter(classItem => Array.isArray(currentUser.classes) && currentUser.classes.includes(classItem.class_id));

  const assignmentColumns = [
    {
      accessorKey: "title",
      header: "Assignment Name",
    },
    {
      accessorKey: "className",
      header: "Class Name",
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="destructive">{row.getValue("dueDate")}</Badge>
      )
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Link to={row.original.link} className="bg-green-100 text-blue-500 px-2 py-1 rounded-md">
          {row.getValue("action")}
        </Link>
      ),
    },
  ];

  const reviewColumns = [
    {
      accessorKey: "title",
      header: "Assignment Name",
    },
    {
      accessorKey: "className",
      header: "Class Name",
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Review Due
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="destructive">{row.getValue("dueDate")}</Badge>
      )
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Link to={row.original.link} className="bg-green-100 text-blue-500 px-2 py-1 rounded-md">
          {row.getValue("action")}
        </Link>
      ),
    },
  ];

  const assignmentData = assignmentsData
    .filter(assignment => assignment.evaluation_type !== 'peer')
    .map(assignment => ({
      id: assignment.assignment_id,
      title: assignment.title,
      className: classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname,
      dueDate: new Date(assignment.due_date).toLocaleDateString(),
      action: 'Open',
      link: `/assignment/${assignment.assignment_id}`
    }));

  const reviewData = assignmentsData
    .filter(assignment => assignment.evaluation_type === 'peer')
    .map(assignment => ({
      id: assignment.assignment_id,
      title: assignment.title,
      className: classesData.find(classItem => classItem.class_id === assignment.class_id)?.classname,
      dueDate: new Date(assignment.due_date).toLocaleDateString(),
      action: 'Review',
      link: `/assignedPR/${assignment.assignment_id}`
    }));

  return (
    <div className="w-full main-container py-6 space-y-6">
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
      <Tabs defaultValue="assignments" className="w-1/2">
        <TabsList className="grid w-1/2 grid-cols-2">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments">
          <DataTable title="Upcoming Assignments" data={assignmentData} columns={assignmentColumns} pageSize={5} />
        </TabsContent>
        <TabsContent value="reviews">
          <DataTable title="Upcoming Reviews" data={reviewData} columns={reviewColumns} pageSize={5} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
