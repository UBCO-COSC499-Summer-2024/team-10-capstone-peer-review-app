// The component for displaying a form for adding a new student to a class

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, isAfter } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useClass } from "@/contexts/contextHooks/useClass";

// Zod schema for form validation (same as in your original component)
const FormSchema = z
	.object({
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
			.union([
				z
					.string()
					.refine((val) => val.trim() !== "", {
						message: "Please enter a class size"
					})
					.transform((val) => {
						const numberVal = Number(val);
						return isNaN(numberVal) ? NaN : numberVal;
					}),
				z.number()
			])
			.refine((val) => val >= 1, {
				message: "Class size must be at least 1"
			})
			.refine((val) => val <= 1000, {
				message: "Class size cannot exceed 1000"
			})
			.optional()
	})
	.refine((data) => isAfter(data.endDate, data.startDate), {
		message: "End date must be after start date",
		path: ["endDate"]
	});

const EditClassDialog = ({ open, onOpenChange, classItem }) => {
	const [formError, setFormError] = useState("");
	const { updateClasses, isClassLoading } = useClass();

	// Create a form instance
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			classname: "",
			description: "",
			startDate: null,
			endDate: null,
			term: "",
			classSize: 1
		}
	});

	// Reset the form when the class item changes
	useEffect(() => {
		if (classItem) {
			form.reset({
				classname: classItem.classname,
				description: classItem.description,
				startDate: parseISO(classItem.startDate),
				endDate: parseISO(classItem.endDate),
				term: classItem.term || undefined,
				classSize: classItem.classSize
			});
		}
	}, [classItem, form]);

	// Handle form submission
	const onSubmit = async (updateData) => {
		setFormError("");
		try {
			await updateClasses(classItem.classId, updateData);
			onOpenChange(false);
		} catch (error) {
			setFormError("Failed to update class. Please try again.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Class</DialogTitle>
				</DialogHeader>
				{formError && (
					<Alert variant="destructive">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{formError}</AlertDescription>
					</Alert>
				)}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="classname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Math 101" {...field} />
									</FormControl>
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Start Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full font-normal",
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>End Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-full font-normal",
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="classSize"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Maximum number of students</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. 30"
											{...field}
											onChange={(e) => {
												const value = e.target.value;
												if (/^\d*$/.test(value)) {
													field.onChange(value === "" ? "" : Number(value));
												}
											}}
											min={1}
											max={1000}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
						disabled={isClassLoading}
					>
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditClassDialog;
