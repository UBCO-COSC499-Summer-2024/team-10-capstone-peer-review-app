import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { sendNotificationToClass, sendNotificationToGroup, sendNotificationToRole, sendNotificationToAll } from '@/api/notifsApi';
import { getAllGroups } from '@/api/userApi';
import { useUser } from "@/contexts/contextHooks/useUser";
import { useClass } from "@/contexts/contextHooks/useClass";
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '../ui/separator';

const NotificationsPanel = () => {
	const { user, userLoading } = useUser();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [selectedRole, setSelectedRole] = useState('');
	const [selectedClass, setSelectedClass] = useState({});
	const [selectedGroup, setSelectedGroup] = useState({});
	const [groups, setGroups] = useState([]);
	const { classes } = useClass();
	const { toast } = useToast();

    useEffect(() => {
		const fetchGroups = async () => {
			try {
				const groups = await getAllGroups();
				setGroups(Array.isArray(groups.data) ? groups.data : [] );
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch groups",
					variant: "destructive"
				});
			}
		};

		fetchGroups();
	}, [user, userLoading]);

	const handleSendToClass = async () => {
		const response = await sendNotificationToClass(user.userId, title, content, selectedClass.classId);
		toast({
			title: "Success",
			description: "Notification sent to the selected class",
			variant: "positive"
		});
		setTitle('');
		setContent('');
		setSelectedRole('');
		setSelectedGroup({});
		setSelectedClass({});
		console.log("class",response);
	};

	const handleSendToGroup = async () => {
		const response = await sendNotificationToGroup(user.userId, title, content, selectedGroup.groupId);
		toast({
			title: "Success",
			description: "Notification sent to the selected group",
			variant: "positive"
		});
		setTitle('');
		setContent('');
		setSelectedRole('');
		setSelectedGroup({});
		setSelectedClass({});
		console.log("group",response);
	};

	const handleSendToRole = async () => {
		const response = await sendNotificationToRole(user.userId, title, content, selectedRole);
		toast({
			title: "Success",
			description: "Notification sent to the selected role",
			variant: "positive"
		});
		setTitle('');
		setContent('');
		setSelectedRole('');
		setSelectedGroup({});
		setSelectedClass({});
		console.log("role",response);
	};

	const handleSendToAll = async () => {
		const response = await sendNotificationToAll(user.userId, title, content);
		toast({
			title: "Success",
			description: "Notification sent to all users",
			variant: "positive"
		});
		setTitle('');
		setContent('');
		setSelectedRole('');
		setSelectedGroup({});
		setSelectedClass({});
		console.log("all",response);
	};

	return (
		<div className="w-full space-y-6">
			<h1 className="text-2xl font-bold">Notifications Panel</h1>

			<div className="pt-6 bg-white rounded-lg p-4 space-y-4 w-1/3 sm:w-2/3">
				<div className='flex flex-row space-x-4 items-center justify-between'>
					<div className='space-y-2 w-full'>
						<input
							type="text"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="border rounded p-2 w-full"
						/>
						<textarea
							placeholder="Content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="border rounded p-2 w-full"
						/>
					</div>
					<Button onClick={handleSendToAll} className="w-80">
						Send Notification to All Users
					</Button>
				</div>
				
				<div className='flex flex-col space-y-2'>
					<Label htmlFor="classes">Class</Label>
					<div className='w-full flex items-center space-x-4'>
						<Select value={selectedClass} onValueChange={setSelectedClass}>
							<SelectTrigger id="classes">
								<SelectValue placeholder="Select class" />
							</SelectTrigger>
							<SelectContent>
								{classes.map((currentClass) => (
									<SelectItem key={currentClass.classId} value={currentClass.classId}>{currentClass.classname}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button onClick={handleSendToClass} className='w-80'>
							Send Notification to Class
						</Button>
					</div>
				</div>
				
				<div className='flex flex-col space-y-2'>
					<Label htmlFor="groups">Group</Label>
					<div className='w-full flex items-center space-x-4'>
						<Select value={selectedGroup} onValueChange={setSelectedGroup}>
							<SelectTrigger id="groups">
								<SelectValue placeholder="Select group" />
							</SelectTrigger>
							<SelectContent>
								{groups.map((group) => (
									<SelectItem key={group.groupId} value={group.groupId}>{group.groupName}</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button onClick={handleSendToGroup} className='w-80'>
							Send Notification to Group
						</Button>
					</div>
				</div>
				
				<div className='flex flex-col space-y-2'>
					<Label htmlFor="roles">Role</Label>
					<div className='w-full flex items-center space-x-4'>
						<Select value={selectedRole} onValueChange={setSelectedRole}>
							<SelectTrigger id="roles">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="STUDENT">Student</SelectItem>
								<SelectItem value="INSTRUCTOR">Instructor</SelectItem>
								<SelectItem value="ADMIN">Admin</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={handleSendToRole} className='w-80'>
							Send Notification to Role
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsPanel;
