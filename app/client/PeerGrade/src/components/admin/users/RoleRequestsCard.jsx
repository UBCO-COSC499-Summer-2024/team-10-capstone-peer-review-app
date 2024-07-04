import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Cog, Trash } from "lucide-react";
import RoleApprovalDrawer from "@/components/admin/users/RoleApprovalDrawer";
import { DelDialog } from "@/components/admin/users/DelDialog";

import { getStatusDetails } from "@/utils/statusIcons";
// TODO get state to fetch single roleRequest

const RoleRequestsCard = ({
	key,
	roleRequest,
	refreshRoleRequests,
	title,
	description,
	showDrawer,
	showAlertDialog
}) => {
	// const [roleRequest, setRoleRequest] = React.useState(null);
	const { color, icon } = getStatusDetails(roleRequest.status);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
					{showDrawer ? (
						<RoleApprovalDrawer
							roleRequest={roleRequest}
							refreshRoleRequests={refreshRoleRequests}
							isDrawerOpen={isDrawerOpen}
							closeDrawer={closeDrawer}
						>
							<Button variant="ghost" size="icon" className="h-5 w-5 p-0">
								<Cog className="h-4 w-4" onClick={openDrawer} />
							</Button>
						</RoleApprovalDrawer>
					) : (
						<Button variant="ghost" size="icon" className="h-5 w-5 p-0">
							<Cog className="h-4 w-4" />
						</Button>
					)}
					{showAlertDialog ? (
						<DelDialog>
							<Button variant="ghost" size="icon" className="h-5 w-5 p-0 mt-2">
								<Trash className="h-4 w-4 text-red-600" />
							</Button>
						</DelDialog>
					) : (
						<Button variant="ghost" size="icon" className="h-5 w-5 p-0 mt-2">
							<Trash className="h-4 w-4 text-red-600" />
						</Button>
					)}
				</div>
			</div>
		</Alert>
	);
};

export default RoleRequestsCard;
