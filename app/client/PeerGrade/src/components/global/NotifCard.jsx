import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotifCard = ({ notificationData, deleteNotifCall }) => {
	return (
		<Alert>
			<div className="flex justify-between items-center w-full">
				<div className="flex flex-row items-center justify-center space-x-4">
					<Bell className="h-4 w-4" />
					<div>
						<AlertTitle>{notificationData.title}</AlertTitle>
						<AlertDescription>{notificationData.content}</AlertDescription>
						<p className="text-sm text-gray-500">
							{formatDistanceToNow(new Date(notificationData.createdAt), { addSuffix: true })}
						</p>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-5 w-5 p-0"
					data-testid={`delete-notification-${notificationData.notificationId}`}
					onClick={() => deleteNotifCall(notificationData.notificationId)}
				>
					<X className="h-4 w-4 text-gray-600" />
				</Button>
			</div>
		</Alert>
	);
};

export default NotifCard;
