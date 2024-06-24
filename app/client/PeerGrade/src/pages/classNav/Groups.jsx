import { useState } from 'react';
import { groupsData } from '../../utils/data';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const Groups = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedGroup, setExpandedGroup] = useState(null);

	const filteredGroups = groupsData.filter((group) =>
		group.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const toggleGroup = (groupId) => {
		setExpandedGroup(expandedGroup === groupId ? null : groupId);
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
				<Button variant="outline">Add Group +</Button>
			</div>
			{filteredGroups.map((group) => (
				<Card key={group.id} className="mb-4">
					<CardHeader
						className="flex justify-between items-center bg-gray-200 p-4 rounded-t-lg cursor-pointer"
						onClick={() => toggleGroup(group.id)}
					>
						<CardTitle className="text-lg font-bold flex items-center space-x-2">
							<span>{group.name}</span>
							{expandedGroup === group.id ? <ChevronUp /> : <ChevronDown />}
						</CardTitle>
					</CardHeader>
					{expandedGroup === group.id && (
						<CardContent className="p-4">
							{group.members.map((member) => (
								<div key={member.id} className="flex items-center mb-2">
									<div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
									<span>{member.name}</span>
								</div>
							))}
						</CardContent>
					)}
				</Card>
			))}
		</div>
	);
};

export default Groups;
