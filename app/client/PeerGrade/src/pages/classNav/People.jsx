import React, { useState } from "react";
import { peopleData } from "../../lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const People = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredInstructors = peopleData.instructors.filter((person) =>
		person.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const filteredStudents = peopleData.students.filter((person) =>
		person.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

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
				<h2 className="text-lg font-bold mb-2">Instructor / TA</h2>
				{filteredInstructors.map((instructor) => (
					<Card key={instructor.id} className="flex items-center p-4 mb-2">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
							<span>{instructor.name}</span>
						</div>
					</Card>
				))}
			</div>
			<div className="mt-6">
				<h2 className="text-lg font-bold mb-2">Students</h2>
				{filteredStudents.map((student) => (
					<Card
						key={student.id}
						className="flex items-center justify-between p-4 mb-2"
					>
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
							<span>{student.name}</span>
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
