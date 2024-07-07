import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllGroupsByClass, createGroup, deleteGroup, updateGroup, joinGroup, leaveGroup } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { ChevronDown, ChevronUp, Plus, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
	const [deleteConfirmDialog, setDeleteConfirmDialogOpen] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState({});

	useEffect(() => {
		if (!userLoading && user) {
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

			fetchMyGroups();
			fetchAllGroups();
		}
	}, [user, userLoading, classId, refresh]);

	const filteredGroups = groups.filter((group) =>
		group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const toggleGroup = (groupId) => {
		setExpandedGroup(expandedGroup === groupId ? null : groupId);
	};

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
		  } else {
			console.error('An error occurred while creating the group.', groupData.message);
		  }
		};
		groupCreate();
	};

	const handleEditSubmit = (e) => {
		e.preventDefault();
		const updatedData = {
			groupName,
			groupDescription: description,
			groupSize: parseInt(size, 10),
		};

		const groupEdit = async () => {
		  const groupData = await updateGroup(selectedGroup.groupId, updatedData);
		  if (groupData.status === "Success") {
			console.log("group data from editing", groupData);
			setGroups(groups.map((group) => 
				group.groupId === selectedGroup.groupId ? groupData.data : group
			));
			console.log("groups after editing", groups);
			setEditDialogOpen(false);
		  } else {
			console.error('An error occurred while editing the group.', groupData.message);
		  }
		};
		groupEdit();
	};

	const handleJoinGroup = async (groupId) => {
		const groupData = await joinGroup(groupId);
		if (groupData.status === "Success") {
		  console.log("joined group", groupData);
		  setRefresh(!refresh);
		} else {
		  console.error('An error occurred while joining the group.', groupData.message);
		}
	};

	const handleLeaveGroup = async (groupId) => {
		const groupData = await leaveGroup(groupId);
		if (groupData.status === "Success") {
			console.log("left group", groupData);
			setRefresh(!refresh);
		} else {
			console.error('An error occurred while leaving the group.', groupData.message);
		}
	};

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

	const handleAddGroupDialogOpen = (group) => {
		setSelectedGroup(group);
		setConfirmDelete(false);
		setDeleteConfirmDialogOpen(true);
	};

	const handleEditGroupDialogOpen = (group) => {
		setSelectedGroup(group);
		setGroupName(group.groupName);
		setDescription(group.groupDescription);
		setSize(group.groupSize.toString());
		setEditDialogOpen(true);
	};

	return (
		<div className="w-full p-6">
			<div className="flex items-center mb-6">
				<Input
					type="text"
					placeholder="Search groups"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="mr-4"
				/>
				<Button variant="outline" onClick={() => setAddGroupDialogOpen(true)}>
					Add Group <Plus className='w-4 h-4 ml-2'/>
				</Button>
			</div>
			{groups.length === 0 && <div className="text-center text-sm text-gray-500">No groups found.</div>}
			{filteredGroups.map((group) => (
				<Card key={group.groupId} className="mb-4">
					<CardContent
						className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg cursor-pointer"
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
									<Button className='p-4 w-10 h-10' onClick={() => handleEditGroupDialogOpen(group)}>
										<Pencil className='w-4 h-4' />
									</Button>
									<Button variant='destructive' className='p-4 w-10 h-10' onClick={() => handleAddGroupDialogOpen(group)}>
										<Trash2 className='w-4 h-4' />
									</Button>
							</div>
						}
					</CardContent>
					{expandedGroup === group.groupId && (group.students.length > 0) && (
						<CardContent className="p-4 flex flex-row items-center justify-between">
							<div>
								{group.students.map((student) => (
									<div key={student.userId} className="flex items-center mb-2">
										<div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
										<span>{student.firstname} {student.lastname}</span>
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
						<DialogFooter>
							<Button onClick={() => setAddGroupDialogOpen(false)}>Cancel</Button>
							<Button variant="destructive" type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Dialog for deletion of a group */}
			<Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialogOpen}>
				<DialogContent
					className={
						confirmDelete ? "border-red-950 bg-red-500 text-white" : ""
					}
				>
					<DialogHeader>
						<DialogTitle>
							{confirmDelete ? "Confirm" : ""} Delete Group
						</DialogTitle>
					</DialogHeader>
					Are you {confirmDelete ? "really" : ""} sure you want to delete the
					group '{selectedGroup.groupName}'?
					<DialogFooter>
						<Button
							onClick={() => setDeleteConfirmDialogOpen(false)}
							className={confirmDelete ? "shadow-md shadow-red-900" : ""}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => handleDeleteGroup(selectedGroup.groupId)}
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
						<DialogFooter>
							<Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
							<Button variant="destructive" type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Groups;
