import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ViewReviewGradeDialog from "@/components/review/ViewReviewGradeDialog";
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

	const fetchData = useCallback(async () => {
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
	}, [user]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleViewReviews = async (review, inDialog = true) => {
		await fetchData();

		if (inDialog) {
			setSelectedReview(review);
			setIsDialogOpen(true);
		} else {
			navigate(`/viewSubmission/${review.submission.submissionId}`);
		}
		// Re-fetch data to ensure it's up to date
	};

	const handleCloseDialog = async () => {
		await fetchData();

		setIsDialogOpen(false);
		// Re-fetch data when the dialog is closed
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
						onViewDetails={handleViewReviews}
					/>
				</TabsContent>
				<TabsContent value="assigned">
					<AssignedReviews
						assignedReviews={assignedReviews}
						onViewDetails={handleViewReviews}
						onUpdate={fetchData}
					/>
				</TabsContent>
			</Tabs>

			<ViewReviewGradeDialog
				review={selectedReview}
				open={isDialogOpen}
				onClose={handleCloseDialog}
				onUpdate={fetchData}
			/>
		</div>
	);
};

export default Reviews;
