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
	handleApprove,
	handleDeny,
	handlePending,
	isLoading,
	isDrawerOpen,
	closeDrawer
}) => {
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
							<Button
								variant="outline"
								onClick={closeDrawer}
								disabled={isLoading}
							>
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
