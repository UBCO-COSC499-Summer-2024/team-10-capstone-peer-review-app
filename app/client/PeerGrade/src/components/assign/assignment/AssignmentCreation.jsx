// The main function of this component is to create a new assignment and add it to a class


import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import {
	Plus,
	Calendar as CalendarIcon,
	Upload
} from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect";
import RubricCreationForm from "@/components/rubrics/RubricCreationForm";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getCategoriesByClassId } from "@/api/classApi";
import {
	addAssignmentToClass,
	addAssignmentWithRubric
} from "@/api/assignmentApi";
import { getAllRubricsInClass } from "@/api/rubricApi";
import { createCategory } from "@/api/categoryApi";
import InfoButton from "@/components/global/InfoButton";

import { useUser } from "@/contexts/contextHooks/useUser";

const fileTypeOptions = [
	{ value: "pdf", label: "PDF" },
	{ value: "doc", label: "DOC" },
	{ value: "docx", label: "DOCX" },
	{ value: "txt", label: "TXT" },
	{ value: "jpg", label: "JPG" },
	{ value: "png", label: "PNG" }
];

const AssignmentCreation = ({ onAssignmentCreated }) => {
	const { classId } = useParams();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		maxSubmissions: 1,
		isPeerReviewAnonymous: false,
		categoryId: "",
		dueDate: null,
		allowedFileTypes: [],
		rubricId: ""
	});
	const [categories, setCategories] = useState([]);
	const [rubrics, setRubrics] = useState([]);
	const [newRubricData, setNewRubricData] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState("");
	const [isRubricFormOpen, setIsRubricFormOpen] = useState(false);
	const [errors, setErrors] = useState({});
	const fileInputRef = useRef(null);
	const { user } = useUser();
	const [newCategoryName, setNewCategoryName] = useState("");
	const [isCreatingCategory, setIsCreatingCategory] = useState(false);

	useEffect(() => {
		const fetchCategoriesAndRubrics = async () => {
			try {
				const [categoriesResponse, rubricsResponse] = await Promise.all([
					getCategoriesByClassId(classId),
					getAllRubricsInClass(classId)
				]);
				setCategories(categoriesResponse.data);
				setRubrics(rubricsResponse.data);
			} catch (error) {
				console.error("Error fetching categories and rubrics:", error);
			}
		};

		fetchCategoriesAndRubrics();
	}, [classId]);

	const handleCreateCategory = async () => {
		if (!newCategoryName.trim()) {
			toast({
				title: "Error",
				description: "Category name cannot be empty",
				variant: "destructive"
			});
			return;
		}

		try {
			const response = await createCategory(classId, newCategoryName);
			if (response.status === "Success") {
				toast({
					title: "Success",
					description: "New category created successfully",
					variant: "info"
				});
				setFormData((prev) => ({
					...prev,
					categoryId: response.data.categoryId
				}));
				setCategories((prev) => [...prev, response.data]);
				setIsCreatingCategory(false);
				setNewCategoryName("");
			}
		} catch (error) {
			console.error("Error creating category:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to create new category",
				variant: "destructive"
			});
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setSelectedFileName(selectedFile.name);
		setFormData((prev) => ({ ...prev, file: selectedFile }));
	};

	const handleRubricSelection = (value) => {
		setFormData((prev) => ({
			...prev,
			rubricId: value
		}));
		setNewRubricData(null); // Clear any new rubric data when selecting an existing rubric
	};

	const resetRubric = () => {
		setNewRubricData(null);
		setFormData((prev) => ({ ...prev, rubricId: "" }));
		setIsRubricFormOpen(false);
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) newErrors.title = "Title is required";
		if (!formData.description.trim())
			newErrors.description = "Description is required";
		if (!formData.dueDate) newErrors.dueDate = "Due date is required";
		if (!formData.categoryId) newErrors.categoryId = "Category is required";
		if (!formData.rubricId && !newRubricData)
			newErrors.rubric = "Please select or create a rubric";
		if (formData.maxSubmissions <= 0)
			newErrors.maxSubmissions = "Max submissions must be greater than 0";
		if (formData.allowedFileTypes.length === 0)
			newErrors.allowedFileTypes = "Please select at least one file type";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast({
				title: "Validation Error",
				description: "Please correct the highlighted fields",
				variant: "destructive"
			});
			return;
		}

		try {
			const assignmentData = {
				title: formData.title,
				description: formData.description,
				dueDate: formData.dueDate
					? setSeconds(setMinutes(setHours(formData.dueDate, 23), 59), 59)
					: null,
				maxSubmissions: parseInt(formData.maxSubmissions, 10),
				isPeerReviewAnonymous: formData.isPeerReviewAnonymous,
				allowedFileTypes: formData.allowedFileTypes,
				rubricId: formData.rubricId
			};

			let response;
			if (newRubricData) {
				const data = {
					classId,
					categoryId: formData.categoryId,
					assignmentData: assignmentData,
					rubricData: newRubricData,
					creatorId: user.userId,
					file: formData.file
				};
				response = await addAssignmentWithRubric(data);
			} else {
				const formDataToSend = new FormData();
				formDataToSend.append("classId", classId);
				formDataToSend.append("categoryId", formData.categoryId);
				formDataToSend.append("assignmentData", JSON.stringify(assignmentData));
				if (formData.file) {
					formDataToSend.append("file", formData.file);
				}
				response = await addAssignmentToClass(formDataToSend);
			}

			console.log("Assignment created:", response);
			toast({
				title: "Success",
				description: "Added to class successfully",
				variant: "info"
			});
			onAssignmentCreated();
			// Reset form
			setFormData({
				title: "",
				description: "",
				maxSubmissions: 1,
				isPeerReviewAnonymous: false,
				categoryId: "",
				dueDate: null,
				allowedFileTypes: [],
				rubricId: ""
			});
			setSelectedFileName("");
			setNewRubricData(null);
			setErrors({});
		} catch (error) {
			console.error("Error submitting assignment:", error);
			toast({
				title: "Error",
				description:
					error.message || "There was an error creating the assignment.",
				variant: "destructive"
			});
		}
	};

	const assignmentCreationInfoContent = {
		title: "Creating a New Assignment",
		description: (
			<>
				<p>
					This page allows you to create a new assignment for your class. Here's
					what you can do:
				</p>
				<ul className="list-disc list-inside mt-2">
					<li>Set a title and description for the assignment</li>
					<li>
						Specify the due date and maximum number of submission attempts
					</li>
					<li>Choose or create a category for the assignment</li>
					<li>Select an existing rubric or create a new one</li>
					<li>Define allowed file types for submissions</li>
					<li>Upload any related files or instructions</li>
				</ul>
				<p className="mt-2">
					Make sure to fill out all required fields before submitting the
					assignment.
				</p>
			</>
		)
	};

	return (
		<div className="w-full flex bg-white justify-left flex-row p-4">
			<div>
				<h2 className="text-xl font-semibold mb-4">Add a New Assignment</h2>
				<form onSubmit={handleSubmit} className="w-full space-y-10">
					<div>
						<label htmlFor="title">Title</label>
						<Input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="e.g. Assignment #1"
							className={errors.title ? "border-red-500" : ""}
						/>
						{errors.title && (
							<p className="text-red-500 text-sm mt-1">{errors.title}</p>
						)}
					</div>

					<div>
						<label htmlFor="description">Description</label>
						<Textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							placeholder="e.g. Use 12pt double-spaced font..."
							className={errors.description ? "border-red-500" : ""}
						/>
						{errors.description && (
							<p className="text-red-500 text-sm mt-1">{errors.description}</p>
						)}
					</div>

					<div>
						<label htmlFor="maxSubmissions">Attempts</label>
						<Input
							id="maxSubmissions"
							name="maxSubmissions"
							type="number"
							value={formData.maxSubmissions}
							onChange={handleInputChange}
							className={errors.maxSubmissions ? "border-red-500" : ""}
						/>
						{errors.maxSubmissions && (
							<p className="text-red-500 text-sm mt-1">
								{errors.maxSubmissions}
							</p>
						)}
					</div>

					<div className="flex flex-col space-y-2">
						<label htmlFor="anonymous-peer-review">
							Enable Anonymous Peer Reviews
						</label>
						<Switch
							id="anonymous-peer-review"
							checked={formData.isPeerReviewAnonymous}
							onCheckedChange={(checked) => {
								setFormData((prev) => ({
									...prev,
									isPeerReviewAnonymous: checked
								}));
							}}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label>Due by:</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-[200px] justify-start text-left font-normal",
										!formData.dueDate && "text-muted-foreground",
										errors.dueDate && "border-red-500"
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{formData.dueDate ? (
										format(formData.dueDate, "PPP")
									) : (
										<span>Pick a date</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={formData.dueDate}
									onSelect={(date) =>
										setFormData((prev) => ({ ...prev, dueDate: date }))
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						{errors.dueDate && (
							<p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
						)}
					</div>

					<div>
						<label>Category</label>
						{isCreatingCategory ? (
							<div className="flex items-center space-x-2">
								<Input
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									placeholder="Enter new category name"
								/>
								<Button type="button" onClick={handleCreateCategory}>
									Create
								</Button>
								<Button
									type="button"
									onClick={() => setIsCreatingCategory(false)}
								>
									Cancel
								</Button>
							</div>
						) : (
							<>
								<Select
									onValueChange={(value) =>
										setFormData((prev) => ({ ...prev, categoryId: value }))
									}
									value={formData.categoryId}
								>
									<SelectTrigger
										className={errors.categoryId ? "border-red-500" : ""}
									>
										<SelectValue placeholder="Select category..." />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem
												key={category.categoryId}
												value={category.categoryId}
											>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									type="button"
									variant="outline"
									className="mt-2"
									onClick={() => setIsCreatingCategory(true)}
								>
									<Plus className="mr-2 h-4 w-4" /> Create New Category
								</Button>
							</>
						)}
						{errors.categoryId && (
							<p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
						)}
					</div>

					<div className="space-y-4">
						<RubricCreationForm
							onRubricChange={(newRubricData) => {
								setNewRubricData(newRubricData);
								setFormData((prev) => ({ ...prev, rubricId: "" }));
							}}
							isOpen={isRubricFormOpen}
							setIsOpen={setIsRubricFormOpen}
							disabled={!!formData.rubricId}
						/>

						{(newRubricData || formData.rubricId) && (
							<Button
								type="button"
								variant="outline"
								className="text-sm hover:bg-slate-100 m-2 p-1"
								onClick={resetRubric}
							>
								Reset Rubric Selection
							</Button>
						)}

						<div className="flex justify-between items-center">
							<label>Select Existing Rubric</label>
						</div>
						<Select
							value={formData.rubricId}
							onValueChange={handleRubricSelection}
							disabled={newRubricData !== null}
						>
							<SelectTrigger className={errors.rubric ? "border-red-500" : ""}>
								<SelectValue placeholder="Select a rubric" />
							</SelectTrigger>
							<SelectContent>
								{rubrics.map((rubric) => (
									<SelectItem key={rubric.rubricId} value={rubric.rubricId}>
										{rubric.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.rubric && (
							<p className="text-red-500 text-sm mt-1">{errors.rubric}</p>
						)}
					</div>

					<div>
						<label>Allowed File Types</label>
						<MultiSelect
							options={fileTypeOptions}
							value={formData.allowedFileTypes}
							onChange={(value) =>
								setFormData((prev) => ({ ...prev, allowedFileTypes: value }))
							}
							placeholder="Select allowed file types"
							className={errors.allowedFileTypes ? "border-red-500" : ""}
						/>
						{errors.allowedFileTypes && (
							<p className="text-red-500 text-sm mt-1">
								{errors.allowedFileTypes}
							</p>
						)}
					</div>

					<div>
						<label htmlFor="file-upload">Upload File</label>
						<input
							type="file"
							id="file-upload"
							ref={fileInputRef}
							accept=".pdf"
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
						<div className="flex items-center">
							<Button
								type="button"
								className="bg-white mr-2"
								variant="outline"
								onClick={() => fileInputRef.current.click()}
							>
								<Upload className="mr-2 h-4 w-4 shrink-0 opacity-50" />
								Upload File
							</Button>
							{selectedFileName && <span>{selectedFileName}</span>}
						</div>
						<p className="text-sm text-slate-600 mt-3">
							Attach any files related to the assignment (PDFs preferred).
						</p>
					</div>

					<Button type="submit" className="bg-primary text-white">
						Submit
					</Button>
				</form>
			</div>
			<InfoButton content={assignmentCreationInfoContent} />
		</div>
	);
};

export default AssignmentCreation;
