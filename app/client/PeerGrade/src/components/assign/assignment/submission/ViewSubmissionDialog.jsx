import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import PDFViewer from "@/components/assign/PDFViewer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ViewSubmissionDialog = ({ submission, rubric, open, onClose, onDownload }) => {
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        if (submission && submission.submissionFilePath.endsWith('.txt')) {
            fetch(submission.submissionFilePath)
                .then(response => response.text())
                .then(text => setTextContent(text))
                .catch(err => console.error('Failed to fetch text file:', err));
        }
    }, [submission]);

    return (
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
                {submission &&
                    <div className="flex-1 overflow-x-hidden">
                        {submission.submissionFilePath.endsWith('.txt') ? (
                            <div className="h-full">
                                <h2 className="text-lg font-semibold pb-4">Text Submission</h2>
                                <div className="p-4 bg-gray-100">
                                    <pre className="whitespace-pre-wrap">{textContent}</pre>
                                </div>
                            </div>
                        )
                        :
                            <PDFViewer
                                url={submission.submissionFilePath}
                                scale="1"
                            />
                        }
                    </div>
                }
                {/* <Button onClick={() => onDownload(submission.submissionFilePath)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                </Button> */}
            </DialogContent>
        </Dialog>
    );
};

export default ViewSubmissionDialog;
