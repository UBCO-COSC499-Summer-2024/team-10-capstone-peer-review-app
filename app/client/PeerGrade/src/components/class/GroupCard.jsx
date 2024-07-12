import React, { useEffect, useState } from "react";
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent
} from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
  } from "@/components/ui/carousel"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GroupCard = ({ groups }) => {

	const getGroupMembers = (groupId) => {
		return groups.filter((group) => group.groupId === groupId);
	};

	return (
		<div className="w-full">
			<Card className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg">
				<CardHeader>
					<CardTitle className='text-center'>Groups</CardTitle>
				</CardHeader>
				<CardContent className='flex items-center justify-center'>
					{groups.length === 0 && <div className="text-sm text-gray-500 text-center px-6">No groups found.<p className="mt-2">Join or create a group in any class to see it here!</p></div>}
					{groups.length > 0 &&
						<Carousel className="w-full max-w-xs">
							<CarouselContent>
								{Array.from({ length: groups.length }).map((_, index) => (
									<CarouselItem key={index}>
										<Card className='h-full'>
											<CardHeader>
												<Link to="">
													<CardTitle className='text-center text-xl shadow-sm rounded-lg hover:shadow-lg transition-all break-words border p-1'>{groups[index].groupName}</CardTitle>
												</Link>
												<CardDescription className='text-center break-words'>
													{groups[index].groupDescription}
												</CardDescription>
											</CardHeader>
											<CardContent className="flex flex-col items-center">
												<div className="flex flex-col justify-center items-center w-full">
												{groups[index].students.map((student) => (
													<div className="flex items-center mb-2 w-full" key={student.id}>
													<Avatar className="w-8 h-8 mr-4">
														<AvatarImage
														src={student.avatarUrl}
														alt={`${student.firstname} ${student.lastname}`}
														/>
														<AvatarFallback>
														{student.firstname[0]}
														{student.lastname[0]}
														</AvatarFallback>
													</Avatar>
													<div className="font-semibold">{`${student.firstname} ${student.lastname}`}</div>
													</div>
												))}
												</div>
											</CardContent>
										</Card>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					}
				</CardContent>
			</Card>
		</div>
	);
};

export default GroupCard;
