// This component is used to display the groups for a class
// It shows the groups with their names and sizes
// It also allows the user to create new groups, edit existing groups, delete groups, and add or remove students from groups

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllGroupsByClass, createGroup, deleteGroup, updateGroup, joinGroup, leaveGroup, addGroupMember, deleteGroupMember, getUsersNotInGroups, getStudentsByClassId } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { ChevronDown, ChevronUp, Plus, Trash2, Pencil, MinusCircle, UserPlus, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import InfoButton from '@/components/global/InfoButton';

const Groups = () => {
	const { classId } = useParams();
	const { user, userLoading } = useUser();
	const [groups, setGroups] = useState([]);
	const [myGroups, setMyGroups] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedGroup, setExpandedGroup] = useState(null);
	const [groupName, setGroupName] = useState('');
	const [description, setDescription] = useState('');
	const [size, setSize] = useState('');
	const [refresh, setRefresh] = useState(false);
	const [open, setOpen] = useState(false);

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);

	const [deleteConfirmDialog, setDeleteConfirmDialogOpen] = useState(false); 	// for deletion dialog
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});
	const [selectedGroupMember, setSelectedGroupMember] = useState({});
	const [deleteTarget, setDeleteTarget] = useState('group');	  

	const [studentOptions, setStudentOptions] = useState([]);					// for adding students to a group
	const [selectedStudents, setSelectedStudents] = useState([]); 

	// Fetch groups on component mount
	useEffect(() => {
		if (user) {
			const fetchAllGroups = async () => {
				try {
					const groups = await getAllGroupsByClass(classId);
					console.log("groups", groups.data);
					setGroups(Array.isArray(groups.data) ? groups.data : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch class' groups",
						variant: "destructive"
					});
				}
			};
			const fetchMyGroups = async () => {
				try {
					const groups = await getGroups(user.userId);
					console.log("my groups", groups.data);
					setMyGroups(Array.isArray(groups.data) ? groups.data.filter(group => group.classId === classId) : []);
				} catch (error) {
					toast({
						title: "Error",
						description: "Failed to fetch user's groups",
						variant: "destructive"
					});
				}
			};
			
			fetchAllGroups();
			fetchMyGroups();
		}
	}, [user, userLoading, classId, refresh]);

	//Fetch users not in groups on component mount
	useEffect(() => {
		if (user && (user.role === "INSTRUCTOR" || user.role === "ADMIN")) {
			const fetchUsersNotInGroups = async () => {
				const students = await getUsersNotInGroups(classId);
				console.log("students", students);
				if (students.status === "Success") {
					const transformedStudents = students.data
						.map((student) => ({
							studentId: student.userId,
							label: student.firstname + " " + student.lastname
						}));
					setStudentOptions(transformedStudents);
				}
			};
			fetchUsersNotInGroups();
		}
	}, [user, userLoading, classId, refresh, addGroupDialogOpen, editDialogOpen]);

	// Filter groups by search term
	const filteredGroups = groups.filter((group) =>
		group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Toggle the expanded state of a group
	const toggleGroup = (groupId) => {
		setExpandedGroup(expandedGroup === groupId ? null : groupId);
	};

	// Add students to a group
	const handleAddStudents = (groupId) => {
		if (selectedStudents.length > 0) {
			const groupMemberAdd = async (studentId) => {
				const groupData = await addGroupMember(groupId, studentId);
				if (groupData.status === "Success") {
					setRefresh(!refresh);
					console.log("in add select student",groupData);
				} else {
					console.error('An error occurred while adding a group member.', groupData.message);
				}
			};
			selectedStudents.forEach((studentId) => groupMemberAdd(studentId));
		}
	};

	// Handle the add group form submission
	const handleAddSubmit = (e) => {
		e.preventDefault();
		const newGroup = {
		  groupName,
		  groupDescription: description,
		  groupSize: parseInt(size, 10),
		};
	
		const groupCreate = async () => {
			const groupData = await createGroup(classId, newGroup);
			if (groupData.status === "Success") {
				console.log("group data from create", groupData);
				setGroups([...groups, groupData.data]);
				console.log("groups after create", groups);
				setAddGroupDialogOpen(false);
				if (user.role === "STUDENT") {
					if (myGroups?.length < 1) {
						handleJoinGroup(groupData.data.groupId);
					}
				} else {
					handleAddStudents(groupData.data.groupId);
				}
			} else {
				console.error('An error occurred while creating the group.', groupData.message);
			}
		};
		groupCreate();
	};

	// Handle the edit group form submission
	const handleEditSubmit = (e) => {
		e.preventDefault();
		const updatedData = {
			groupName,
			groupDescription: description,
			groupSize: parseInt(size, 10),
		};

		const groupEdit = async () => {
			handleAddStudents(selectedGroup.groupId);

			const groupData = await updateGroup(selectedGroup.groupId, updatedData);
			if (groupData.status === "Success") {
				setGroups(groups.map((group) => 
					group.groupId === selectedGroup.groupId ? groupData.data : group
				));
				console.log("after add select student",groupData);
				setEditDialogOpen(false);
			} else {
				console.error('An error occurred while editing the group.', groupData.message);
			}
		};

		groupEdit();
	};

	// Join a group
	const handleJoinGroup = async (groupId) => {
		const groupData = await joinGroup(groupId);
		if (groupData.status === "Success") {
		  console.log("joined group", groupData);
		  setRefresh(!refresh);
		} else {
		  console.error('An error occurred while joining the group.', groupData.message);
		}
	};

	// Leave a group
	const handleLeaveGroup = async (groupId) => {
		const groupData = await leaveGroup(groupId);
		if (groupData.status === "Success") {
			console.log("left group", groupData);
			setRefresh(!refresh);
		} else {
			console.error('An error occurred while leaving the group.', groupData.message);
		}
	};

	// Delete a group
	const handleDeleteGroup = async (groupId) => {
		if (confirmDelete) {
			setConfirmDelete(false);
			const groupData = await deleteGroup(groupId);
			if (groupData.status === "Success") {
				setDeleteConfirmDialogOpen(false);
				setRefresh(!refresh);
				console.log("deleted group", groupData);
			} else {
				console.error('An error occurred while deleting the group.', groupData.message);
			}
		} else {
			setConfirmDelete(true);
		}
	};

	// Delete a group member
	const handleDeleteGroupMember = async (groupId, userId) => {
		if (confirmDelete) {
			setConfirmDelete(false);
			const groupData = await deleteGroupMember(groupId, userId);
			if (groupData.status === "Success") {
				setDeleteConfirmDialogOpen(false);
				setRefresh(!refresh);
				console.log("deleted group member", groupData);
			} else {
				console.error('An error occurred while deleting the group member.', groupData.message);
			}
		} else {
			setConfirmDelete(true);
		}
	};

	//Handle the add group click event
	const handleAddGroupClick = () => {
		setSelectedStudents([]);
		setAddGroupDialogOpen(true);
	};

	// Handle the delete group click event
	const handleDeleteGroupClick = (group) => {
		setSelectedGroup(group);
		setDeleteTarget('group');
		setConfirmDelete(false);
		setDeleteConfirmDialogOpen(true);
	};

	// Handle the delete group member click event
	const handleDeleteGroupMemberClick = (group, groupMember) => {
		setSelectedGroup(group);
		setSelectedGroupMember(groupMember);
		setDeleteTarget('groupMember');
		setConfirmDelete(false);
		setDeleteConfirmDialogOpen(true);
	};

	// Handle the edit group click event
	const handleEditGroupClick = (group) => {
		setSelectedGroup(group);
		setGroupName(group.groupName);
		setDescription(group.groupDescription);
		setSize(group.groupSize.toString());
		setSelectedStudents([]);
		setEditDialogOpen(true);
	};

	// Handle the student selection
	const handleStudentSelection = (studentId) => {
		// deals with selecting/deselecting students to add to the class
		setSelectedStudents((prevSelected) => {
			if (prevSelected.includes(studentId)) {
				return prevSelected.filter((id) => id !== studentId);
			} else {
				return [...prevSelected, studentId];
			}
		});
	};

	
	// Info help guide content for the groups tab (infoButton click render)
	const groupsInfoContent = {
		title: "About Class Groups",
		description: (
		  <>
			<p>This page allows you to manage groups within the class:</p>
			<ul className="list-disc list-inside mt-2">
			  <li>View all existing groups</li>
			  <li>Search for specific groups</li>
			  {user.role === "STUDENT" && (
				<>
				  <li>Join available groups</li>
				  <li>Leave groups you're currently in</li>
				</>
			  )}
			  {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
				<>
				  <li>Create new groups</li>
				  <li>Edit existing groups</li>
				  <li>Delete groups</li>
				  <li>Add or remove students from groups</li>
				</>
			  )}
			</ul>
			<p className="mt-2">Click on a group to expand and see its members.</p>
			{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
			  <p className="mt-2">Use the 'Add Group' button to create new groups and manage their members.</p>
			)}
		  </>
		)
	  };

	return (
		<div className="w-full p-6  ">
			<div className="flex items-center mb-6">
				<Input
					type="text"
					placeholder="Search groups"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
				<Button variant="outline" onClick={handleAddGroupClick} className='ml-4'>
					Add Group <Plus className='w-4 h-4 ml-2'/>
				</Button>
				}
			</div>
			{groups.length === 0 && <div className="text-center text-sm text-gray-500">No groups found.</div>}
			{filteredGroups.map((group) => (
				<Card key={group.groupId} className="mb-4">
					<CardContent
						className="flex justify-between items-center bg-muted p-4 rounded-t-lg cursor-pointer"
						onClick={() => toggleGroup(group.groupId)}
					>
						<div className='flex flex-col'>
							<CardTitle className="text-lg font-bold flex items-center space-x-2">
								<span>{group.groupName}</span>
								{expandedGroup === group.groupId ? <ChevronUp /> : <ChevronDown />}
								
							</CardTitle>
							{expandedGroup === group.groupId && (
								<CardDescription>
									<span className='text-sm text-gray-600'>{group.groupDescription ? group.groupDescription : ""}</span>
								</CardDescription>
							)}
						</div>
						{user.role === "STUDENT" && 
							<div className='flex flex-row items-center justify-center space-x-2'>
								{myGroups?.filter(myGroup => myGroup.groupId === group.groupId).length > 0 ? (
									<Button variant='destructive' className='p-4' onClick={() => handleLeaveGroup(group.groupId)}>Leave</Button>
								) : (myGroups?.length < 1) && (
									<Button variant='ghost' className='bg-gray-200 p-4' onClick={() => handleJoinGroup(group.groupId)}>Join</Button>
								)}
							</div>
						}
						{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
							<div className='flex flex-row items-center justify-center space-x-2'>
									<Button className='p-4 w-10 h-10' onClick={() => handleEditGroupClick(group)} data-testid={`edit-group-${group.groupId}`}>
										<Pencil className='w-4 h-4' />
									</Button>
									<Button variant='destructive' className='p-4 w-10 h-10' onClick={() => handleDeleteGroupClick(group)} data-testid={`delete-group-${group.groupId}`}>
										<Trash2 className='w-4 h-4' />
									</Button>
							</div>
						}
					</CardContent>
					{expandedGroup === group.groupId && (group.students.length > 0) && (
						<CardContent className="p-4">
							<div className='space-y-4'>
								{group.students.map((student) => (
									<div key={student.userId} className="flex flex-row justify-between">
										<div className='flex flex-row items-center justify-center'>
											<Avatar className="w-8 h-8 mr-4">
												<AvatarImage
													src={student.avatarUrl}
													alt={`${student.firstname} ${student.lastname}`}
												/>
												<AvatarFallback>
													{student.firstname ? student.firstname[0] : ''}
													{student.lastname ? student.lastname[0] : ''}
												</AvatarFallback>
											</Avatar>
											<span>{student.firstname} {student.lastname}</span>
										</div>
										{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
											<Button
												variant="outline"
												className="bg-gray-100"
												onClick={() => handleDeleteGroupMemberClick(group, student)}
											>
												<MinusCircle className="w-5 h-5 mr-2" /> Delete
											</Button>
										)}
									</div>
								))}
							</div>
						</CardContent>
					)}
				</Card>
			))}

			{/* Dialog for adding a group */}
			<Dialog open={addGroupDialogOpen} onOpenChange={setAddGroupDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Group</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddSubmit}>
						<div className="mb-4 space-y-1">
							<label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
								Group Name
							</label>
							<input
								type="text"
								id="groupName"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								required
								className="w-full px-3 py-2 border rounded-md"
							/>
						</div>
						<div className="mb-4 space-y-1">
							<label htmlFor="description" className="block text-sm font-medium text-gray-700">
								Group Description
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
						<div className="mb-4 space-y-1">
							<label htmlFor="size" className="block text-sm font-medium text-gray-700">
								Group Size
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
						{(user.role === "INSTRUCTOR" || user.role === "ADMIN") && 
						<div className="mb-4 space-y-1">
							<label htmlFor="size" className="block text-sm font-medium text-gray-700">
								Group Members
							</label>
							<Popover open={open} onOpenChange={setOpen} id="selectStudents">
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={`w-full justify-between bg-white mt-1 border`}
									>
										{selectedStudents.length > 0
											? `${selectedStudents.length} student(s) selected`
											: "Select students..."}
										{open ? (
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
												{studentOptions.map((student) => (
													<CommandItem
														key={student.studentId}
														value={student.label}
														onSelect={() =>
															handleStudentSelection(student.studentId)
														}
													>
														{student.label}
														<CheckIcon
															className={`ml-auto h-4 w-4 ${selectedStudents.includes(student.studentId) ? "opacity-100" : "opacity-0"}`}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						}
						<DialogFooter>
							<Button type="button" onClick={() => setAddGroupDialogOpen(false)}>Cancel</Button>
							<Button type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Dialog for deletion of a group/group member */}
			<Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialogOpen}>
				<DialogContent
					className={
						confirmDelete ? "border-red-950 bg-red-500 text-white" : ""
					}
				>
					<DialogHeader>
						<DialogTitle>
							{confirmDelete ? "Confirm" : ""} Delete {deleteTarget === 'group' ? "Group" : "Group Member" }
						</DialogTitle>
					</DialogHeader>
					Are you {confirmDelete ? "really" : ""} sure you want to {deleteTarget === 'group' ? "delete" : "remove"} the
					{deleteTarget === 'group' ? ` group '${selectedGroup.groupName}'` : ` group member '${selectedGroupMember.firstname} ${selectedGroupMember.lastname}' from the group '${selectedGroup.groupName}'` }?
					<DialogFooter>
						<Button
						 	type="button"
							onClick={() => setDeleteConfirmDialogOpen(false)}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								if (deleteTarget === 'group') handleDeleteGroup(selectedGroup.groupId);
								else handleDeleteGroupMember(selectedGroup.groupId, selectedGroupMember.userId);
							}}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Dialog for editing a group */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Group</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditSubmit}>
						<div className="mb-4 space-y-1">
							<label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
								Group Name
							</label>
							<input
								type="text"
								id="groupName"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								required
								className="w-full px-3 py-2 border rounded-md"
							/>
						</div>
						<div className="mb-4 space-y-1">
							<label htmlFor="description" className="block text-sm font-medium text-gray-700">
								Group Description
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
						<div className="mb-4 space-y-1">
							<label htmlFor="size" className="block text-sm font-medium text-gray-700">
								Group Size
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
						<div className="mb-4 space-y-1">
							<label htmlFor="size" className="block text-sm font-medium text-gray-700">
								Group Members
							</label>
							<Popover open={open} onOpenChange={setOpen} id="selectStudents">
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={open}
										className={`w-full justify-between bg-white mt-1 border`}
									>
										{selectedStudents.length > 0
											? `${selectedStudents.length} student(s) selected`
											: "Select students..."}
										{open ? (
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
												{studentOptions.map((student) => (
													<CommandItem
														key={student.studentId}
														value={student.label}
														onSelect={() =>
															handleStudentSelection(student.studentId)
														}
													>
														{student.label}
														<CheckIcon
															className={`ml-auto h-4 w-4 ${selectedStudents.includes(student.studentId) ? "opacity-100" : "opacity-0"}`}
														/>
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<DialogFooter>
							<Button type="button" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
							<Button type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<InfoButton content={groupsInfoContent} />

		</div>
	);
};

export default Groups;
