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
import { CheckCircle, XCircle } from "lucide-react";
import {
	getEnrollRequestsForClass,
	updateEnrollRequestStatus
} from "@/api/enrollmentApi";

const ManageEnrollmentsModal = ({ open, onOpenChange, classItem }) => {
	const [enrollRequests, setEnrollRequests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		if (open && classItem) {
			fetchEnrollRequests();
		}
	}, [open, classItem]);

	const fetchEnrollRequests = async () => {
		setIsLoading(true);
		try {
			const requests = await getEnrollRequestsForClass(classItem.classId);
			setEnrollRequests(requests);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch enrollment requests",
				variant: "destructive"
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateStatus = async (enrollRequestId, status) => {
		try {
			await updateEnrollRequestStatus(enrollRequestId, status);
			toast({
				title: "Success",
				description: `Enrollment request ${status.toLowerCase()}`
			});
			fetchEnrollRequests(); // Refresh the list after updating
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update enrollment request",
				variant: "destructive"
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>
						Manage Enrollment Requests for {classItem?.classname}
					</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div>Loading enrollment requests...</div>
				) : enrollRequests.length === 0 ? (
					<div>No enrollment requests for this class.</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Student Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Request Date</TableHead>
								<TableHead>Message</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{enrollRequests.map((request) => (
								<TableRow key={request.enrollRequestId}>
									<TableCell>{`${request.user.firstname} ${request.user.lastname}`}</TableCell>
									<TableCell>{request.user.email}</TableCell>
									<TableCell>
										{new Date(request.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>{request.senderMessage || "No message"}</TableCell>
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
											>
												<XCircle className="w-4 h-4 mr-1" />
												Deny
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
