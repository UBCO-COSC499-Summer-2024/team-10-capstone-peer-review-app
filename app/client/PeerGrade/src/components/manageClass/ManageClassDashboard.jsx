import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClass } from "@/contexts/contextHooks/useClass";
import EditClassDialog from "@/components/manageClass/EditClassModal";
import { Users, FileText, Edit, Plus, MinusCircle, FileUp, ChevronLeft, ChevronRight, FileQuestion, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
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
import { Badge } from "@/components/ui/badge";
import AddStudentsByCSVDialog from "@/components/class/addStudentsByCSVDialog";
import { getStudentsByClassId, removeStudentFromClass, addStudentToClass, deleteClass } from "@/api/classApi";
import { getUsersByRole } from "@/api/userApi";
import { getEnrollRequestsForClass, updateEnrollRequestStatus, deleteEnrollRequest } from "@/api/enrollmentApi";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/contextHooks/useUser";

const ManageClassDashboard = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { classes, setClasses, updateClasses } = useClass();
  const [classData, setClassData] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const currentClass = classes.find((c) => c.classId === classId);
    setClassData(currentClass);
    fetchStudents();
    fetchEnrollRequests();
  }, [classId, classes]);

  const fetchStudents = async () => {
    const studentsData = await getStudentsByClassId(classId);
    if (studentsData.status === "Success") {
      setStudents(studentsData.data);
    }
  };

  const fetchEnrollRequests = async () => {
    const requests = await getEnrollRequestsForClass(classId);
    if (requests.status === "Success") {
      setEnrollRequests(requests.data);
    }
  };

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

  const handleDeleteStudent = async (student) => {
    const result = await removeStudentFromClass(classId, student.userId);
    if (result.status === "Success") {
      setStudents(students.filter(s => s.userId !== student.userId));
      toast({
        title: "Success",
        description: "Student removed from class"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to remove student",
        variant: "destructive"
      });
    }
  };

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

  const handleEditClass = () => {
    setEditModalOpen(true);
  };

  const handleDeleteClass = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClass = async () => {
    try {
      const result = await deleteClass(classId);
      if (result.status === "Success") {
        toast({
          title: "Success",
          description: "Class deleted successfully"
        });
        setClasses(classes.filter(c => c.classId !== classId));
        navigate("/manage-class");  // Redirect to the classes list page
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("An error occurred while deleting the class.", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.firstname} ${student.lastname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const indexOfLastStudent = currentStudentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const indexOfLastEnrollRequest = currentEnrollRequestPage * itemsPerPage;
  const indexOfFirstEnrollRequest = indexOfLastEnrollRequest - itemsPerPage;
  const currentEnrollRequests = enrollRequests.slice(indexOfFirstEnrollRequest, indexOfLastEnrollRequest);

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

  return (
    <div className="w-full rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{classData.classname}</h1>
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

      {/* Students Table */}
      <div className="bg-card p-6 rounded-lg shadow mb-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Students</h2>
          {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
            <div>
              <Button
                variant="ghost"
                className="bg-accent h-7 w-7 mr-2"
                onClick={() => setAddByCSVOpen(true)}
              >
                <FileUp className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                className="bg-accent h-7 w-7"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
        <Input
          type="text"
          placeholder="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {filteredStudents.length === 0 ? (
          <div className="text-center py-4">No students found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student.userId}>
                  <TableCell className="flex items-center mt-1">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage src={student.avatarUrl} alt={`${student.firstname} ${student.lastname}`} />
                      <AvatarFallback>{getInitials(student.firstname, student.lastname)}</AvatarFallback>
                    </Avatar>
                    {student.firstname} {student.lastname}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                      <Button
                        variant="outline"
                        className="bg-accent"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        <MinusCircle className="w-5 h-5 mr-2" /> Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {renderPagination(currentStudentPage, setCurrentStudentPage, filteredStudents.length)}
      </div>

      {/* Enrollment Requests Table */}
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
              {currentEnrollRequests.map((request) => (
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
        {renderPagination(currentEnrollRequestPage, setCurrentEnrollRequestPage, enrollRequests.length)}
      </div>

      <EditClassDialog
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        classItem={classData}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this class? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteClass}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default ManageClassDashboard;