// The main function of this component is to display a role requestcard with a title, description, and action buttons.
// It takes in a key, roleRequest, refreshRoleRequests, title, and description as props.
// The component also uses the isDrawerOpen, isLoading, and closeDrawer props to determine which action button to display.
// It also uses the handleApprove, handleDeny, handlePending, and handleDelete functions to handle the action buttons.

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Check, X, Trash, LoaderCircle } from "lucide-react";
import RoleApprovalDrawer from "@/components/admin/users/RoleApprovalDrawer";
import { DelDialog } from "@/components/admin/users/DelDialog";
import { deleteRoleRequest, updateRoleRequestStatus } from "@/api/authApi";
import { getStatusDetails } from "@/utils/statusIcons";

const RoleRequestsCard = ({
	roleRequest,
	refreshRoleRequests,
	title,
	description
}) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { icon } = getStatusDetails(roleRequest.status);

	const handleApprove = async () => {
		setIsLoading(true);
		const response = await updateRoleRequestStatus(
			roleRequest.roleRequestId,
			"APPROVED"
		);
		if (response.status === "Success") {
			refreshRoleRequests();
		}
		setIsLoading(false);
	};

	const handleDeny = async () => {
		setIsLoading(true);
		const response = await updateRoleRequestStatus(
			roleRequest.roleRequestId,
			"DENIED"
		);
		if (response.status === "Success") {
			closeDrawer();
			refreshRoleRequests();
		}
		setIsLoading(false);
	};

	const handlePending = async () => {
		setIsLoading(true);
		const response = await updateRoleRequestStatus(
			roleRequest.roleRequestId,
			"PENDING"
		);
		if (response.status === "Success") {
			closeDrawer();
			refreshRoleRequests();
		}
		setIsLoading(false);
	};

	const handleDelete = async () => {
		setIsLoading(true);
		const response = await deleteRoleRequest(roleRequest.roleRequestId);
		if (response.status === "Success") {
			refreshRoleRequests();
		}
		setIsLoading(false);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	const openDrawer = () => {
		setIsDrawerOpen(true);
	};

	const handleApproveClick = (e) => {
		e.stopPropagation();
		handleApprove();
	};

	const handleDenyClick = (e) => {
		e.stopPropagation();
		handleDeny();
	};

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		handleDelete();
	};

	return (
		<div>
			<Alert
				onClick={(e) => {
					if (e.target.closest("button")) {
						e.stopPropagation();
					} else {
						openDrawer();
					}
				}}
				className="hover:cursor-pointer hover:scale-[1.03] hover:shadow-lg transition"
			>
				{icon ? icon : <Terminal className="h-4 w-4" />}
				<div className="flex justify-between w-full">
					<div>
						<AlertTitle>{title}</AlertTitle>
						<AlertDescription>{description}</AlertDescription>
					</div>
					<div className="flex ml-2 flex-col items-end space-y-2">
						{isLoading ? (
								<LoaderCircle className="h-4 w-4 mr-1 animate-spin text-gray-800" />
						) : (
							<>
								<div className="flex items-center justify-center">
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 p-0 mr-1"
										onClick={handleApproveClick}
										disabled={isLoading}
										data-testid={`approve-role-req-${roleRequest.roleRequestId}`}
									>
										<Check className="h-4 w-4 text-green-600" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 p-0 self-end"
										onClick={handleDenyClick}
										disabled={isLoading}
										data-testid={`unapprove-role-req-${roleRequest.roleRequestId}`}
									>
										<X className="h-4 w-4 text-red-600" />
									</Button>
								</div>
								<DelDialog handleActionClick={handleDeleteClick}>
									<Button variant="ghost" size="icon" className="h-5 w-5 p-0" data-testid={`delete-role-req-${roleRequest.roleRequestId}`}>
										<Trash className="h-4 w-4 text-red-600" />
									</Button>
								</DelDialog>
							</>
						)}
					</div>
				</div>
			</Alert>
			<RoleApprovalDrawer
				roleRequest={roleRequest}
				handleApprove={handleApprove}
				handleDeny={handleDeny}
				handlePending={handlePending}
				isLoading={isLoading}
				isDrawerOpen={isDrawerOpen}
				closeDrawer={closeDrawer}
			/>
		</div>
	);
};

export default RoleRequestsCard;
