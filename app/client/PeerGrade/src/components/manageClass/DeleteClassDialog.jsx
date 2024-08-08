// The component for displaying a dialog to confirm deleting a class

import React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

const DeleteClassDialog = ({
	open,
	onOpenChange,
	confirmDelete,
	selectedClass,
	handleDeleteClass
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={confirmDelete ? "border-red-950 bg-red-500 text-white" : ""}
			>
				<DialogHeader>
					<DialogTitle>
						{confirmDelete ? "Confirm" : ""} Delete Class
					</DialogTitle>
				</DialogHeader>
				<div>
					Are you {confirmDelete ? "really" : ""} sure you want to delete the
					class {selectedClass.classname}?
					<br />
					<span className="font-extrabold">
						WARNING: THIS WILL DELETE ALL ASSIGNMENTS, SUBMISSIONS, REVIEWS,
						CATEGORIES, AND GROUPS ASSOCIATED WITH THIS CLASS.
					</span>
				</div>
				<DialogFooter>
					<Button
						onClick={() => onOpenChange(false)}
						className={confirmDelete ? "shadow-md shadow-red-900" : ""}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDeleteClass}
						className={confirmDelete ? "shadow-md shadow-red-900" : ""}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteClassDialog;
