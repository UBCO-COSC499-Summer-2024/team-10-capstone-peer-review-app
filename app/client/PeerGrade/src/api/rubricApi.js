import axios from 'axios';
import showStatusToast from '@/utils/showToastStatus';

const BASE_URL = '/api';

export const addRubric = async (rubricData) => {
    try {
        const response = await axios.post(`${BASE_URL}/classes/add-rubrics`, rubricData);
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const addCriterion = async (rubricId, criterionData) => {
    try {
        const response = await axios.post(`${BASE_URL}/classes/add-criterion`, {
            rubricId,
            ...criterionData,
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const addCriterionRating = async (criterionId, ratingData) => {
    try {
        const response = await axios.post(`${BASE_URL}/classes/add-criterion-rating`, {
            criterionId,
            ...ratingData,
        });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const addExtensiveRubric = async (rubricData) => {
    try {
        // Add the rubric
        const rubric = await addRubric(rubricData);
        const rubricId = rubric.id;

        // Add criteria and their ratings
        for (const criterion of rubricData.criteria) {
            const addedCriterion = await addCriterion(rubricId, {
                criteria: criterion.criteria,
                points: criterion.points,
            });
            const criterionId = addedCriterion.id;

            for (const rating of criterion.ratings) {
                await addCriterionRating(criterionId, { rating });
            }
        }

        return rubric;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

const handleError = (error) => {
    if (error.response && error.response.data) {
        showStatusToast({
            status: error.response.data.status,
            message: error.response.data.message,
        });
    } else {
        showStatusToast({
            status: 'Error',
            message: 'An unexpected error occurred. Please try again.',
        });
    }
};
