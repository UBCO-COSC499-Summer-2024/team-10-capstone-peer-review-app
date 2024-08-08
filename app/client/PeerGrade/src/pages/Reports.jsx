// This is the page for viewing previously sent reports. It displays a list of all reports, allows the user to delete a report, and displays the details of a report (status info).

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from "@/contexts/contextHooks/useUser";
import { X, Check, Trash2 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';	
import { getAdminReports, getInstructorReports, unResolveReport, resolveReport, deleteReport } from '@/api/userApi';
import ReportCard from '@/components/global/ReportCard';

const Reports = ({ role }) => {
    const { user, userLoading } = useUser();
    const [reports, setReports] = useState([]);
    const [refresh, setRefresh] = useState(false);
	const [open, setOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedReport, setSelectedReport] = useState({});

	// Fetch the reports for the selected role
	useEffect(() => {
        const fetchReports = async () => {
            let allReports = [];

            if (role === "ADMIN") {
                const response1 = await getAdminReports();
                if (response1.status === "Success") {
                    allReports = [...response1.data];
                }

                const response2 = await getInstructorReports();
                if (response2.status === "Success") {
                    allReports = [...allReports, ...response2.data];
                }

            } else if (role === "INSTRUCTOR") {
                const response = await getInstructorReports();
                if (response.status === "Success") {
                    allReports = [...response.data];
                }
            }

            setReports(allReports);
        };

        if (!userLoading && user) {
            fetchReports();
        }
    }, [user, userLoading, role, refresh]);

	// Handle deleting a report
	const handleDeleteReport = async () => {
		if (confirmDelete) {
			const response = await deleteReport(selectedReport.reportId);
			if (response.status === "Success") {
				setRefresh(!refresh);
				setOpen(false);
				setConfirmDelete(false);
			}
		} else {
			setConfirmDelete(true);
		}
	};

	// Handle trashing a report
	const handleTrashClick = (report) => {
		setSelectedReport(report);
		setOpen(true);
	};

	// Handle unresolving a report
	const handleUnResolveClick = async (reportId) => {
		const response = await unResolveReport(reportId);
		if (response.status === "Success") {
			setRefresh(!refresh);
		}
	};

	// Handle resolving a report
	const handleResolveClick = async (reportId) => {
		const response = await resolveReport(reportId);
		if (response.status === "Success") {
			setRefresh(!refresh);
		}
	};

    return (
        <div>
            <h1 className="text-2xl font-bold mb-3">Reports Received</h1>
            <Card>
				<CardContent className="space-y-6 bg-transparent">
					{reports.length > 0 ? (
						reports.map((report, index) => (
							<div key={index} className="flex flex-row items-center justify-between">
                                <ReportCard report={report} isViewedByReceiver={true} />
								<div className='flex flex-col items-center justify-center'>
									{report.isResolved ?
										<Button
											variant="ghost"
											size="icon"
											className="text-gray-500 hover:bg-gray-100"
											onClick={() => handleUnResolveClick(report.reportId)}
											data-testid={`unresolve-button-${index}`}
										>
											<X className="h-5 w-5" />
										</Button>
										:
										<Button
											variant="ghost"
											size="icon"
											className="text-green-500 hover:bg-green-100"
											onClick={() => handleResolveClick(report.reportId)}
											data-testid={`resolve-button-${index}`}
										>
											<Check className="h-5 w-5" />
										</Button>
									}
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:bg-red-100"
										onClick={() => handleTrashClick(report)}
										data-testid={`delete-button-${index}`}
									>
										<Trash2 className="h-5 w-5" />
									</Button>
								</div>
							</div>
						))
					) : (
						<p>No reports have been sent to you yet.</p>
					)}
				</CardContent>
			</Card>
			<Dialog open={open}>
				<DialogContent
					className={confirmDelete ? "border-red-950 bg-red-500 text-white" : ""}
				>
					<DialogHeader>
						<DialogTitle>
							{confirmDelete ? "Confirm" : ""} Delete Report
						</DialogTitle>
					</DialogHeader>
					<div>
						Are you {confirmDelete ? "really" : ""} sure you want to delete the
						report '{selectedReport.title}'?
						<br />
						<span className="font-extrabold">
							WARNING: THIS WILL DELETE THE REPORT PERMANENTLY.
						</span>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setOpen(false)}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteReport}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
        </div>
    );
};

export default Reports;
