// The component for adding students by CSV Files

import { useState, useCallback, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Trash2,
	Plus,
	FileUp,
	ArrowLeft,
	ArrowRight,
	Search
} from "lucide-react";
import { addStudentsByEmail } from "@/api/classApi";
import { cn } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const AddStudentsByCSVDialog = ({
	classId,
	open,
	onOpenChange,
	onStudentsAdded
}) => {
	const [emails, setEmails] = useState([]);
	const [newEmail, setNewEmail] = useState("");
	const [results, setResults] = useState(null);
	const [fileError, setFileError] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isClosing, setIsClosing] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);
	const { toast } = useToast();

	// Reset the state of the component
	const resetState = () => {
		setEmails([]);
		setNewEmail("");
		setResults(null);
		setFileError("");
		setShowResults(false);
		setSearchTerm("");
		setInvalidEmail(false);
	};

	useEffect(() => {
		if (!open && isClosing) {
			const timer = setTimeout(() => {
				resetState();
				setIsClosing(false);
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [open, isClosing]);

	// Handle file drop
	const onDrop = useCallback(
		(acceptedFiles, rejectedFiles) => {
			if (rejectedFiles && rejectedFiles.length > 0) {
				setFileError("Please upload only CSV files.");
				return;
			}

			setFileError("");
			const file = acceptedFiles[0];
			Papa.parse(file, {
				complete: (results) => {
					// Split all data into individual emails and trim whitespace
					const parsedData = results.data.flatMap((row) =>
						row.map((item) => item.trim()).filter((item) => item !== "")
					);

					// Filter valid emails and remove duplicates within CSV
					const validEmails = [
						...new Set(parsedData.filter((email) => emailRegex.test(email)))
					];

					// Check for duplicates with existing list
					const newUniqueEmails = validEmails.filter(
						(email) => !emails.includes(email)
					);
					const duplicatesWithExisting = validEmails.filter((email) =>
						emails.includes(email)
					);

					// Find invalid emails
					const invalidEmails = parsedData.filter(
						(email) => !emailRegex.test(email)
					);

					// Notifications
					if (duplicatesWithExisting.length > 0) {
						toast({
							title: "Emails Already in List",
							description: `The following emails were already in the list and were not added: ${duplicatesWithExisting.join(", ")}`,
							variant: "destructive"
						});
					}

					if (invalidEmails.length > 0) {
						toast({
							title: "Invalid Emails",
							description: `The following entries were not valid email addresses and were ignored: ${invalidEmails.join(", ")}`,
							variant: "destructive"
						});
					}

					if (newUniqueEmails.length > 0) {
						setEmails((prevEmails) => [...prevEmails, ...newUniqueEmails]);
						toast({
							title: "Emails Added",
							description: `${newUniqueEmails.length} new email(s) were added to the list.`,
							variant: "positive"
						});
					} else {
						toast({
							title: "No New Emails",
							description: "No new emails were added to the list.",
							variant: "default"
						});
					}
				}
			});
		},
		[emails, toast]
	);

	// Get the root props and input props for the file drop
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"text/csv": [".csv"]
		},
		maxFiles: 1
	});

	// Handle adding a new email to the list
	const handleAddEmail = () => {
		if (newEmail && emailRegex.test(newEmail)) {
			if (emails.includes(newEmail)) {
				setInvalidEmail(true);
				toast({
					title: "Duplicate Email",
					description: `The email ${newEmail} is already in the list.`,
					variant: "destructive"
				});
			} else {
				setEmails([...emails, newEmail]);
				setNewEmail("");
				setInvalidEmail(false);
			}
		} else {
			setInvalidEmail(true);
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address.",
				variant: "destructive"
			});
		}
	};

	// Handle removing an email from the list
	const handleRemoveEmail = (email) => {
		setEmails(emails.filter((e) => e !== email));
	};

	// Handle submitting the form
	const handleSubmit = async () => {
		const response = await addStudentsByEmail(classId, emails);
		setResults(response.data);
		setShowResults(true);
		if (response.data.valid.length > 0) {
			onStudentsAdded();
		}
	};

	// Handle closing the dialog
	const handleClose = () => {
		setIsClosing(true);
		onOpenChange(false);
		onStudentsAdded();
	};

	// Toggle the view of the results
	const toggleView = () => {
		setShowResults(!showResults);
	};

	// Filter the emails based on the search term
	const filteredEmails = useMemo(() => {
		return emails.filter((email) =>
			email.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [emails, searchTerm]);

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add Students by CSV</DialogTitle>
				</DialogHeader>
				{!showResults ? (
					<>
						<div
							{...getRootProps()}
							className={cn(
								"border-2 border-dashed p-4 cursor-pointer text-center",
								isDragActive ? "border-primary" : "border-muted-foreground",
								fileError && "border-red-500"
							)}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop the CSV file here</p>
							) : (
								<div>
									<FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
									<p className="text-m">
										Drag &rsquo;n&rsquo; drop or click to upload a CSV of
										student emails
									</p>
									<p className="text-sm text-muted-foreground">
										Only .csv files are accepted
									</p>
								</div>
							)}
						</div>
						{fileError && <p className="text-red-500 mt-2">{fileError}</p>}
						<div className="mt-4">
							<div className="flex space-x-2 mb-4">
								<Input
									value={newEmail}
									onChange={(e) => {
										setNewEmail(e.target.value);
										setInvalidEmail(false);
									}}
									placeholder="Add email to list"
									onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
									className={cn(invalidEmail && "border-red-500")}
								/>
								<Button onClick={handleAddEmail}>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<div className="flex space-x-2 mb-4">
								<Search className="h-4 w-4 my-auto" />
								<Input
									placeholder="Search emails"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</div>
							{emails.length > 0 ? (
								<ul className="mt-2 max-h-40 bg-slate-100 overflow-y-auto border border-slate-300 rounded divide-y">
									{filteredEmails.map((email, index) => (
										<li
											key={index}
											className="flex justify-between border-slate-300 items-center py-2 px-3"
										>
											{email}
											<Button
												variant="ghost"
												size="sm"
												data-testid='remove-email-button'
												onClick={() => handleRemoveEmail(email)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</li>
									))}
								</ul>
							) : (
								<p className="text-center text-gray-500 my-4">
									No emails added yet.
								</p>
							)}
						</div>
						<DialogFooter>
							<Button onClick={handleSubmit}>Add Students to Class</Button>
							{results && (
								<Button onClick={toggleView}>
									View Results <ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							)}
						</DialogFooter>
					</>
				) : (
					<div className="mt-4">
						<h3 className="font-bold mb-4">Results:</h3>
						<div className="flex space-x-4">
							<div className="w-1/2">
								<h4 className="text-green-600 font-semibold">
									Successfully Added ({results.valid.length}):
								</h4>
								{results.valid.length > 0 ? (
									<ul className="max-h-60 overflow-y-auto mt-2 bg-slate-100 border border-slate-300 rounded divide-y">
										{results.valid.map((student, index) => (
											<li
												key={index}
												className=" border-slate-300 items-center py-2 px-3"
											>
												{student.email}
											</li>
										))}
									</ul>
								) : (
									<p className="text-center text-gray-500 my-4">
										No emails were successfully added.
									</p>
								)}
							</div>
							<div className="w-1/2">
								<h4 className="text-red-600 font-semibold">
									Failed to Add ({results.invalid.length}):
								</h4>
								{results.invalid.length > 0 ? (
									<ul className="max-h-60 overflow-y-auto mt-2 bg-slate-100 border border-slate-300 rounded divide-y">
										{results.invalid.map((failed, index) => (
											<li
												key={index}
												className=" border-slate-300 items-center py-2 px-3"
											>
												<span className="font-medium">{failed.email}</span>
												<br />
												<span className="text-sm text-gray-500">
													{failed.reason}
												</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-center text-gray-500 my-4">
										No emails failed to add.
									</p>
								)}
							</div>
						</div>
						<DialogFooter className="mt-4">
							<Button onClick={toggleView}>
								<ArrowLeft className="mr-2 h-4 w-4" /> Back to Email List
							</Button>
							<Button onClick={handleClose}>Close</Button>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AddStudentsByCSVDialog;
