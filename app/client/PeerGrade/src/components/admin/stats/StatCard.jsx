// The main function of this component is to display a card with a title, number, icon, and description.
// It takes in a title, number, icon, and description as props.

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const StatCard = ({
	title,
	number,
	icon,
	description,
}) => {
	return (
			<Card className="w-full flex items-center justify-between bg-white shadow-md rounded-lg">
				<CardHeader className=" border-r-3">
					<CardTitle className="text-xl font-bold">{title}</CardTitle>
					<CardDescription className="text-gray-500">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col space-y-2 items-center justify-center">
        			<div>{icon}</div> 
					<div className="flex items-center space-x-2">
						<span className="text-gray-700 text-lg">{number}</span>
					</div>
				</CardContent>
			</Card>
	);
};

export default StatCard;
