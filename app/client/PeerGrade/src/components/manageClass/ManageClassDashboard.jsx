// The component for displaying the dashboard for a class in the Manage class view page for instructors

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClass } from "@/contexts/contextHooks/useClass";
import EditClassDialog from "@/components/manageClass/EditClassModal";
import { Edit, ChevronLeft, ChevronRight, Trash2, Check } from "lucide-react";
import StudentsTable from "@/components/manageClass/StudentsTable";
import EnrollTable from "@/components/manageClass/EnrollTable";
import AssignmentsTable from "@/components/manageClass/AssignmentsTable";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import AddStudentsByCSVDialog from "@/components/class/addStudentsByCSVDialog";
import { getStudentsByClassId, removeStudentFromClass, addStudentToClass, deleteClass } from "@/api/classApi";
import { getAllAssignmentsByClassId, removeAssignmentFromClass } from "@/api/assignmentApi";
import { getUsersByRole } from "@/api/userApi";
import { getEnrollRequestsForClass, updateEnrollRequestStatus, deleteEnrollRequest } from "@/api/enrollmentApi";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";
import DeleteClassDialog from "./DeleteClassDialog";
import DeleteAssignmentDialog from "./DeleteAssignmentDialog";
import InfoButton from '@/components/global/InfoButton';

const ManageClassDashboard = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { classes, setClasses, updateClasses, removeClass } = useClass();
  const [classData, setClassData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteClassDialogOpen, setDeleteClassDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [enrollRequests, setEnrollRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addByCSVOpen, setAddByCSVOpen] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [currentEnrollRequestPage, setCurrentEnrollRequestPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [assignments, setAssignments] = useState([]);
  const [currentAssignmentPage, setCurrentAssignmentPage] = useState(1);
  const [confirmDeleteClass, setConfirmDeleteClass] = useState(false);
  const [confirmDeleteAssignment, setConfirmDeleteAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteAssignmentDialogOpen, setDeleteAssignmentDialogOpen] = useState(false);

  // Fetch the assignments when the class changes
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAllAssignmentsByClassId(classId);
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [classId]);


  // Handle deleting an assignment
  const handleDeleteAssignment = async () => {
    if (confirmDeleteAssignment) {
      setConfirmDeleteAssignment(false);
      if (selectedAssignment) {
        try {
          const response = await removeAssignmentFromClass(selectedAssignment.assignmentId);
          if (response.status === "Success") {
            setDeleteAssignmentDialogOpen(false);
            setAssignments((prevAssignments) =>
              prevAssignments.filter(
                (assignment) => assignment.assignmentId !== selectedAssignment.assignmentId
              )
            );
            toast({
              title: "Success",
              description: "Assignment deleted successfully",
              variant: "positive"
            });
          } else {
            throw new Error(response.message);
          }
        } catch (error) {
          console.error("Error deleting assignment:", error);
          toast({
            title: "Error",
            description: "Failed to delete assignment",
            variant: "destructive"
          });
        }
      }
    } else {
      setConfirmDeleteAssignment(true);
    }
  };

  // Fetch the class data when the class changes
  useEffect(() => {
    const currentClass = classes.find((c) => c.classId === classId);
    setClassData(currentClass);
    fetchStudents();
    fetchEnrollRequests();
  }, [classId, classes]);

  // Fetch the students when the class changes
  const fetchStudents = async () => {
    const studentsData = await getStudentsByClassId(classId);
    if (studentsData.status === "Success") {
      setStudents(studentsData.data);
    }
  };

  // Fetch the enrollment requests when the class changes
  const fetchEnrollRequests = async () => {
    const requests = await getEnrollRequestsForClass(classId);
    if (requests.status === "Success") {
      setEnrollRequests(requests.data);
    }
  };

  // Fetch all students when the user changes
  useEffect(() => {
    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      const fetchAllStudents = async () => {
        try {
          const response = await getUsersByRole("STUDENT");
          if (response.status === "Success") {
            const currentStudentIds = students.map((student) => student.userId);
            const transformedStudents = response.data
              .filter((student) => !currentStudentIds.includes(student.userId))
              .map((student) => ({
                studentId: student.userId,
                label: student.firstname + " " + student.lastname
              }));
            setStudentOptions(transformedStudents);
          }
        } catch (error) {
          console.error("An error occurred while fetching students.", error);
        }
      };

      fetchAllStudents();
    }
  }, [user, students]);

  
  // Handle adding students to the class
  const handleAddStudents = async (e) => {
    e.preventDefault();
    if (selectedStudents.length > 0) {
      for (const student of selectedStudents) {
        const addStudent = await addStudentToClass(classId, student);
        if (addStudent.status === "Success") {
          setStudents((prevStudents) => [...prevStudents, addStudent.data]);
        } else {
          console.error(
            "An error occurred while adding the student.",
            addStudent.message
          );
        }
      }
    }
    setAddDialogOpen(false);
    setSelectedStudents([]);
  };

  // Handle updating an enrollment request  
  const handleUpdateEnrollRequest = async (enrollRequestId, status) => {
    try {
      const result = await updateEnrollRequestStatus(enrollRequestId, status);
      if (result.status === "Success") {
        setEnrollRequests(prevRequests => 
          prevRequests.map(request => 
            request.enrollRequestId === enrollRequestId 
              ? { ...request, status: status }
              : request
          )
        );

        if (status === "APPROVED") {
          const approvedRequest = enrollRequests.find(request => request.enrollRequestId === enrollRequestId);
          if (approvedRequest) {
            const newStudent = {
              userId: approvedRequest.user.userId,
              firstname: approvedRequest.user.firstname,
              lastname: approvedRequest.user.lastname,
              email: approvedRequest.user.email,
              avatarUrl: approvedRequest.user.avatarUrl
            };
            setStudents(prevStudents => [...prevStudents, newStudent]);
          }
        }

        toast({
          title: "Success",
          description: `Enrollment request ${status.toLowerCase()}`
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment request: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Handle deleting an enrollment request
  const handleDeleteEnrollRequest = async (enrollRequestId, userId) => {
    try {
      const result = await deleteEnrollRequest(enrollRequestId, userId);
      if (result.status === "Success") {
        setEnrollRequests(prevRequests => 
          prevRequests.filter(request => request.enrollRequestId !== enrollRequestId)
        );
        toast({
          title: "Success",
          description: "Enrollment request deleted"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete enrollment request: " + error.message,
        variant: "destructive"
      });
    }
  };

  // Handle editing the class
  const handleEditClass = () => {
    setEditModalOpen(true);
  };

	// Handle deleting the class
	const handleDeleteClass = (selected_class) => {
		setConfirmDeleteClass(false);
		setDeleteClassDialogOpen(true);
	};

  // Handle deleting the class
	const deleteClass = async () => {
		if (confirmDeleteClass) {
			setConfirmDeleteAssignment(false);
			if (classData) {
				removeClass(classData.classId);
				setDeleteClassDialogOpen(false);
        navigate(-1);
			} else {
				console.error(
					"An error occurred while deleting the class.",
					classData.message
				);
			}
		} else {
			setConfirmDeleteClass(true);
		}
	};

  // Filter the students based on the search term
  const filteredStudents = students.filter((student) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentStudentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const indexOfLastEnrollRequest = currentEnrollRequestPage * itemsPerPage;
  const indexOfFirstEnrollRequest = indexOfLastEnrollRequest - itemsPerPage;
  const currentEnrollRequests = enrollRequests.slice(indexOfFirstEnrollRequest, indexOfLastEnrollRequest);

  // Render the pagination
  const renderPagination = (currentPage, setCurrentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalItems === 0) {
      return null;
    }

    return (
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  };

  if (!classData) return <div>Loading...</div>;

  const infoContent = {
    title: "Manage Class Dashboard",
    description: (
      <>
        <p>This dashboard allows you to manage all aspects of your class:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Edit class details or delete the class</li>
          <li>Manage enrolled students:
            <ul className="list-disc list-inside ml-4">
              <li>View and search current students</li>
              <li>Add new students individually or via CSV</li>
              <li>Remove students from the class</li>
            </ul>
          </li>
          <li>Handle enrollment requests:
            <ul className="list-disc list-inside ml-4">
              <li>Approve or reject pending requests</li>
              <li>Delete enrollment requests</li>
            </ul>
          </li>
          <li>Manage assignments:
            <ul className="list-disc list-inside ml-4">
              <li>View all assignments for the class</li>
              <li>Create new assignments</li>
              <li>Edit or delete existing assignments</li>
            </ul>
          </li>
        </ul>
        <p className="mt-2">Use the tables and buttons provided to perform these actions efficiently.</p>
      </>
    )
  };

  return (
    <div className="w-full rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold">{classData.classname}</h1>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={handleEditClass}
            className="mr-2"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Class
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClass}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Class
          </Button>
        </div>
      </div>

      <StudentsTable 
        students={currentStudents}
        setStudents={setStudents}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAddByCSVOpen={setAddByCSVOpen}
        setAddDialogOpen={setAddDialogOpen}
        user={user}
        classId={classId}
        renderPagination={renderPagination}
        currentPage={currentStudentPage}
        setCurrentPage={setCurrentStudentPage}
      />

      <EnrollTable 
        enrollRequests={currentEnrollRequests}
        handleUpdateEnrollRequest={handleUpdateEnrollRequest}
        handleDeleteEnrollRequest={handleDeleteEnrollRequest}
        renderPagination={renderPagination}
        currentPage={currentEnrollRequestPage}
        setCurrentPage={setCurrentEnrollRequestPage}
      />

      <AssignmentsTable 
        assignments={assignments.slice((currentAssignmentPage - 1) * itemsPerPage, currentAssignmentPage * itemsPerPage)}
        setAssignments={setAssignments}
        classId={classId}
        user={user}
        renderPagination={renderPagination}
        currentPage={currentAssignmentPage}
        setCurrentPage={setCurrentAssignmentPage}
      />


      <EditClassDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        classItem={classData}
      />

      <DeleteClassDialog 
        open={deleteClassDialogOpen}
        onOpenChange={setDeleteClassDialogOpen}
        confirmDelete={confirmDeleteClass}
        selectedClass={classData}
        handleDeleteClass={deleteClass}
      />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudents}>
            <div className="mb-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedStudents.length > 0
                      ? `${selectedStudents.length} student(s) selected`
                      : "Select students..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search students..." />
                    <CommandList>
                      <CommandEmpty>No students found.</CommandEmpty>
                      <CommandGroup>
                        {studentOptions.map((student) => (
                          <CommandItem
                            key={student.studentId}
                            onSelect={() => {
                              setSelectedStudents((prev) =>
                                prev.includes(student.studentId)
                                  ? prev.filter((id) => id !== student.studentId)
                                  : [...prev, student.studentId]
                              );
                            }}
                          >
                            {student.label}
														<Check
															className={`ml-auto h-4 w-4 ${selectedStudents.includes(student.studentId) ? "opacity-100" : "opacity-0"}`}
														/>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <DialogFooter>
              <Button onClick={() => setAddDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddStudentsByCSVDialog
        classId={classId}
        open={addByCSVOpen}
        onOpenChange={setAddByCSVOpen}
        onStudentsAdded={fetchStudents}
      />
    
      <DeleteAssignmentDialog 
        dialogOpen={deleteAssignmentDialogOpen}
        setDialogOpen={setDeleteAssignmentDialogOpen}
        confirmDelete={confirmDeleteAssignment}
        selectedAssignment={selectedAssignment}
        handleDeleteAssignment={handleDeleteAssignment}
      />
      <InfoButton content={infoContent} />
    </div>
  );
};

export default ManageClassDashboard;