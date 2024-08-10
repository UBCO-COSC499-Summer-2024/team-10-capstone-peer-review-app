// This is the page for managing reports and viewing previously sent reports. It allows the user to send a report, view all reports, and view previously sent reports.
// It also hosts the send report modal and the info button guide content.

import React, { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import InfoButton from "@/components/global/InfoButton";
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { getInstructorByClassId } from "@/api/classApi";
import {
	sendReportToInstructor,
	sendReportToAdmin,
	getSentReports
} from "@/api/userApi";
import Reports from "@/pages/Reports";
import ReportCard from "@/components/global/ReportCard";

const Report = () => {
	const { toast } = useToast();
	const { user, userLoading } = useUser();
	const { classes, isClassLoading } = useClass();
	const [role, setRole] = useState("ADMIN");
	const [instructors, setInstructors] = useState([]);
	const [instructor, setInstructor] = useState("");
	const [title, setTitle] = useState("");
	const [reportContent, setReportContent] = useState("");
	const [reports, setReports] = useState([]);
	const [refresh, setRefresh] = useState(false);

	// Fetch the instructors for the selected class
	useEffect(() => {
		if (!userLoading && user && user.role !== "ADMIN") {
			if (
				role === "INSTRUCTOR" &&
				!isClassLoading &&
				instructors.length === 0
			) {
				const fetchInstructors = async () => {
					let fetchedInstructors = []; // Temporary array to hold instructors
					for (const classItem of classes) {
						const response = await getInstructorByClassId(classItem.classId);
						if (response.status === "Success") {
							if (
								!fetchedInstructors.find(
									(instructor) => instructor.userId === response.data.userId
								)
							) {
								fetchedInstructors.push(response.data);
							}
						}
					}
					setInstructors(fetchedInstructors); // Set state once with the final list
				};

				setInstructors([]);
				fetchInstructors();
			}

			const fetchSentReports = async () => {
				const response = await getSentReports();
				if (response.status === "Success") {
					setReports(response.data);
					console.log("reports", response.data);
				} else {
					toast({
						title: "Error",
						description: "Failed to fetch reports",
						variant: "destructive"
					});
				}
			};

			fetchSentReports();
		}
	}, [user, userLoading, role, classes, isClassLoading, refresh]);

	// Handle submitting a report
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!title || !reportContent) {
			toast({
				title: "Error",
				description: "Please fill out all fields",
				variant: "destructive"
			});
			return;
		} else if (role === "INSTRUCTOR" && !instructor) {
			toast({
				title: "Error",
				description: "Please select an instructor",
				variant: "destructive"
			});
			return;
		}
		// Send the report data to the API
		const sendReport = async () => {
			if (role === "ADMIN") {
				const response = await sendReportToAdmin(
					user.userId,
					title,
					reportContent
				);
				if (response.status === "Success") {
					setRefresh(!refresh);
					toast({
						title: "Report Submitted",
						variant: "info"
					});
				}
			} else if (role === "INSTRUCTOR") {
				const response = await sendReportToInstructor(
					user.userId,
					title,
					reportContent,
					instructor
				);
				if (response.status === "Success") {
					setRefresh(!refresh);
					toast({
						title: "Report Submitted",
						variant: "info"
					});
				}
			}
		};

		sendReport();

		// Clear the form
		setRole("ADMIN");
		setInstructor("");
		setTitle("");
		setReportContent("");
	};

	// Get the info content for the report page (infoButton guide content)
	const infoContent = {
		title: "Reports Management",
		description: (
			<>
				<p>
					This page allows you to send reports and view previously sent reports:
				</p>
				<ul className="list-disc list-inside mt-2">
					<li>
						Send Reports:
						<ul className="list-disc list-inside ml-4">
							<li>Choose the recipient (Admin or Instructor, if applicable)</li>
							<li>
								Select a specific instructor (if reporting to an instructor)
							</li>
							<li>Provide a subject and detailed content for your report</li>
						</ul>
					</li>
					<li>
						View Previously Sent Reports:
						<ul className="list-disc list-inside ml-4">
							<li>See a list of all reports you've submitted</li>
							<li>
								Check the status of each report (Pending, In Progress, Resolved)
							</li>
							<li>View the full content and any responses to your reports</li>
						</ul>
					</li>
					{user.role !== "STUDENT" && (
						<li>
							View Received Reports (for Instructors and Admins):
							<ul className="list-disc list-inside ml-4">
								<li>Access reports sent to you by students or other users</li>
								<li>Manage and respond to these reports</li>
							</ul>
						</li>
					)}
				</ul>
				<p className="mt-2">
					Use the tabs at the top to switch between sending reports and viewing
					received reports (if applicable).
				</p>
			</>
		)
	};

	return (
		<div className="px-6">
			<Tabs
				defaultValue={user.role === "ADMIN" ? "view" : "send"}
				className="flex-1"
			>
				{user.role === "INSTRUCTOR" && (
					<TabsList className="grid w-1/2 grid-cols-2 mb-7">
						<TabsTrigger value="send">Send Report</TabsTrigger>
						<TabsTrigger value="view">View Reports to You</TabsTrigger>
					</TabsList>
				)}
				<TabsContent value="send">
					<h1 className="text-2xl font-bold mb-3">
						Send a Report {user.role === "INSTRUCTOR" ? "to Admin" : ""}
					</h1>
					<Card>
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-6">
								{user.role === "STUDENT" && (
									<div className="space-y-2">
										<Label htmlFor="role">Recipient</Label>
										<Select value={role} onValueChange={setRole}>
											<SelectTrigger id="role">
												<SelectValue placeholder="Select recipient" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="INSTRUCTOR" data-testid='instructor-option'>Instructor</SelectItem>
												<SelectItem value="ADMIN" data-testid='admin-option'>Admin</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
								{role === "INSTRUCTOR" && (
									<div className="space-y-2">
										<Label htmlFor="instructor">Instructor</Label>
										<Select value={instructor} onValueChange={setInstructor}>
											<SelectTrigger id="instructor">
												<SelectValue placeholder="Select instructor" />
											</SelectTrigger>
											<SelectContent>
												{instructors.map((instructor, index) => (
													<SelectItem
														key={instructor.userId}
														value={instructor.userId}
													>
														{instructor.firstname} {instructor.lastname}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
								<div className="space-y-2">
									<Label htmlFor="title">Subject</Label>
									<Input
										id="title"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Enter title"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="reportContent">Content</Label>
									<Textarea
										id="reportContent"
										value={reportContent}
										onChange={(e) => setReportContent(e.target.value)}
										placeholder="Enter your report content"
										rows="6"
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button type="submit">Submit Report</Button>
							</CardFooter>
						</form>
					</Card>

					<h2 className="text-2xl font-bold mt-6 mb-3">
						Previously Sent Reports
					</h2>
					<Card>
						<CardContent className="space-y-6">
							{reports.length > 0 ? (
								reports.map((report, index) => (
									<ReportCard
										key={index}
										report={report}
										isViewedByReceiver={false}
									/>
								))
							) : (
								<p>No reports have been submitted yet.</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
				{user.role !== "STUDENT" && (
					<>
						<TabsContent value="view" className="pt-4">
							<Reports role={user.role} />
						</TabsContent>
					</>
				)}
			</Tabs>
			<InfoButton content={infoContent} />
		</div>
	);
};

export default Report;
