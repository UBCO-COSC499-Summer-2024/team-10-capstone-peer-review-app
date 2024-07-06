import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import {
	Calendar as CalendarIcon,
	ChevronDown as ChevronDownIcon,
	ChevronUp as ChevronUpIcon,
	Check as CheckIcon,
	ArrowLeft
} from "lucide-react";

import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { getClassById, updateClass } from "@/api/classApi";

import { toast } from "@/components/ui/use-toast";
import { useClass } from "@/contexts/contextHooks/useClass";

// Zod schema for form validation
const FormSchema = z.object({
	classname: z.string().min(1, "Class name is required"),
	description: z.string().min(1, "Description is required"),
	startDate: z.date({
		required_error: "Start date is required"
	}),
	endDate: z.date({
		required_error: "End date is required"
	}),
	term: z.string().optional(),
	classSize: z
		.number()
		.optional()
		.refine((value) => value === undefined || value >= 0, {
			message: "Class size must be a non-negative number"
		})
});

const EditClass = ({ classItem }) => {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const { updateClasses } = useClass();

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			classname: "",
			description: "",
			startDate: null,
			endDate: null,
			term: "",
			classSize: 0
		}
	});

	// Fetch existing class data using classId
	useEffect(() => {
		const fetchClassData = async () => {
			form.reset({
				classname: classItem.classname,
				description: classItem.description,
				startDate: parseISO(classItem.startDate),
				endDate: parseISO(classItem.endDate),
				term: classItem.term || undefined,
				classSize: classItem.classSize
			});
		};

		fetchClassData();
	}, [classId, form]);

	const onSubmit = async (updateData) => {
		const classUpdate = await updateClass(classId, updateData);
		if (classUpdate.status === "Success") {
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(classUpdate, null, 2)}
						</code>
					</pre>
				)
			});
		} else {
			console.error(
				"An error occurred while updating the class.",
				classUpdate.message
			);
		}
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	const wasDirectlyAccessed = location.pathname === `/class/${classId}/edit`;

	return (
		<div className="flex bg-white justify-left flex-row p-4 main-container mx-5 w-full">
			<div className={wasDirectlyAccessed ? "w-2/3" : "w-full"}>
				<div className="flex flex-row items-center mb-4 space-x-2">
					{wasDirectlyAccessed && (
						<Button
							onClick={handleBackClick}
							variant="ghost"
							className="h-8 w-8"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
					)}
					<h2 className="text-xl font-semibold">Edit Class</h2>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
						<FormField
							control={form.control}
							name="classname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Math 101" {...field} />
									</FormControl>
									<FormDescription>
										This is the name of the class.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g. Introduction to basic math principles..."
											{...field}
										/>
									</FormControl>
									<FormDescription>
										This is the text that will show as the class description.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem style={{ display: "flex", flexDirection: "column" }}>
									<FormLabel>Start Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[200px] font-normal bg-white flex flex-start",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Select the start date for the class.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem style={{ display: "flex", flexDirection: "column" }}>
									<FormLabel>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[200px] font-normal bg-white flex flex-start",
														!field.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>
										Select the end date for the class.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="term"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Term</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Fall 2024" {...field} />
									</FormControl>
									<FormDescription>
										This is the term in which the class is held.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="classSize"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class Size</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="e.g. 30"
											{...field}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormDescription>
										This is the maximum number of students allowed in the class.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="bg-primary text-white">
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditClass;
