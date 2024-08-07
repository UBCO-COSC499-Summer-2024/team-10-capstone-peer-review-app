// This is the page for viewing peer reviews. It displays a list of all reviews, allows the user to view the grades for each review, and displays the comments for each review.
// the reviews are divided into different tabs for different sections of the peer review process (Assigned/Received)

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import reviewAPI from "@/api/reviewApi";
import { useUser } from "@/contexts/contextHooks/useUser";
import ViewReviewGradeDialog from "@/components/review/ViewReviewGradeDialog";
import ReceivedReviews from "@/components/review/ReceivedReviews";
import AssignedReviews from "@/components/review/AssignedReviews";
import { Info } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Reviews = () => {
	const [assignedReviews, setAssignedReviews] = useState([]);
	const [receivedReviews, setReceivedReviews] = useState([]);
	const [view, setView] = useState("received");
	const [selectedReview, setSelectedReview] = useState(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showInfoOverlay, setShowInfoOverlay] = useState(false);
	const [infoStep, setInfoStep] = useState(1);
	const { user } = useUser();
	const navigate = useNavigate();

	// Fetch the data for the peer review page
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

	// Fetch the data when the user changes
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Handle viewing reviews in a dialog or in the main page
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

	console.log("selectedReview in Reviews", selectedReview);

	// Render the info dialog for the peer review page (infoButton guide content)
	const renderInfoDialog = () => {
		if (infoStep === 1) {
			return (
				<DialogContent className="z-50">
					<DialogHeader>
						<DialogTitle>About Reviews</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="mb-2">
							The Reviews page allows you to manage and view your peer reviews:
						</p>
						<ul className="list-disc list-inside mb-4">
							<li>Reviews Received: View feedback on your submissions</li>
							<li>
								Reviews Assigned: Complete reviews for other students' work
							</li>
						</ul>
						<p>Use the tabs at the top to switch between these two views.</p>
					</DialogDescription>
					<DialogFooter>
						<Button onClick={() => setInfoStep(2)}>Next</Button>
					</DialogFooter>
				</DialogContent>
			);
		} else if (infoStep === 2) {
			return (
				<DialogContent className="z-50">
					<DialogHeader>
						<DialogTitle>Using the Reviews Page</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						<p className="mb-2">
							Here's how to use the Reviews page effectively:
						</p>
						<ul className="list-disc list-inside mb-4">
							<li>Click on a review to view its details</li>
							<li>
								For assigned reviews, you can edit and submit your feedback
							</li>
							<li>
								For received reviews, you can see comments and grades from your
								peers
							</li>
							<li>
								Use the search and filter options to find specific reviews
							</li>
						</ul>
						<p>
							Remember to complete your assigned reviews before their due dates!
						</p>
					</DialogDescription>
					<DialogFooter>
						<Button
							onClick={() => {
								setShowInfoOverlay(false);
								setInfoStep(1);
							}}
						>
							Got it
						</Button>
					</DialogFooter>
				</DialogContent>
			);
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

			<Button
				className="fixed bottom-4 right-4 rounded-full w-10 h-10 p-0 z-50"
				onClick={() => setShowInfoOverlay(true)}
				data-testid="info-button"
			>
				<Info className="w-6 h-6" />
			</Button>

			<Dialog
				open={showInfoOverlay}
				onOpenChange={(open) => {
					setShowInfoOverlay(open);
					if (!open) setInfoStep(1);
				}}
			>
				{renderInfoDialog()}
			</Dialog>
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
