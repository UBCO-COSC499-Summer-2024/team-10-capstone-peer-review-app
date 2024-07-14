import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from "@/contexts/contextHooks/useUser";
import { Check, Trash2 } from "lucide-react";
// import { getReportsForAdmin } from '@/api/classApi';
// import { getReportsForAdmin } from '@/api/classApi';

const Reports = ({role}) => {
    const { toast } = useToast();
    const { user, userLoading } = useUser();
    const [reports, setReports] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
			if (role === "ADMIN") {
				// const response = await getReportsForAdmin();
				// if (response.status === "Success") {
				// 	setReports(response.data);
				// } else {
				// 	toast({
				// 		title: "Error",
				// 		description: "Failed to fetch reports",
				// 		variant: "negative"
				// 	});
				// }
			} else if (role === "INSTRUCTOR") {
				// const response = await getReportsForInstructor();
				// if (response.status === "Success") {
				// 	setReports(response.data);
				// } else {
				// 	toast({
				// 		title: "Error",
				// 		description: "Failed to fetch reports",
				// 		variant: "negative"
				// 	});
				// }
			}
        };

        if (!userLoading && user) {
            fetchReports();
        }
    }, [user, userLoading, role, toast, refresh]);

	const handleTrashClick = (report) => {
		// const response = await deleteReport(report);
		// if (response.status === "Success") {
		// 	setReports(reports.filter((r) => r.id !== report.id));
		// } else {
		// 	toast({
		// 		title: "Error",
		// 		description: "Failed to delete report",
		// 		variant: "negative"
		// 	});
		// }
	};

	const handleResolveClick = (report) => {
		// const response = await resolveReport(report);
		// if (response.status === "Success") {
		// 	setRefresh(!refresh);
		// } else {
		// 	toast({
		// 		title: "Error",
		// 		description: "Failed to resolve report",
		// 		variant: "negative"
		// 	});
		// }
	};

    return (
        <div className="">
            <h1 className="text-2xl font-bold mb-3">Reports Received</h1>
            <Card>
				<CardContent className="space-y-6">
					{reports.length > 0 ? (
						reports.map((report, index) => (
							<div key={index} className="space-y-2 border-b pb-4 flex flex-row items-center justify-between">
								<div>
									<p><strong>Sender:</strong> {report.sender.firstname}  {report.sender.lastname}</p>
									<p><strong>Subject:</strong> {report.subject}</p>
									<p><strong>Content:</strong> {report.reportContent}</p>
								</div>
								<div className='flex flex-row items-center justify-center'>
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:bg-red-100"
										onClick={() => handleResolveClick(report)}
										data-testid={`resolve-button-${index}`}
									>
										<Check className="h-5 w-5" />
									</Button>
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
						<p>No reports have been submitted yet.</p>
					)}
				</CardContent>
			</Card>
        </div>
    );
};

export default Reports;
