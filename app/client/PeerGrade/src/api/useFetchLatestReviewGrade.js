import { useState, useEffect } from "react";
import reviewAPI from "@/api/reviewApi";

const useFetchLatestReviewGrade = (submissionId) => {
    const [latestReview, setLatestReview] = useState(null);

    useEffect(() => {
        const fetchLatestReview = async () => {
            try {
                const reviews = await reviewAPI.getAllReviews(submissionId);
                if (reviews.length > 0) {
                    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setLatestReview(sortedReviews[0]);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        if (submissionId) {
            fetchLatestReview();
        }
    }, [submissionId]);

    return latestReview;
};

export default useFetchLatestReviewGrade;