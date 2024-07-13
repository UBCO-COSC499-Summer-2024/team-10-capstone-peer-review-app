import { useState, useCallback } from "react";
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
import { Trash2, Plus, X } from "lucide-react";
import { addStudentsByEmail } from "@/api/classApi";

const AddStudentsByCSVDialog = ({ classId, open, onOpenChange }) => {
	const [emails, setEmails] = useState([]);
	const [newEmail, setNewEmail] = useState("");
	const [results, setResults] = useState(null);

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		Papa.parse(file, {
			complete: (results) => {
				const parsedEmails = results.data
					.flat()
					.filter((email) => email.trim() !== "");
				setEmails((prevEmails) => [
					...new Set([...prevEmails, ...parsedEmails])
				]);
			}
		});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: ".csv"
	});

	const handleAddEmail = () => {
		if (newEmail && !emails.includes(newEmail)) {
			setEmails([...emails, newEmail]);
			setNewEmail("");
		}
	};

	const handleRemoveEmail = (email) => {
		setEmails(emails.filter((e) => e !== email));
	};

	const handleSubmit = async () => {
		const response = await addStudentsByEmail(classId, emails);
		setResults(response.data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Students by Email</DialogTitle>
				</DialogHeader>
				{!results ? (
					<>
						<div
							{...getRootProps()}
							className="border-2 border-dashed p-4 cursor-pointer"
						>
							<input {...getInputProps()} />
							<p>Drag and drop a CSV file here, or click to select one</p>
						</div>
						<div className="mt-4">
							<div className="flex space-x-2">
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
							<ul className="mt-2 max-h-40 overflow-y-auto">
								{emails.map((email, index) => (
									<li
										key={index}
										className="flex justify-between items-center py-1"
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
						</DialogFooter>
					</>
				) : (
					<div className="mt-4">
						<h3 className="font-bold">Results:</h3>
						<div className="mt-2">
							<h4 className="text-green-600">
								Successfully Added ({results.valid.length}):
							</h4>
							<ul className="max-h-20 overflow-y-auto">
								{results.valid.map((student, index) => (
									<li key={index}>{student.email}</li>
								))}
							</ul>
						</div>
						<div className="mt-2">
							<h4 className="text-red-600">
								Failed to Add ({results.invalid.length}):
							</h4>
							<ul className="max-h-20 overflow-y-auto">
								{results.invalid.map((failed, index) => (
									<li key={index}>
										{failed.email} - {failed.reason}
									</li>
								))}
							</ul>
						</div>
						<DialogFooter>
							<Button onClick={() => onOpenChange(false)}>Close</Button>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AddStudentsByCSVDialog;
