// The main function of this component is to display a table of users that the admin can view on the admin ui users tab.
// It takes in a title, data, and columns as props.
// The component also uses the useUser and useClass hooks to fetch user and class data where its needed.

import { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	ArrowUp,
	ArrowDown,
	ChevronUpIcon,
	ChevronDownIcon,
	CheckIcon,
	Dot,
	Trash2,
	Pencil
} from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover";
import {
	Command,
	CommandList,
	CommandGroup,
	CommandItem
} from "@/components/ui/command";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/contextHooks/useUser";
import { cn } from "@/utils/utils";
import { useClass } from "@/contexts/contextHooks/useClass";
import DeleteClassDialog from "@/components/manageClass/DeleteClassDialog";
import EditClassDialog from "@/components/manageClass/EditClassModal";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

function ClassTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOrder, setSortOrder] = useState({
		key: "classname",
		order: "asc"
	});
	const [filter, setFilter] = useState({
		term: "",
		size: "",
		searchQuery: "",
		instructorQuery: ""
	});
	const [open, setOpen] = useState(false);
	const [openTerm, setOpenTerm] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedClass, setSelectedClass] = useState({});
	const [classData, setClassData] = useState({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const itemsPerPage = 5;
	const query = useQuery();
	const queryClassname = query.get("query") || "";
	const { user, userLoading } = useUser();
	const navigate = useNavigate();

	const { classes, removeClass } = useClass();

	if (!userLoading && (!user || user.role !== "ADMIN")) {
		return <div>You do not have permission to view this page.</div>;
	}

	useEffect(() => {
		setFilter((prevFilter) => ({
			...prevFilter,
			searchQuery: queryClassname
		}));
	}, [queryClassname]);

	const handleSort = (key) => {
		setSortOrder({
			key,
			order: sortOrder.key === key && sortOrder.order === "asc" ? "desc" : "asc"
		});
	};

	// Search bar filter function
	const handleFilterChange = (e) => {
		setFilter({
			...filter,
			[e.target.name]: e.target.value
		});
	};

	const handleTrashClick = (selected_class) => {
		setConfirmDelete(false);
		setSelectedClass(selected_class);
		setDialogOpen(true);
	};

	const handleDeleteClass = async () => {
		if (confirmDelete) {
			setConfirmDelete(false);
			if (selectedClass) {
				removeClass(selectedClass.classId);
				setDialogOpen(false);
			} else {
				console.error(
					"An error occurred while deleting the class.",
					classData.message
				);
			}
		} else {
			setConfirmDelete(true);
		}
	};

	// Filter classes based on search query, instructor query, and term
	const filteredClasses = classes
		.filter(
			(classItem) =>
				(filter.searchQuery
					? classItem.classname
							.toLowerCase()
							.includes(filter.searchQuery.toLowerCase())
					: true) &&
				(filter.instructorQuery
					? classItem.instructor?.firstname
							.toLowerCase()
							.includes(filter.instructorQuery.toLowerCase()) ||
						classItem.instructor?.lastname
							.toLowerCase()
							.includes(filter.instructorQuery.toLowerCase())
					: true) &&
				(filter.term ? classItem.term === filter.term : true) &&
				(filter.size ? classItem.classSize === parseInt(filter.size) : true)
		)
		.sort((a, b) => {
			const { key, order } = sortOrder;
			if (key === "classname") {
				return order === "asc"
					? a.classname.localeCompare(b.classname)
					: b.classname.localeCompare(a.classname);
			} else if (key === "start") {
				return order === "asc"
					? new Date(a.startDate) - new Date(b.startDate)
					: new Date(b.startDate) - new Date(a.startDate);
			} else if (key === "end") {
				return order === "asc"
					? new Date(a.endDate) - new Date(b.endDate)
					: new Date(b.endDate) - new Date(a.endDate);
			} else if (key === "size") {
				return order === "asc" ? a.classSize - b.classSize : b.classSize - a.classSize;
			}
		});

	const getDropdownOptionsTerm = (classes) => {
		const uniqueTerms = Array.from(
			new Set(classes.filter((classItem) => classItem.term && classItem.term !== "").map((classItem) => classItem.term))
		);
		return [
			{ value: "", label: "All" },
			...uniqueTerms.map((term) => ({ value: term, label: term }))
		];
	};
	const dropdownOptionsTerm = getDropdownOptionsTerm(classes);

	const totalPages =
		Math.ceil(filteredClasses.length / itemsPerPage) === 0
			? 1
			: Math.ceil(filteredClasses.length / itemsPerPage);
	const currentClasses = filteredClasses.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handleEditClick = (classItem) => {
		setClassData(classItem);
		setOpen(true);
	}

	return (
		<div className="w-full bg-white shadow-md rounded-lg">
			<div className="p-4">
				<div className="flex space-x-2">
					<div className="flex w-auto max-w-sm items-center">
						<label>Term</label>
						<Popover open={openTerm} onOpenChange={setOpenTerm}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={openTerm}
									className="justify-between bg-white w-full mx-3 "
								>
									{filter.term
										? dropdownOptionsTerm.find(
												(option) => option.value === filter.term
											)?.label
										: "No term selected"}
									{openTerm ? (
										<ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									) : (
										<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[200px] p-0 rounded-md">
								<Command>
									<CommandList>
										<CommandGroup>
											{dropdownOptionsTerm.map((option) => (
												<CommandItem
													key={option.value}
													value={option.value}
													onSelect={(currentValue) => {
														setFilter({ ...filter, term: currentValue });
														setOpenTerm(false);
													}}
												>
													{option.label}
													<CheckIcon
														className={cn(
															"ml-auto h-4 w-4 w-auto",
															filter.term === option.value
																? "opacity-100"
																: "opacity-0"
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
					<div className="flex w-auto max-w-sm items-center">
						<label className="whitespace-nowrap mr-3">Class Name</label>
						<Input
							placeholder="ART 101"
							value={filter.searchQuery}
							onChange={(e) => handleFilterChange(e)}
							name="searchQuery"
							className="w-auto mr-3"
						/>
					</div>
					<div className="flex w-auto max-w-sm items-center">
						<label className="whitespace-nowrap mr-3">Instructor Name</label>
						<Input
							placeholder="John Doe"
							value={filter.instructorQuery}
							onChange={(e) => handleFilterChange(e)}
							name="instructorQuery"
							className="w-auto "
						/>
					</div>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead
							className="text-left cursor-pointer"
							onClick={() => handleSort("classname")}
							data-testid="class-name-header"
						>
							<div className="flex items-center">
								Class Name{" "}
								{sortOrder.key === "classname" ? (
									sortOrder.order === "asc" ? (
										<ArrowUp className="ml-1 h-5 w-5" />
									) : (
										<ArrowDown className="ml-1 h-5 w-5" />
									)
								) : (
									<Dot className="ml-1 h-5 w-5" />
								)}
							</div>
						</TableHead>
						<TableHead className="text-left">Instructor Name</TableHead>
						<TableHead
							className="text-left cursor-pointer"
							onClick={() => handleSort("start")}
						>
							<div className="flex items-center">
								Start Date{" "}
								{sortOrder.key === "start" ? (
									sortOrder.order === "asc" ? (
										<ArrowUp className="ml-1 h-5 w-5" />
									) : (
										<ArrowDown className="ml-1 h-5 w-5" />
									)
								) : (
									<Dot className="ml-1 h-5 w-5" />
								)}
							</div>
						</TableHead>
						<TableHead
							className="text-left cursor-pointer"
							onClick={() => handleSort("end")}
						>
							<div className="flex items-center">
								End Date{" "}
								{sortOrder.key === "end" ? (
									sortOrder.order === "asc" ? (
										<ArrowUp className="ml-1 h-5 w-5" />
									) : (
										<ArrowDown className="ml-1 h-5 w-5" />
									)
								) : (
									<Dot className="ml-1 h-5 w-5" />
								)}
							</div>
						</TableHead>
						<TableHead className="text-left">Term</TableHead>
						<TableHead
							className="text-left cursor-pointer"
							onClick={() => handleSort("size")}
						>
							<div className="flex items-center">
								Size{" "}
								{sortOrder.key === "size" ? (
									sortOrder.order === "asc" ? (
										<ArrowUp className="ml-1 h-5 w-5" />
									) : (
										<ArrowDown className="ml-1 h-5 w-5" />
									)
								) : (
									<Dot className="ml-1 h-5 w-5" />
								)}
							</div>
						</TableHead>
						<TableHead className="text-left">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentClasses.map((classItem, index) => (
						<TableRow key={index}>
							<TableCell className="p-2" data-testid="class-name">
								<Link to={`/class/${classItem.classId}`}>
									{classItem.classname}
								</Link>
							</TableCell>
							<TableCell className="p-2">
								{classItem.instructor?.firstname}{" "}
								{classItem.instructor?.lastname}
							</TableCell>
							<TableCell className="p-2">
								{new Date(classItem.startDate).toLocaleDateString()}
							</TableCell>
							<TableCell className="p-2">
								{new Date(classItem.endDate).toLocaleDateString()}
							</TableCell>
							<TableCell className="p-2">{classItem.term}</TableCell>
							<TableCell className="p-2">{classItem.classSize}</TableCell>
							<TableCell className="p-2">
								<Button
									variant="ghost"
									size="icon"
									className="text-red-500 hover:bg-red-100"
									onClick={() => handleTrashClick(classItem)}
									data-testid={`delete-button-${classItem.classId}`}
								>
									<Trash2 className="h-5 w-5" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="text-blue-500 hover:bg-blue-100"
									onClick={() => handleEditClick(classItem)}
									data-testid={`edit-button-${classItem.classId}`}
								>
									<Pencil className="h-5 w-5" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex justify-between p-4">
				<Button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<Button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
			<DeleteClassDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				confirmDelete={confirmDelete}
				selectedClass={selectedClass}
				handleDeleteClass={handleDeleteClass}
			/>
			{/* This check is here to ensure it doesn't load before the classData data is present. */}
			{classData.startDate && <EditClassDialog open={open} onOpenChange={setOpen} classItem={classData}/>}
		</div>
	);
}

function Search() {
	return (
		<div className="w-full space-y-6">
			<h1 className="text-2xl font-bold">All Classes</h1>
			<ClassTable />
		</div>
	);
}

export default Search;
