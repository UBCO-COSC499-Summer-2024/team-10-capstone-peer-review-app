import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

function AssignmentRow({
	id,
	name,
	className,
	dueDate,
	peerReviewDueDate,
	forReview
}) {
	const link = forReview ? `/assignedPR/${id}` : `/assignment/${id}`;
	const displayDate = forReview ? peerReviewDueDate : dueDate;

	return (
		<div className="flex items-center gap-5 p-2 justify-between ">
			<div>
				<div className="font-medium text-lg">{name}</div>
				<div className="text-sm text-gray-500">{className}</div>
			</div>
			<div className="flex items-center justify-center">
				<div className="text-sm text-gray-500 ">
					<p className="p-4 bg-red-100 rounded-full">{displayDate}</p>
				</div>
				<Link to={link}>
					<Button variant="ghost">
						<p className="p-4 bg-blue-100 rounded-full">OPEN</p>
					</Button>
				</Link>
			</div>
		</div>
	);
}

export default AssignmentRow;
