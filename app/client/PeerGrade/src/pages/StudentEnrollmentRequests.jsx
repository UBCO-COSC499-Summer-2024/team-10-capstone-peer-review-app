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
import { Plus, Users, FileQuestion } from "lucide-react";
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

const StudentEnrollmentRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [enrollRequests, setEnrollRequests] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrollMessage, setEnrollMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showClassesTable, setShowClassesTable] = useState(false);
  const [showRequestsTable, setShowRequestsTable] = useState(false);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 5;

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
        setFilteredClasses(response.data);
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
    setCurrentPage(1);
  };

  const handleEnrollRequest = async () => {
    try {
      await createEnrollRequest(selectedClass.classId, enrollMessage);
      toast({
        title: "Success",
        description: "Enrollment request sent"
      });
      setIsDialogOpen(false);
      setEnrollMessage("");
      fetchEnrollRequests();
    } catch (error) {
      setIsDialogOpen(false); 
      setEnrollMessage("");
    }
  };

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);

  const truncateDescription = (description, maxLength = 50) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-500";
      case "APPROVED":
        return "text-green-500";
      case "DENIED":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
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
            <div className="relative min-h-[150px]">
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  showClassesTable ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="text-center py-8 bg-gray-100 rounded-lg">
                  <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No classes available</h3>
                  <p className="mt-1 text-sm text-gray-500">There are currently no classes available for enrollment.</p>
                </div>
              </div>
              <div
                className={`transition-opacity duration-300 ${
                  showClassesTable ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border px-4 py-2">Class Name</TableHead>
                      <TableHead className="border px-4 py-2">Description</TableHead>
                      <TableHead className="border px-4 py-2">Instructor</TableHead>
                      <TableHead className="border px-4 py-2">Start Date</TableHead>
                      <TableHead className="border px-4 py-2">End Date</TableHead>
                      <TableHead className="border px-4 py-2">Seats Available</TableHead>
                      <TableHead className="border px-4 py-2">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClasses.map((classItem, index) => (
                      <TableRow
                        key={classItem.classId}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="border px-4 py-2">{classItem.classname}</TableCell>
                        <TableCell className="border px-4 py-2">
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
                        <TableCell className="border px-4 py-2">{`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}</TableCell>
                        <TableCell className="border px-4 py-2">
                          {format(new Date(classItem.startDate), "PP")}
                        </TableCell>
                        <TableCell className="border px-4 py-2">
                          {format(new Date(classItem.endDate), "PP")}
                        </TableCell>
                        <TableCell className="border px-4 py-2">
                          {classItem.availableSeats}
                        </TableCell>
                        <TableCell className="border px-4 py-2">
                          <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedClass(classItem)}
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Enroll
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Enroll in {classItem.classname}
                                </DialogTitle>
                              </DialogHeader>
                              <Textarea
                                placeholder="Enter a message for your enrollment request (optional)"
                                value={enrollMessage}
                                onChange={(e) => setEnrollMessage(e.target.value)}
                              />
                              <DialogFooter>
                                <Button onClick={handleEnrollRequest}>
                                  Send Request
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {showClassesTable && (
              <div className="mt-4 flex justify-between">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              My Enrollment Requests
            </h2>
            <div className="relative min-h-[100px]">
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  showRequestsTable ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="text-center py-8 bg-gray-100 rounded-lg">
                  <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollment requests</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't made any enrollment requests yet.</p>
                </div>
              </div>
              <div
                className={`transition-opacity duration-300 ${
                  showRequestsTable ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border px-4 py-2">Class Name</TableHead>
                      <TableHead className="border px-4 py-2">Status</TableHead>
                      <TableHead className="border px-4 py-2">
                        Requested On
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollRequests.map((request, index) => (
                      <TableRow
                        key={request.enrollRequestId}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="border px-4 py-2">
                          {request.class.classname}
                        </TableCell>
                        <TableCell className={`border px-4 py-2 ${getStatusColor(request.status)} font-semibold`}>
                          {request.status}
                        </TableCell>
                        <TableCell className="border px-4 py-2">
                          {format(new Date(request.createdAt), "PP")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentEnrollmentRequests;