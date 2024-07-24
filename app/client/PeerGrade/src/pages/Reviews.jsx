import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ReviewDetailsDialog from "@/pages/classNav/assignment/submission/ReviewDetailsDialog";
import ReceivedReviews from "@/components/review/ReceivedReviews";
import AssignedReviews from "@/components/review/AssignedReviews";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
	const [assignedReviews, setAssignedReviews] = useState([]);
	const [receivedReviews, setReceivedReviews] = useState([]);
	const [view, setView] = useState("received");
	const [selectedReview, setSelectedReview] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			if (!user) return;

			try {
				const [assignedResponse, receivedResponse] = await Promise.all([
					reviewAPI.getReviewsAssigned(),
					reviewAPI.getReviewsReceived()
				]);
				setAssignedReviews(assignedResponse.data || []);
				setReceivedReviews(receivedResponse.data || []);
			} catch (error) {
				console.error("Error fetching reviews:", error);
				setAssignedReviews([]);
				setReceivedReviews([]);
			}
		};

		fetchData();
	}, [user]);

	const handleViewDetails = (review, inDialog = true) => {
		if (inDialog) {
			setSelectedReview(review);
			setIsDialogOpen(true);
		} else {
			navigate(`/review/${review.reviewId}`);
		}
	};

	return (
		<div className="w-full px-6">
			<h1 className="text-3xl font-bold mb-6 text-primary">Reviews</h1>

			<Tabs defaultValue={view} className="w-full mb-8" onValueChange={setView}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="received">Reviews Received</TabsTrigger>
					<TabsTrigger value="assigned">Reviews Assigned</TabsTrigger>
				</TabsList>

				<TabsContent value="received">
					<ReceivedReviews
						receivedReviews={receivedReviews}
						onViewDetails={handleViewDetails}
					/>
				</TabsContent>
				<TabsContent value="assigned">
					<AssignedReviews
						assignedReviews={assignedReviews}
						onViewDetails={handleViewDetails}
					/>
				</TabsContent>
			</Tabs>

			<ReviewDetailsDialog
				submissionId={selectedReview?.submissionId}
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
			/>
		</div>
	);
};

export default Reviews;
