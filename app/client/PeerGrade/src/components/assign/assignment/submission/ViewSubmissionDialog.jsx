import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import PDFViewer from "@/components/assign/PDFViewer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ViewSubmissionDialog = ({ submission, rubric, open, onClose, onDownload }) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh] ml-[80px]">
            <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                    Submission View
                    {rubric && (
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild className='mt-[-18px] mr-4'>
                                    <Button variant="ghost" size="sm" className='hover:bg-transparent'>
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Rubric: {rubric.title}</p>
                                    <p>Total Marks: {rubric.totalMarks}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-x-hidden">
                {submission && (
                    <PDFViewer
                        url={submission.submissionFilePath}
                        scale="1"
                    />
                )}
            </div>
            {/* <Button onClick={() => onDownload(submission)}>
                <Download className="h-4 w-4 mr-1" />
                Download
            </Button> */}
        </DialogContent>
    </Dialog>
);

export default ViewSubmissionDialog;