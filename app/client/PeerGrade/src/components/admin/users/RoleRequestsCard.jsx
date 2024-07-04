import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Cog, Trash } from "lucide-react";
import RoleApprovalDrawer from "@/components/admin/users/RoleApprovalDrawer";
import { DelDialog } from "@/components/admin/users/DelDialog";
import { deleteRoleRequest, updateRoleRequestStatus } from "@/api/authApi";

import { getStatusDetails } from "@/utils/statusIcons";
// TODO get state to fetch single roleRequest

const RoleRequestsCard = ({
	key,
	roleRequest,
	refreshRoleRequests,
	title,
	description
}) => {
	// const [roleRequest, setRoleRequest] = React.useState(null);
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
			closeDrawer();
			// change to refresh single role request? Not all? May have to have each roll request have seperate state and fetch that way only have to update one role request
			refreshRoleRequests();
		}
		setIsLoading(false);
	};

	// Handle deny action
	const handleDeny = async () => {
		setIsLoading(true);
		const response = await updateRoleRequestStatus(
			roleRequest.roleRequestId,
			"DENIED"
		);
		if (response.status === "Success") {
			closeDrawer();
			// change to refresh single role request? Not all? May have to have each roll request have seperate state and fetch that way only have to update one role request
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
			// change to refresh single role request? Not all? May have to have each roll request have seperate state and fetch that way only have to update one role request
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

	return (
		<Alert>
			{icon ? icon : <Terminal className="h-4 w-4" />}
			<div className="flex justify-between w-full">
				<div>
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{description}</AlertDescription>
				</div>
				<div className="flex ml-2 flex-col items-end">
					<RoleApprovalDrawer
						roleRequest={roleRequest}
						handleApprove={handleApprove}
						handleDeny={handleDeny}
						handlePending={handlePending}
						isLoading={isLoading}
						isDrawerOpen={isDrawerOpen}
						closeDrawer={closeDrawer}
					>
						<Button variant="ghost" size="icon" className="h-5 w-5 p-0">
							<Cog className="h-4 w-4" onClick={openDrawer} />
						</Button>
					</RoleApprovalDrawer>
					<DelDialog handleActionClick={handleDelete}>
						<Button variant="ghost" size="icon" className="h-5 w-5 p-0 mt-2">
							<Trash className="h-4 w-4 text-red-600" />
						</Button>
					</DelDialog>
				</div>
			</div>
		</Alert>
	);
};

export default RoleRequestsCard;
