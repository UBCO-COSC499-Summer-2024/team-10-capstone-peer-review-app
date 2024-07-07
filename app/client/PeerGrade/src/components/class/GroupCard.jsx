import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const GroupCard = ({ classes, groups, classNames, users }) => {
	const [selectedClass, setSelectedClass] = useState(null);
	const [filteredGroups, setFilteredGroups] = useState([]);

	useEffect(() => {
		if (classes && classes.length > 0) setSelectedClass(classes[0]);
	}, [classes]);

	useEffect(() => {
		if (selectedClass) {
			setFilteredGroups(groups.filter((group) => group.classId === selectedClass.classId));
		}
	}, [selectedClass, groups]);

	const getGroupMembers = (groupId) => {
		return filteredGroups.filter((group) => group.groupId === groupId);
	};

	return (
		<div>
			<Card className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
				<CardHeader>
					<CardTitle>Group Members</CardTitle>
					<CardDescription>
						Invite your group members to collaborate.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Popover>
						<PopoverTrigger asChild className="w-full">
							<Button variant="outline" className="mb-4">
								{selectedClass ? selectedClass.classname : "Select a class"}
							</Button>
						</PopoverTrigger>
						<PopoverContent>
							{classNames.map((classItem) => (
								<div
									key={classItem.classId}
									className="cursor-pointer p-2 hover:bg-gray-100"
									onClick={() => setSelectedClass(classItem)}
								>
									{classItem.classname}
								</div>
							))}
						</PopoverContent>
					</Popover>
					{filteredGroups.map((group) =>
						getGroupMembers(group.groupId).map((member) => {
							const user = users.find((u) => u.user_id === member.student_id);
							return (
								<div
									key={member.groupId}
									className="flex items-center justify-between mb-4"
								>
									<div className="flex items-center">
										<Avatar className="w-10 h-10 mr-4">
											<AvatarImage
												src={user.avatarUrl}
												alt={`${user.firstname} ${user.lastname}`}
											/>
											<AvatarFallback>
												{user.firstname[0]}
												{user.lastname[0]}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-semibold">{`${user.firstname} ${user.lastname}`}</div>
											<div className="text-gray-500">{user.email}</div>
										</div>
									</div>
									<Button variant="outline">{user.type}</Button>
								</div>
							);
						})
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default GroupCard;
