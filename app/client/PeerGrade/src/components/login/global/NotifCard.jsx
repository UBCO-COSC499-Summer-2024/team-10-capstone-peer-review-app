import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Check, Trash } from "lucide-react";
// import { ApprovalDrawer } from "@/components/admin/users/ApprovalDrawer";
import { DelDialog } from "@/components/admin/users/DelDialog";

const NotifCard = ({ title, description, showDrawer, showAlertDialog }) => {
	return (
		<Alert>
			<Terminal className="h-4 w-4" />
			<div className="flex justify-between w-full">
				<div>
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{description}</AlertDescription>
				</div>
				<div className="flex ml-2 flex-col items-end">
					{/* {showDrawer ? (
            <ApprovalDrawer>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            </ApprovalDrawer>
          ) : ( */}
					<Button variant="ghost" size="icon" className="h-5 w-5 p-0">
						<Check className="h-4 w-4 text-green-600" />
					</Button>
					{/* )} */}
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

export default NotifCard;
