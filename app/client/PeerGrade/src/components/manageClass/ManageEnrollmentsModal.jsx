// This component displays a dialog with all enrollment requests for a class. 
// It shows the status of each request, allows the user to approve or deny requests, and allows the user to delete requests.

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	getEnrollRequestsForClass,
	updateEnrollRequestStatus,
	deleteEnrollRequest
} from "@/api/enrollmentApi";

const ManageEnrollmentsModal = ({ open, onOpenChange, classItem }) => {
	const [enrollRequests, setEnrollRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	// Fetch the enrollment requests when the dialog is opened and the class changes
	useEffect(() => {
		if (open && classItem) {
			fetchEnrollRequests();
		}
	}, [open, classItem]);

	// Fetch the filtered enrollment requests when the search term changes
	useEffect(() => {
		const lowercasedFilter = searchTerm.toLowerCase();
		const filtered = enrollRequests.filter((request) =>
			`${request.user.firstname} ${request.user.lastname}`
				.toLowerCase()
				.includes(lowercasedFilter)
		);
		setFilteredRequests(filtered);
	}, [searchTerm, enrollRequests]);

	// Fetch the enrollment requests when the class changes
	const fetchEnrollRequests = async () => {
		setIsLoading(true);
		try {
			const requests = await getEnrollRequestsForClass(classItem.classId);
			setEnrollRequests(requests.data);
			setFilteredRequests(requests.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle updating the status of an enrollment request
	const handleUpdateStatus = async (enrollRequestId, status) => {
		try {
			await updateEnrollRequestStatus(enrollRequestId, status);
			toast({
				title: "Success",
				description: `Enrollment request ${status.toLowerCase()}`
			});
			fetchEnrollRequests();
		} catch (error) {
			console.log(error);
		}
	};

	// Handle deleting an enrollment request
	const handleDeleteRequest = async (enrollRequestId, userId) => {
		try {
			await deleteEnrollRequest(enrollRequestId, userId);
			toast({
				title: "Success",
				description: "Enrollment request deleted"
			});
			fetchEnrollRequests();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete enrollment request",
				variant: "destructive"
			});
		}
	};

	// Get the color of the status based on the status
	const getStatusColor = (status) => {
		switch (status) {
			case "APPROVED":
				return "text-green-600";
			case "DENIED":
				return "text-red-600";
			default:
				return "text-yellow-600";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="mx-[180px] w-full">
				<DialogHeader>
					<DialogTitle>
						Manage Enrollment Requests for {classItem?.classname}
					</DialogTitle>
				</DialogHeader>
				<div className="mb-4">
					<div className="relative">
						<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							type="text"
							placeholder="Search by student name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-8"
						/>
					</div>
				</div>
				{isLoading ? (
					<div>Loading enrollment requests...</div>
				) : filteredRequests.length === 0 ? (
					<div>No enrollment requests found.</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Student Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Request Date</TableHead>
								<TableHead>Message</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRequests.map((request) => (
								<TableRow key={request.enrollRequestId}>
									<TableCell>{`${request.user.firstname} ${request.user.lastname}`}</TableCell>
									<TableCell>{request.user.email}</TableCell>
									<TableCell>
										{new Date(request.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>{request.senderMessage || "No message"}</TableCell>
									<TableCell className={getStatusColor(request.status)}>
										{request.status}
									</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleUpdateStatus(
														request.enrollRequestId,
														"APPROVED"
													)
												}
												disabled={request.status === "APPROVED"}
											>
												<CheckCircle className="w-4 h-4 mr-1" />
												Approve
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleUpdateStatus(request.enrollRequestId, "DENIED")
												}
												disabled={request.status === "DENIED"}
											>
												<XCircle className="w-4 h-4 mr-1" />
												Deny
											</Button>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													handleDeleteRequest(
														request.enrollRequestId,
														request.userId
													)
												}
											>
												<Trash2 className="w-4 h-4 mr-1" />
												Delete
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ManageEnrollmentsModal;
