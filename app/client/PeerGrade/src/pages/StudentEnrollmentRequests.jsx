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
import { getAllClasses } from "@/api/classApi";
import {
	createEnrollRequest,
	getEnrollRequestsForUser
} from "@/api/enrollmentApi";

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
	const { toast } = useToast();

	const ITEMS_PER_PAGE = 5;

	useEffect(() => {
		fetchClasses();
		fetchEnrollRequests();
	}, []);

	useEffect(() => {
		filterClasses();
	}, [searchTerm, allClasses]);

	const fetchClasses = async () => {
		setIsLoading(true);
		try {
			const response = await getAllClasses();
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
			toast({
				title: "Error",
				description: "Failed to fetch classes",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchEnrollRequests = async () => {
		try {
			const requests = await getEnrollRequestsForUser();
			setEnrollRequests(requests);
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
			toast({
				title: "Error",
				description: "Failed to send enrollment request",
				variant: "destructive"
			});
		}
	};

	const paginatedClasses = filteredClasses.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	const totalPages = Math.ceil(filteredClasses.length / ITEMS_PER_PAGE);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Enroll in Classes</h1>

			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2">Search for Classes</h2>
				<Input
					placeholder="Search classes..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="mb-4"
				/>
			</div>

			{isLoading ? (
				<div>Loading classes...</div>
			) : (
				<>
					<div className="mb-10">
						<h2 className="text-xl font-semibold mb-2">Available Classes</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Class Name</TableHead>
									<TableHead>Instructor</TableHead>
									<TableHead>Start Date</TableHead>
									<TableHead>End Date</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedClasses.map((classItem) => (
									<TableRow key={classItem.classId}>
										<TableCell>{classItem.classname}</TableCell>
										<TableCell>{`${classItem.instructor.firstname} ${classItem.instructor.lastname}`}</TableCell>
										<TableCell>
											{format(new Date(classItem.startDate), "PP")}
										</TableCell>
										<TableCell>
											{format(new Date(classItem.endDate), "PP")}
										</TableCell>
										<TableCell>
											<Dialog
												open={isDialogOpen}
												onOpenChange={setIsDialogOpen}
											>
												<DialogTrigger asChild>
													<Button onClick={() => setSelectedClass(classItem)}>
														Request Enrollment
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
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-2">
							My Enrollment Requests
						</h2>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Class Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Requested On</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{enrollRequests.map((request) => (
									<TableRow key={request.enrollRequestId}>
										<TableCell>{request.class.classname}</TableCell>
										<TableCell>{request.status}</TableCell>
										<TableCell>
											{format(new Date(request.createdAt), "PP")}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			)}
		</div>
	);
};

export default StudentEnrollmentRequests;
