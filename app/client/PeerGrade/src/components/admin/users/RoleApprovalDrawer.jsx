import { useEffect, useState } from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import { updateRoleRequestStatus } from "@/api/authApi";

const RoleApprovalDrawer = ({
	children,
	roleRequest,
	refreshRoleRequests,
	isDrawerOpen,
	closeDrawer
}) => {
	const [isLoading, setIsLoading] = useState(false);

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

	return (
		<Drawer open={isDrawerOpen} onClose={closeDrawer}>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Role Request Form</DrawerTitle>
						<DrawerDescription>
							Approve or Deny the Role Request.
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-4 pb-0">
						<div className="flex flex-col space-y-2">
							{/* Add instructor details here */}
							<p>
								Name: {roleRequest.user.firstname} {roleRequest.user.lastname}
							</p>
							<p>Email: {roleRequest.user.email}</p>
							<p>Requested Role: {roleRequest.roleRequested}</p>
						</div>
					</div>
					<DrawerFooter>
						<Button onClick={handleApprove} disabled={isLoading}>
							Approve
						</Button>
						<Button onClick={handleDeny} disabled={isLoading} variant="outline">
							Deny
						</Button>
						<Button
							onClick={handlePending}
							disabled={isLoading}
							variant="outline"
						>
							Pending
						</Button>
						<DrawerClose asChild>
							<Button variant="outline" onClick={closeDrawer}>
								Cancel
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default RoleApprovalDrawer;
