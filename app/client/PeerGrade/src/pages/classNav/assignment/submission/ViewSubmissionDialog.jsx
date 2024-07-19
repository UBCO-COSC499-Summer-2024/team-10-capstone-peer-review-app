import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PDFViewer from "@/components/assign/PDFViewer";

const ViewSubmissionDialog = ({ submission, open, onClose, onDownload }) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
                <DialogTitle>Submission View</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
                {submission && (
                    <PDFViewer
                        url={submission.submissionFilePath}
                        scale="1"
                    />
                )}
            </div>
            <Button onClick={() => onDownload(submission)}>
                <Download className="h-4 w-4 mr-1" />
                Download
            </Button>
        </DialogContent>
    </Dialog>
);

export default ViewSubmissionDialog;