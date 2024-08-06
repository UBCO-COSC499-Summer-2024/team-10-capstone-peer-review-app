// ExtendDeadlinesDialog.jsx
import React, { useState } from "react";
import { format } from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronDown as ChevronDownIcon,
	ChevronUp as ChevronUpIcon,
	Check as CheckIcon
} from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/utils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandEmpty,
	CommandInput
} from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";

const ExtendDeadlinesDialog = ({
	assignmentId,
	openExtendDeadlines,
	setOpenExtendDeadlines,
	students,
	extendedDueDates,
	setExtendedDueDates,
	extendDeadlineForStudent,
	confirmDelete,
	setConfirmDelete,
	deleteExtendedDeadlineForStudent
}) => {
	const [selectedStudent, setSelectedStudent] = useState({});
	const [newDueDate, setNewDueDate] = useState(null);
	const [selectStudentOpen, setSelectStudentOpen] = useState(false);
	const [selectNewDueDateOpen, setSelectNewDueDateOpen] = useState(false);

	const handleAddExtendedDueDate = async () => {
		if (selectedStudent && newDueDate) {
			const response = await extendDeadlineForStudent(
				assignmentId,
				selectedStudent.studentId,
				newDueDate
			);
			if (response.status === "Success") {
				if (
					extendedDueDates.find(
						(entry) => entry.userId === selectedStudent.studentId
					)
				) {
					setExtendedDueDates((prev) =>
						prev.map((entry) =>
							entry.userId === selectedStudent.studentId
								? { userId: selectedStudent.studentId, newDueDate }
								: entry
						)
					);
				} else {
					setExtendedDueDates((prev) => [
						...prev,
						{ userId: selectedStudent.studentId, newDueDate }
					]);
				}
				setSelectedStudent("");
				setNewDueDate(null);
				toast({
					title: "Extended Due Date Added",
					description:
						"The due date has been successfully extended for the selected student.",
					variant: "positive"
				});
			}
		}
	};

	const handleDeleteExtendedDueDate = async (studentId) => {
		if (confirmDelete === studentId) {
			setConfirmDelete("");
			const response = await deleteExtendedDeadlineForStudent(
				studentId,
				assignmentId
			);
			if (response.status === "Success") {
				setExtendedDueDates((prev) =>
					prev.filter((entry) => entry.userId !== studentId)
				);
				toast({
					title: "Extended Due Date Removed",
					description: "The extended due date has been successfully removed.",
					variant: "positive"
				});
			}
		} else {
			setConfirmDelete(studentId);
		}
	};

	return (
		<Dialog open={openExtendDeadlines} onOpenChange={setOpenExtendDeadlines}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Extend Deadlines</DialogTitle>
					<DialogDescription>
						Extend the deadline for this assignment for particular students
						here. Note: You can re-add the same student to edit the extended due
						date.
					</DialogDescription>
				</DialogHeader>

				{/* Table of current extended due dates */}
				<table className="w-full border-collapse border border-gray-200">
					<thead>
						<tr>
							<th className="border border-gray-200 px-4 py-2">Student</th>
							<th className="border border-gray-200 px-4 py-2">New Due Date</th>
							<th className="border border-gray-200 px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{extendedDueDates.length === 0 && (
							<tr>
								<td
									colSpan="3"
									className="border border-gray-200 px-4 py-2 text-center"
								>
									No extended due dates have been made yet.
								</td>
							</tr>
						)}
						{extendedDueDates.map((entry, index) => (
							<tr key={index}>
								<td className="border border-gray-200 px-4 py-2 text-center">
									{students.find(
										(student) => student.studentId === entry.userId
									)?.label || "Unknown"}
								</td>
								<td className="border border-gray-200 px-4 py-2 text-center">
									{format(new Date(entry.newDueDate), "dd/MM/yyyy")}
								</td>
								<td className="px-4 py-2 flex items-center justify-center">
									{confirmDelete === entry.userId ? (
										<Button
											variant="ghost"
											className="bg-white text-red-500 border-red-500 border-2 hover:text-red-500 hover:bg-red-100"
											onClick={() => handleDeleteExtendedDueDate(entry.userId)}
										>
											Confirm Deletion
										</Button>
									) : (
										<Button
											variant="ghost"
											className="bg-red-500 text-white"
											onClick={() => handleDeleteExtendedDueDate(entry.userId)}
										>
											Delete
										</Button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex flex-col mt-4">
					{/* Student Selection */}
					<div className="mb-2">
						<label
							htmlFor="studentSelect"
							className="block text-sm font-medium text-gray-700"
						>
							Select Student
						</label>
						<Popover
							open={selectStudentOpen}
							onOpenChange={setSelectStudentOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={selectStudentOpen}
									className="w-full justify-between bg-white mt-1 border"
								>
									{selectedStudent.label
										? selectedStudent.label
										: "Select a student"}
									{selectStudentOpen ? (
										<ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									) : (
										<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-5 rounded-md">
								<Command>
									<CommandInput placeholder="Search students..." />
									<CommandList>
										<CommandEmpty>No available students found.</CommandEmpty>
										<CommandGroup>
											{students.map((student) => (
												<CommandItem
													key={student.studentId}
													value={student.label}
													onSelect={() => setSelectedStudent(student)}
												>
													{student.label}
													<CheckIcon
														className={`ml-auto h-4 w-4 ${selectedStudent && selectedStudent.studentId === student.studentId ? "opacity-100" : "opacity-0"}`}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					{/* Due Date Picker */}
					<div className="mb-2">
						<label
							htmlFor="dueDate"
							className="block text-sm font-medium text-gray-700"
						>
							New Due Date
						</label>
						<Popover
							open={selectNewDueDateOpen}
							onOpenChange={setSelectNewDueDateOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-full pl-3 mt-1",
										!newDueDate && "text-muted-foreground"
									)}
								>
									{newDueDate ? format(newDueDate, "PPP") : "Pick a date"}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={newDueDate}
									onSelect={setNewDueDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={handleAddExtendedDueDate}>
						Add Extended Due Date
					</Button>
					<Button
						className="bg-gray-500 hover:bg-gray-400 text-white hover:text-white"
						variant="ghost"
						onClick={() => setOpenExtendDeadlines(false)}
					>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ExtendDeadlinesDialog;
