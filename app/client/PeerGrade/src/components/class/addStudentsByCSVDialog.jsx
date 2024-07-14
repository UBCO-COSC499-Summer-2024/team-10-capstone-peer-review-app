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
	const { toast } = useToast();

	const resetState = () => {
		setEmails([]);
		setNewEmail("");
		setResults(null);
		setFileError("");
		setShowResults(false);
		setSearchTerm("");
	};

	useEffect(() => {
		if (!open && isClosing) {
			const timer = setTimeout(() => {
				resetState();
				setIsClosing(false);
			}, 300); // Adjust this timing to match your dialog's closing animation duration
			return () => clearTimeout(timer);
		}
	}, [open, isClosing]);

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		if (rejectedFiles && rejectedFiles.length > 0) {
			setFileError("Please upload only CSV files.");
			return;
		}

		setFileError("");
		const file = acceptedFiles[0];
		Papa.parse(file, {
			complete: (results) => {
				const parsedEmails = results.data
					.flat()
					.filter(
						(email) => email.trim() !== "" && emailRegex.test(email.trim())
					);
				setEmails((prevEmails) => [
					...new Set([...prevEmails, ...parsedEmails])
				]);
			}
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"text/csv": [".csv"]
		},
		maxFiles: 1
	});

	const handleAddEmail = () => {
		if (newEmail && !emails.includes(newEmail) && emailRegex.test(newEmail)) {
			setEmails([...emails, newEmail]);
			setNewEmail("");
		} else {
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address.",
				variant: "destructive"
			});
		}
	};

	const handleRemoveEmail = (email) => {
		setEmails(emails.filter((e) => e !== email));
	};

	const handleSubmit = async () => {
		const response = await addStudentsByEmail(classId, emails);
		setResults(response.data);
		setShowResults(true);
		if (response.data.valid.length > 0) {
			onStudentsAdded();
		}
	};

	const handleClose = () => {
		setIsClosing(true);
		onOpenChange(false);
		// May not need it here too?
		onStudentsAdded();
	};

	const toggleView = () => {
		setShowResults(!showResults);
	};

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
										Drag and drop a CSV file here, or click to select one
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
									onChange={(e) => setNewEmail(e.target.value)}
									placeholder="Enter email"
									onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
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
							<ul className="mt-2 max-h-40 overflow-y-auto border rounded divide-y">
								{filteredEmails.map((email, index) => (
									<li
										key={index}
										className="flex justify-between items-center py-2 px-3"
									>
										{email}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveEmail(email)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</li>
								))}
							</ul>
						</div>
						<DialogFooter>
							<Button onClick={handleSubmit}>Add Students</Button>
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
								<ul className={`max-h-60 overflow-y-auto mt-2 rounded divide-y ${results.valid.length > 0 ? "border" : ""}`}>
									{results.valid.map((student, index) => (
										<li key={index} className="py-2 px-3">
											{student.email}
										</li>
									))}
								</ul>
							</div>
							<div className="w-1/2">
								<h4 className="text-red-600 font-semibold">
									Failed to Add ({results.invalid.length}):
								</h4>
								<ul className={`max-h-60 overflow-y-auto mt-2 rounded divide-y ${results.invalid.length > 0 ? "border" : ""}`}>
									{results.invalid.map((failed, index) => (
										<li key={index} className="py-2 px-3">
											<span className="font-medium">{failed.email}</span>
											<br />
											<span className="text-sm text-gray-500">
												{failed.reason}
											</span>
										</li>
									))}
								</ul>
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
