import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllGroupsByClass, createGroup, joinGroup, leaveGroup } from "@/api/classApi";
import { getGroups } from "@/api/userApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
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
	const [dialogOpen, setDialogOpen] = useState(false);
	const [expandedGroup, setExpandedGroup] = useState(null);
	const [groupName, setGroupName] = useState('');
	const [description, setDescription] = useState('');
	const [size, setSize] = useState('');
	const [refresh, setRefresh] = useState(false);

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

	const handleSubmit = (e) => {
		e.preventDefault();
		const newGroup = {
		  groupName,
		  groupDescription : description,
		  groupSize: parseInt(size, 10),
		};
	
		const groupCreate = async () => {
		  const groupData = await createGroup(classId, newGroup);
		  if (groupData.status === "Success") {
			console.log("group data from create", groupData);
			setGroups([...groups, groupData.data]);
			console.log("groups after create", groups);
			setDialogOpen(false);
		  } else {
			console.error('An error occurred while creating the group.', groupData.message);
		  }
		};
		groupCreate();
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
				<Button variant="outline" onClick={() => setDialogOpen(true)}>
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
						<div className='flex flex-row items-center justify-center space-x-2'>
							{(myGroups?.filter(myGroup => myGroup.groupId === group.groupId).length > 0) && (user.role === "STUDENT") ? (
								<Button variant='destructive' className='p-4' onClick={() => handleLeaveGroup(group.groupId)}>Leave</Button>
							) : (myGroups?.length < 1) && (
								<Button variant='ghost' className='bg-gray-200 p-4' onClick={() => handleJoinGroup(group.groupId)}>Join</Button>
							)}
						</div>
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
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Group</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
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
						<div className="mb-4">
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
						<div className="mb-4">
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
							<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
							<Button variant="destructive" type="submit">Submit</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Groups;
