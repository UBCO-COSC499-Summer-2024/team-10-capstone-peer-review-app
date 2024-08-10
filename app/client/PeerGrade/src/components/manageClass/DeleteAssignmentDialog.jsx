// The component for displaying a dialog to confirm deleting an assignment

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DeleteAssignmentDialog = ({ dialogOpen, setDialogOpen, confirmDelete, selectedAssignment, handleDeleteAssignment }) => {
    const assignmentTitle = selectedAssignment?.title || 'this assignment';

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
                className={confirmDelete ? "border-red-950 bg-red-500 text-white" : ""}
            >
                <DialogHeader>
                    <DialogTitle>
                        {confirmDelete ? "Confirm" : ""} Delete Assignment
                    </DialogTitle>
                </DialogHeader>
                Are you {confirmDelete ? "really " : ""}sure you want to delete the assignment "{assignmentTitle}" from this class?
                <DialogFooter>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        className={confirmDelete ? "shadow-md shadow-red-900" : ""}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAssignment}
                        data-testid="delete-assignment"
                        className={confirmDelete ? "shadow-md shadow-red-900" : ""}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAssignmentDialog;
