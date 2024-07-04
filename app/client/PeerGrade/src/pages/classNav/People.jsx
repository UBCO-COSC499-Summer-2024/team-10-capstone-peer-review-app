import { useEffect, useState } from "react";
import { peopleData } from "../../utils/data";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { getInstructorByClassId, getStudentsByClassId } from "@/api/classApi";

const People = ({ classId }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const [students, setStudents] = useState([]);
	const [instructor, setInstructor] = useState({});

	useEffect(() => {
		const fetchInstructor = async () => {
			const instructor = await getInstructorByClassId(classId);
			console.log("instuctor", instructor);
			if (instructor.status === "Success") {
				setInstructor(instructor.data);
			}
		};

		fetchInstructor();
	}, [classId]);

	useEffect(() => {
		const fetchStudents = async () => {
			const students = await getStudentsByClassId(classId);
			console.log("students", students);
			if (students.status === "Success") {
				setStudents(students.data);
			}
		};

		fetchStudents();
	}, [classId]);

	// TODO: Change this to an array of instructors if we end up deciding to have multiple instructors per class later on
	// const filteredInstructors = instructor.filter((person) =>
	// 	person.name.toLowerCase().includes(searchTerm.toLowerCase())
	// );

	let filteredInstructor = null;
	if (instructor.firstname && instructor.lastname) {
		const fullName =
			`${instructor.firstname} ${instructor.lastname}`.toLowerCase();
		if (fullName.includes(searchTerm.toLowerCase())) {
			filteredInstructor = instructor; // instructor matches the search term
		}
	}

	// For the students array
	const filteredStudents = students.filter((student) => {
		const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
		return fullName.includes(searchTerm.toLowerCase());
	});

	const getInitials = (firstName, lastName) => {
		const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
		const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
		return `${firstInitial}${lastInitial}`;
	};

	return (
		<div className="w-full p-6 bg-white">
			<Input
				type="text"
				placeholder="Search people"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="mb-6"
			/>
			<div>
				<h2 className="text-lg font-bold mb-2">Instructor</h2>
				{filteredInstructor && (
					<Card
						key={filteredInstructor.userId}
						className="flex items-center p-4 mb-2"
					>
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-3 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={filteredInstructor.avatarUrl}
									alt={`${filteredInstructor.firstname} ${filteredInstructor.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(
										filteredInstructor.firstname,
										filteredInstructor.lastname
									)}
								</AvatarFallback>
							</Avatar>
							<span>
								{filteredInstructor.firstname} {filteredInstructor.lastname}
							</span>
						</div>
					</Card>
				)}
			</div>
			<div className="mt-6">
				<h2 className="text-lg font-bold mb-2">Students</h2>
				{filteredStudents.map((student) => (
					<Card
						key={student.userId}
						className="flex items-center justify-between p-4 mb-2"
					>
						<div className="flex items-center">
							<Avatar className="w-9 h-9 mr-2.5 bg-gray-200 rounded-full shadow-md">
								{/* For future development, we can add an avatarUrl to the user object to render a profile picture*/}
								<AvatarImage
									src={student.avatarUrl}
									alt={`${student.firstname} ${student.lastname}`}
								/>
								<AvatarFallback>
									{getInitials(student.firstname, student.lastname)}
								</AvatarFallback>
							</Avatar>
							<span>
								{student.firstname} {student.lastname}
							</span>
						</div>
						<Button variant="outline" className="bg-gray-100">
							Add to Group
						</Button>
					</Card>
				))}
			</div>
		</div>
	);
};

export default People;
