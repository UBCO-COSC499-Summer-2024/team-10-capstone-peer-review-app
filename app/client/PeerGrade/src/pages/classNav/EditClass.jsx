import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO, isAfter } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";

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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useClass } from "@/contexts/contextHooks/useClass";

// Zod schema for form validation
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

const EditClass = ({ classItem }) => {
	const [open, setOpen] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [formError, setFormError] = useState("");
	const location = useLocation();
	const navigate = useNavigate();

	const { updateClasses, isClassLoading } = useClass();

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

	// Fetch form values from classItem
	useEffect(() => {
		const fetchClassData = async (classItem) => {
			form.reset({
				classname: classItem.classname,
				description: classItem.description,
				startDate: parseISO(classItem.startDate),
				endDate: parseISO(classItem.endDate),
				term: classItem.term || undefined,
				classSize: classItem.classSize
			});
		};

		fetchClassData(classItem);
	}, [classItem, form]);

	const onSubmit = async (updateData) => {
		setIsConfirmOpen(true);
	};

	const handleConfirmedSubmit = async () => {
		setIsConfirmOpen(false);
		setFormError("");
		try {
			await updateClasses(classItem.classId, form.getValues());
			// Optionally, you can navigate back or show a success message here
		} catch (error) {
			setFormError("Failed to update class. Please try again.");
		}
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	const wasDirectlyAccessed =
		location.pathname === `/class/${classItem.classId}/edit`;

	return (
		<div className="flex bg-white justify-left flex-row p-4 w-full">
			<div className={wasDirectlyAccessed ? "w-2/3" : "w-full"}>
				<div className="flex flex-row items-center mb-4 space-x-2">
					{wasDirectlyAccessed && (
						<Button
							onClick={handleBackClick}
							variant="ghost"
							className="h-8 w-8"
							data-testid="back-button"
						>
							<ArrowLeft className="h-5 w-5" />
						</Button>
					)}
					<h2 className="text-xl font-semibold">Edit Class</h2>
				</div>
				{formError && (
					<Alert variant="destructive" className="mb-4">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{formError}</AlertDescription>
					</Alert>
				)}
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
											placeholder="e.g. 30"
											{...field}
											onChange={(e) => {
												const value = e.target.value;
												// Only allow numbers
												if (/^\d*$/.test(value)) {
													field.onChange(value === "" ? "" : Number(value));
												}
											}}
											min={1}
											max={1000}
										/>
									</FormControl>
									<FormDescription>
										This is the maximum number of students allowed in the class.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="bg-primary text-white"
							disabled={isClassLoading}
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will update the class information. Are you sure you
							want to continue?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmedSubmit}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default EditClass;
