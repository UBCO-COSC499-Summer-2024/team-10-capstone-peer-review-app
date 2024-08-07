// This is a component for student enrolment requests. The page renders a list of all classes the user is enrolled in, and allows the user to view the status of each enrollment request.
// The enrollment requests are divided into different status badges for different types of the enrollment request stages (Pending, Approved, Rejected)

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
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
	Plus,
	FileQuestion,
	ChevronLeft,
	ChevronRight,
	Info
} from "lucide-react";

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
	const [showInfoOverlay, setShowInfoOverlay] = useState(false);
	const [infoStep, setInfoStep] = useState(1);

	const { toast } = useToast();

	const ITEMS_PER_PAGE = 3;

	// Fetch the classes and enrollment requests for the user
	useEffect(() => {
		fetchClasses();
		fetchEnrollRequests();
	}, []);

	// Filter the classes based on the search term
	useEffect(() => {
		filterClasses();
	}, [searchTerm, allClasses]);

	// Set the showClassesTable state based on the filteredClasses length
	useEffect(() => {
		setShowClassesTable(filteredClasses.length > 0);
	}, [filteredClasses]);

	// Set the showRequestsTable state based on the enrollRequests length
	useEffect(() => {
		setShowRequestsTable(enrollRequests.length > 0);
	}, [enrollRequests]);

	// Fetch the classes the user is not in
	const fetchClasses = async () => {
		setIsLoading(true);
		try {
			const response = await getAllClassesUserisNotIn();
			if (response.status === "Success") {
				setAllClasses(response.data);
				setFilteredClasses(
					response.data.filter((classItem) => classItem.availableSeats > 0)
				);
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

	// Fetch the enrollment requests for the user
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

	// Filter the classes based on the search term
	const filterClasses = () => {
		const filtered = allClasses.filter((classItem) =>
			classItem.classname.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredClasses(filtered);
		setCurrentClassPage(1);
	};

	// Handle opening the enroll dialog for a class
	const handleOpenEnrollDialog = (classItem) => {
		setSelectedClass(classItem);
	};

	// Handle closing the enroll dialog
	const handleCloseEnrollDialog = () => {
		setSelectedClass(null);
		setEnrollMessage("");
	};

	// Handle sending an enrollment request
	const handleEnrollRequest = async () => {
		if (!selectedClass) return;

		try {
			await createEnrollRequest(selectedClass.classId, enrollMessage);
			toast({
				title: "Success",
				description: "Enrollment request sent",
				variant: "info"
			});
			handleCloseEnrollDialog();
			fetchEnrollRequests();
		} catch (error) {
			handleCloseEnrollDialog();
		}
	};

	// Paginate the classes
	const paginatedClasses = filteredClasses.slice(
		(currentClassPage - 1) * ITEMS_PER_PAGE,
		currentClassPage * ITEMS_PER_PAGE
	);

	// Paginate the enrollment requests
	const paginatedRequests = enrollRequests.slice(
		(currentRequestPage - 1) * ITEMS_PER_PAGE,
		currentRequestPage * ITEMS_PER_PAGE
	);

	// Truncate the description of a class or enrollment request
	const truncateDescription = (description, maxLength = 50) => {
		if (description.length <= maxLength) return description;
		return description.slice(0, maxLength) + "...";
	};

	// Render the info dialog for the enrollment requests page (infoButton guide content)
	const renderInfoDialog = () => {
		if (infoStep === 1) {
			return (
				<DialogContent className="z-50">
					<DialogHeader>
						<DialogTitle>About Enrollment Requests</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="mb-2">The Enrollment Requests page allows you to:</p>
						<ul className="list-disc list-inside mb-4">
							<li>View available classes for enrollment</li>
							<li>Send enrollment requests for classes you're interested in</li>
							<li>Track the status of your enrollment requests</li>
						</ul>
						<p>Use the search bar to find specific classes.</p>
					</DialogDescription>
					<DialogFooter>
						<Button onClick={() => setInfoStep(2)}>Next</Button>
					</DialogFooter>
				</DialogContent>
			);
		} else if (infoStep === 2) {
			return (
				<DialogContent className="z-50">
					<DialogHeader>
						<DialogTitle>Using Enrollment Requests</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="mb-2">
							Here's how to use the Enrollment Requests page:
						</p>
						<ul className="list-disc list-inside mb-4">
							<li>
								Browse available classes in the "Available Classes" section
							</li>
							<li>Click "Enroll" to send a request for a class</li>
							<li>Optionally add a message with your enrollment request</li>
							<li>
								View your pending and past requests in the "My Enrollment
								Requests" section
							</li>
							<li>
								Check the status of your requests (Pending, Approved, or
								Rejected)
							</li>
						</ul>
						<p>
							Keep an eye on your request statuses for updates from instructors!
						</p>
					</DialogDescription>
					<DialogFooter>
						<Button
							onClick={() => {
								setShowInfoOverlay(false);
								setInfoStep(1);
							}}
						>
							Got it
						</Button>
					</DialogFooter>
				</DialogContent>
			);
		}
	};

	// Render the pagination for the enrollment requests page
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
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
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
										showClassesTable
											? "opacity-0 pointer-events-none"
											: "opacity-100"
									}`}
								>
									<div className="text-center py-8 bg-background rounded-lg">
										<FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
										<h3 className="mt-2 text-sm font-medium text-card-foreground">
											No classes available
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											You are either enrolled in all classes available or no
											classes have been added to the system.
										</p>
									</div>
								</div>
								<div
									className={`transition-opacity duration-300 ${
										showClassesTable
											? "opacity-100"
											: "opacity-0 pointer-events-none"
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
													<TableCell>
														{format(new Date(classItem.startDate), "PP")}
													</TableCell>
													<TableCell>
														{format(new Date(classItem.endDate), "PP")}
													</TableCell>
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
									<Dialog
										open={!!selectedClass}
										onOpenChange={() =>
											selectedClass && handleCloseEnrollDialog()
										}
									>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Enroll in {selectedClass?.classname}
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
								</div>
							</div>
							{renderPagination(
								currentClassPage,
								setCurrentClassPage,
								filteredClasses.length
							)}
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-semibold mb-4">
							My Enrollment Requests
						</h2>
						<div className="bg-card p-6 rounded-lg shadow">
							<div className="relative min-h-[85px] bg-background">
								<div
									className={`absolute inset-0 transition-opacity duration-300 ${
										showRequestsTable
											? "opacity-0 pointer-events-none"
											: "opacity-100"
									}`}
								>
									<div className="text-center bg-background rounded-lg">
										<FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
										<h3 className="mt-1 text-sm font-medium text-card-foreground">
											No enrollment requests
										</h3>
										<p className="mt-1 text-sm text-muted-foreground">
											You haven't made any enrollment requests yet.
										</p>
									</div>
								</div>
								<div
									className={`transition-opacity duration-300 ${
										showRequestsTable
											? "opacity-100"
											: "opacity-0 pointer-events-none"
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
													<TableCell>
														{format(new Date(request.createdAt), "PP")}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
							{renderPagination(
								currentRequestPage,
								setCurrentRequestPage,
								enrollRequests.length
							)}
						</div>
					</div>
				</>
			)}

			<Button
				className="fixed bottom-4 right-4 rounded-full w-10 h-10 p-0 z-50"
				onClick={() => setShowInfoOverlay(true)}
			>
				<Info className="w-6 h-6" />
			</Button>

			<Dialog
				open={showInfoOverlay}
				onOpenChange={(open) => {
					setShowInfoOverlay(open);
					if (!open) setInfoStep(1);
				}}
			>
				{renderInfoDialog()}
			</Dialog>
		</div>
	);
};

export default StudentEnrollmentRequests;
