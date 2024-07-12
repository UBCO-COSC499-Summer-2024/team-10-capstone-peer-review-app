import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useClass } from "@/contexts/contextHooks/useClass";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/utils/utils";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";

const AddClassModal = ({ show, onClose }) => {
	const [classname, setClassname] = useState("");
	const [description, setDescription] = useState("");
	const [term, setTerm] = useState("");
	const [size, setSize] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");

	const { isClassLoading, addClass } = useClass();

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log("start date", startDate);
		console.log("end date", endDate);

		if (startDate === "" || endDate === "") {
			setError("Please select start and end dates for the class.");
			return;
		} else if (startDate > endDate) {
			setError("Please select an end date that is after the start date.");
			return;
			// !!! TODO: CHECK FOR THIS IN THE BACK-END TOO.
		} else if (startDate === endDate) {
			setError("Please select an end date that is not the same as the start date.");
			return;
			// !!! TODO: CHECK FOR THIS IN THE BACK-END TOO.
		}

		const newClass = {
			classname,
			description,
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			term,
			classSize: parseInt(size, 10)
		};

		const classCreate = async () => {
			addClass(newClass);
			onClose();
		};

		classCreate();
	};

	if (!show) {
		return null;
	}

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
		  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
				<h2 className="text-xl font-bold mb-4">Add a New Class</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="classname"
							className="block text-sm font-medium text-gray-700"
						>
							Class Name
						</label>
						<input
							type="text"
							id="classname"
							value={classname}
							onChange={(e) => setClassname(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700"
						>
							Description
						</label>
						<input
							type="text"
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="term"
							className="block text-sm font-medium text-gray-700"
						>
							Term
						</label>
						<input
							type="text"
							id="term"
							value={term}
							onChange={(e) => setTerm(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="size"
							className="block text-sm font-medium text-gray-700"
						>
							Size
						</label>
						<input
							type="number"
							id="size"
							value={size}
							min="1"
							onChange={(e) => setSize(e.target.value)}
							required
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
					<div className="flex flex-col space-y-1 mb-4">
						<label
							htmlFor="startDate"
							className="block text-sm font-medium text-gray-700"
						>
							Start Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[200px] font-normal bg-white flex flex-start",
										!startDate && "text-muted-foreground"
									)}
									id="startDate"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{startDate ? (
										format(startDate, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={startDate}
									onSelect={(currentValue) => setStartDate(currentValue)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<span className="text-sm text-gray-500">
							Select the end date for the class.
						</span>
					</div>
					<div className="flex flex-col space-y-1 mb-4">
						<label
							htmlFor="endDate"
							className="block text-sm font-medium text-gray-700"
						>
							End Date
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-[200px] font-normal bg-white flex flex-start",
										!endDate && "text-muted-foreground"
									)}
									id="startDate"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={endDate}
									onSelect={(currentValue) => setEndDate(currentValue)}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<span className="text-sm text-gray-500">
							Select the end date for the class.
						</span>
					</div>

					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

					<div className="flex justify-end">
						<Button
							type="button"
							onClick={onClose}
							disabled={isClassLoading}
							className="mr-2"
						>
							Cancel
						</Button>
						<Button type="submit">Add Class</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddClassModal;