import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DeleteStudentDialog = ({ dialogOpen, setDialogOpen, confirmDelete, selectedStudent, handleDeleteStudent }) => {
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className={confirmDelete ? "border-red-950 bg-red-500 text-white" : ""}>
                <DialogHeader>
                    <DialogTitle>
                        {confirmDelete ? "Confirm" : ""} Remove Student
                    </DialogTitle>
                </DialogHeader>
                Are you {confirmDelete ? "really " : ""}sure you want to remove the student {selectedStudent.firstname} {selectedStudent.lastname} from this class?
                <DialogFooter>
                    <Button onClick={() => setDialogOpen(false)} className={confirmDelete ? "shadow-md shadow-red-900" : ""}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteStudent} className={confirmDelete ? "shadow-md shadow-red-900" : ""}>
                        Remove
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteStudentDialog;