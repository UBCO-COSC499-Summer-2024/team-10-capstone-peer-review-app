import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Plus, Users, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllClassesUserisNotIn } from "@/api/classApi";
import {
  createEnrollRequest,
  getEnrollRequestsForUser
} from "@/api/enrollmentApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const StudentEnrollmentRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [enrollRequests, setEnrollRequests] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [currentClassPage, setCurrentClassPage] = useState(1);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showClassesTable, setShowClassesTable] = useState(false);
  const [showRequestsTable, setShowRequestsTable] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    fetchClasses();
    fetchEnrollRequests();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchTerm, allClasses]);

  useEffect(() => {
    setShowClassesTable(filteredClasses.length > 0);
  }, [filteredClasses]);

  useEffect(() => {
    setShowRequestsTable(enrollRequests.length > 0);
  }, [enrollRequests]);

  

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await getAllClassesUserisNotIn();
      if (response.status === "Success") {
        setAllClasses(response.data);
        setFilteredClasses(response.data.filter((classItem) => classItem.availableSeats > 0));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch classes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollRequests = async () => {
    try {
      const requests = await getEnrollRequestsForUser();
      if (requests.status === "Success") {
        setEnrollRequests(requests.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch enrollment requests",
        variant: "destructive"
      });
    }
  };

  const filterClasses = () => {
    const filtered = allClasses.filter((classItem) =>
      classItem.classname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
    setCurrentClassPage(1);
  };

  const handleOpenEnrollDialog = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleCloseEnrollDialog = () => {
    setSelectedClass(null);
    setEnrollMessage("");
  };

  const handleEnrollRequest = async () => {
    if (!selectedClass) return;

    try {
      await createEnrollRequest(selectedClass.classId, enrollMessage);
      toast({
        title: "Success",
        description: "Enrollment request sent"
      });
      handleCloseEnrollDialog();
      fetchEnrollRequests();
    } catch (error) {
      handleCloseEnrollDialog(); 
    }
  };

  const paginatedClasses = filteredClasses.slice(
    (currentClassPage - 1) * ITEMS_PER_PAGE,
    currentClassPage * ITEMS_PER_PAGE
  );

  const paginatedRequests = enrollRequests.slice(
    (currentRequestPage - 1) * ITEMS_PER_PAGE,
    currentRequestPage * ITEMS_PER_PAGE
  );

  const truncateDescription = (description, maxLength = 50) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
  };

  const renderPagination = (currentPage, setCurrentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
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

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enroll in Classes</h1>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoading ? (
        <div>Loading classes...</div>
      ) : (
        <>
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="relative min-h-[150px]">
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    showClassesTable ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="text-center py-8 bg-background rounded-lg">
                    <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-card-foreground">No classes available</h3>
                    <p className="mt-1 text-sm text-muted-foreground">There are currently no classes available for enrollment.</p>
                  </div>
                </div>
                <div
                  className={`transition-opacity duration-300 ${
                    showClassesTable ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Seats Available</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedClasses.map((classItem) => (
                        <TableRow key={classItem.classId}>
                          <TableCell>{classItem.classname}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {truncateDescription(classItem.description)}
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{classItem.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>{`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}</TableCell>
                          <TableCell>{format(new Date(classItem.startDate), "PP")}</TableCell>
                          <TableCell>{format(new Date(classItem.endDate), "PP")}</TableCell>
                          <TableCell>{classItem.availableSeats}</TableCell>
                          <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEnrollDialog(classItem)}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Enroll
                                </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Enroll Dialog */}
                  <Dialog open={!!selectedClass} onOpenChange={() => selectedClass && handleCloseEnrollDialog()}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enroll in {selectedClass?.classname}</DialogTitle>
                      </DialogHeader>
                      <Textarea
                        placeholder="Enter a message for your enrollment request (optional)"
                        value={enrollMessage}
                        onChange={(e) => setEnrollMessage(e.target.value)}
                      />
                      <DialogFooter>
                        <Button onClick={handleEnrollRequest}>Send Request</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                </div>
              </div>
              {renderPagination(currentClassPage, setCurrentClassPage, filteredClasses.length)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">My Enrollment Requests</h2>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="relative min-h-[85px] bg-background">
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    showRequestsTable ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                >
                  <div className="text-center bg-background rounded-lg">
                    <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-1 text-sm font-medium text-card-foreground">No enrollment requests</h3>
                    <p className="mt-1 text-sm text-muted-foreground">You haven't made any enrollment requests yet.</p>
                  </div>
                </div>
                <div
                  className={`transition-opacity duration-300 ${
                    showRequestsTable ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requested On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRequests.map((request) => (
                        <TableRow key={request.enrollRequestId}>
                          <TableCell>{request.class.classname}</TableCell>
                          <TableCell>
                            <Badge variant={request.status.toLowerCase()}>
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(request.createdAt), "PP")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {renderPagination(currentRequestPage, setCurrentRequestPage, enrollRequests.length)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentEnrollmentRequests;