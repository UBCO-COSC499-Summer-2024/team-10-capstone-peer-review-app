/**
 * Controller methods for category operations.
 * @module categoryController
 */
import categoryService from "../services/categoryService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @desc Retrieves all categories in a class.
 * @function getAllCategories
 * @param {Object} req - The request object contains the classId in the body.
 * @returns {Object} - The response object with the retrieved categories.
 */
export const getAllCategoriesInClass = asyncErrorHandler(async (req, res) => {
    const { classId } = req.body;
    const categories = await categoryService.getAllCategories(classId);
    return res.status(200).json({
        status: "Success",
        message: "Retrieved all categories in class",
        data: categories
    });
});

/**
 * @async
 * @desc Creates a new category in a class.
 * @function createCategory
 * @param {Object} req - The request object having classId and name in the body.
 * @returns {Object} - The response object with the newly created category.
 */
export const createCategory = asyncErrorHandler(async (req, res) => {
    const { classId, name } = req.body;
    const newCategory = await categoryService.createCategory(classId, name);
    return res.status(201).json({
        status: "Success",
        message: "Category created",
        data: newCategory
    });
});

/**
 * @async
 * @desc Updates a category in a class.
 * @function updateCategory
 * @param {Object} req - The request object having categoryId and name in the body.
 * @returns {Object} - The response object with the updated category.
 */
export const updateCategory = asyncErrorHandler(async (req, res) => {
    const { categoryId, name } = req.body;
    const updatedCategory = await categoryService.updateCategory(categoryId, name);
    return res.status(200).json({
        status: "Success",
        message: "Category updated",
        data: updatedCategory
    });
});

/**
 * @async
 * @desc Deletes a category from a class.
 * @function deleteCategory
 * @param {Object} req - The request object having categoryId in the body.
 * @returns {Object} - The response object indicating the success of the deletion.
 */
export const deleteCategory = asyncErrorHandler(async (req, res) => {
    const categoryId = req.body.categoryId;
    await categoryService.deleteCategory(categoryId);
    return res.status(200).json({
        status: "Success",
        message: "Category deleted"
    });
});

/**
 * @async
 * @desc Retrieves all assignments in a category.
 * @function getCategoryAssignments
 * @param {Object} req - The request object having categoryId  in the body.
 * @returns {Object} - The response object with the retrieved assignments.
 */
export const getCategoryAssignments = asyncErrorHandler(async (req, res) => {
    const categoryId = req.body.categoryId;
    const assignments = await categoryService.getCategoryAssignments(categoryId);
    return res.status(200).json({
        status: "Success",
        message: "Retrieved category assignments",
        data: assignments
    });
});

/**
 * @async
 * @desc Adds an assignment to a category.
 * @function addAssignmentToCategory
 * @param {Object} req - The request object having categoryId and assignmentId in the body.
 * @returns {Object} - The response object with the updated category.
 */
export const addAssignmentToCategory = asyncErrorHandler(async (req, res) => {
    const { categoryId, assignmentId } = req.body;
    const updatedCategory = await categoryService.addAssignmentToCategory(categoryId, assignmentId);
    return res.status(200).json({
        status: "Success",
        message: "Assignment added to category",
        data: updatedCategory
    });
});

/**
 * @async
 * @desc Deletes an assignment from a category.
 * @function deleteAssignmentFromCategory
 * @param {Object} req - The request object having categoryId and assignmentId in the body.
 * @returns {Object} - The response object with the updated category.
 */
export const deleteAssignmentFromCategory = asyncErrorHandler(async (req, res) => {
    const { categoryId, assignmentId } = req.body;
    const updatedCategory = await categoryService.deleteAssignmentFromCategory(categoryId, assignmentId);
    return res.status(200).json({
        status: "Success",
        message: "Assignment deleted from category",
        data: updatedCategory
    });
});

export default {
    getAllCategoriesInClass,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAssignments,
    addAssignmentToCategory,
    deleteAssignmentFromCategory 
};