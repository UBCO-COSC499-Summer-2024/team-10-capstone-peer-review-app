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

export const addCriterionGrade = async (criterionId, gradeData) => {
    try {
        const response = await axios.post(`${BASE_URL}/classes/give-criterion-grade`, {
            criterionId,
            ...gradeData,
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
                minPoints: criterion.minPoints,
                maxPoints: criterion.maxPoints,
            });
            const criterionId = addedCriterion.id;

            // Add ratings for the criterion
            for (const rating of criterion.ratings) {
                await addCriterionRating(criterionId, { rating });
            }

            // Add the min and max points for the criterion as criterion grades
            await addCriterionGrade(criterionId, {
                minPoints: criterion.minPoints,
                maxPoints: criterion.maxPoints,
            });
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
