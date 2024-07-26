import express from "express";
import {  
    getAllCategoriesInClass,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAssignments,
    addAssignmentToCategory,
    deleteAssignmentFromCategory
} from "../controllers/categoryController.js";


const router = express.Router();
//Category Routes

/**
 * @route GET /category/
 * @desc Test the category route
 * @access Public
 */
router.get("/", (req, res) => {
  res.status(200).send("Category route is working!");
});

/**
 * @route GET /category/
 * @desc Get all categories
 * @access Public
 * @param {String} req.body.classId - The ID of the class
 * @returns {Array} - An array of all categories
 */
router.post("/allCategories", getAllCategoriesInClass);

/**
 * @route POST /category/createCategory
 * @desc Create a new category
 * @access Public
 * @param {Object} req.body  - The category data to be created only including classId and name
 * @returns {Object} - The created category
 */
router.post("/createCategory", createCategory);

/**
 * @route POST /category/updateCategory
 * @desc Update a category by ID
 * @access Public
 * @param {Object} req.body - The updated category data
 * @returns {Object} - The updated category
 */
router.post("/updateCategory", updateCategory);

/**
 * @route DELETE /category/deleteCategory
 * @desc Delete a category by ID
 * @access Public
 * @param {String} req.body.categoryId - The ID of the category to be deleted
 * @returns {String} - A success message indicating the category has been deleted
 */
router.delete("/deleteCategory", deleteCategory);

/**
 * @route GET /category/categoryAssignments
 * @desc Get assignments for a specific category
 * @access Public
 * @param {String} req.query.categoryId - The ID of the category
 * @returns {Array} - An array of assignments belonging to the category
 */
router.post("/categoryAssignments", getCategoryAssignments);

/**
 * @route POST /category/addAssignment
 * @desc Add an assignment to a category
 * @access Public
 * @param {Object} req.body - The assignment data to be added including categoryId and assignmentId
 * @returns {Object} - The updated category with the added assignment
 */
router.post("/addAssignment", addAssignmentToCategory);

/**
 * @route DELETE /category/deleteAssignment
 * @desc Delete an assignment from a category
 * @access Public
 * @param {Object} req.body - The assignment data to be deleted including categoryId and assignmentId
 * @returns {Object} - The updated category with the deleted assignment
 */
router.delete("/deleteAssignment", deleteAssignmentFromCategory);

export default router;