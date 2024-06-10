import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import { FileText } from "lucide-react";

const Grades = ({ classAssignments }) => {
	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg">
				<CardTitle className="text-xl font-bold">Class Grades</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Assignment</TableHead>
							<TableHead className="text-left">Document Status</TableHead>
							<TableHead className="text-left">Due Date</TableHead>
							<TableHead className="text-left">Grade</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{classAssignments.map((assignment, index) => (
							<TableRow key={index}>
								<TableCell className="flex items-center">
									<FileText className="mr-2" /> {assignment.name}
								</TableCell>
								<TableCell className="text-center">
									<FileText className="mx-auto" />
								</TableCell>
								<TableCell>{assignment.dueDate}</TableCell>
								<TableCell>{Math.floor(Math.random() * 100)}/100</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default Grades;
