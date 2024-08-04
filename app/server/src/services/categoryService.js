/**
 * @module categoryService
 * @desc Service methods for category operations
 */

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @desc Get all categories in a class
 * @async
 * @param {Number} classId - The ID of the class
 * @returns {Array} - An array of categories
 * @throws {apiError} - If the class is not found or there is an error retrieving the categories
 */
const getAllCategories = async (classId) => {
	try {
		const classA = await prisma.class.findUnique({
			where: {
				classId: classId
			}
		});

		// check if class exists
		if (!classA) {
			throw new apiError(`Class not found`, 404);
		}

		const categories = await prisma.category.findMany({
			where: {
				classId: classId
			},
			include: {
				assignments: true
			}
		});

		return categories;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to get categories" + error, 500);
	}
};

/**
 * @desc Create a new category
 * @async
 * @param {Number} classId - The ID of the class
 * @param {String} name - The name of the category
 * @returns {Object} - The newly created category
 * @throws {apiError} - If a category with the same name already exists, the class is not found, or there is an error creating the category
 */
const createCategory = async (classId, name) => {
	try {
		const categories = await prisma.category.findMany({
			where: {
				name: name
			}
		});

		// check if category with the same name already exists
		if (categories.length > 0) {
			throw new apiError(`Category with name ${name} already exists`, 400);
		}

		const classA = await prisma.class.findUnique({
			where: {
				classId: classId
			}
		});

		// check if class exists
		if (!classA) {
			throw new apiError(`Class not found`, 404);
		}

		return await prisma.category.create({
			data: {
				classId: classId,
				name: name
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to create category", 500);
	}
};

/**
 * @desc Update a category by ID
 * @async
 * @param {Number} categoryId - The ID of the category
 * @param {String} name - The new name of the category
 * @returns {Object} - The updated category
 * @throws {apiError} - If the category is not found, a category with the same name already exists, or there is an error updating the category
 */
const updateCategory = async (categoryId, name) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				categoryId: categoryId
			}
		});

		// check if category exists
		if (!category) {
			throw new apiError(`Category not found`, 404);
		}

		const categories = await prisma.category.findMany({
			where: {
				name: name
			}
		});

		// check if category with the same name already exists
		if (categories.length > 0) {
			throw new apiError(`Category with name ${name} already exists`, 400);
		}

		const updatedCategory = await prisma.category.update({
			where: {
				categoryId: categoryId
			},
			data: {
				name: name
			}
		});

		return updatedCategory;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to update category", 500);
	}
};

/**
 * @desc Delete a category by ID
 * @async
 * @param {Number} categoryId - The ID of the category
 * @returns {String} - A message indicating that the category has been deleted
 * @throws {apiError} - If the category is not found, the category has assignments, or there is an error deleting the category
 */
const deleteCategory = async (categoryId) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				categoryId: categoryId
			}
		});

		// check if category exists
		if (!category) {
			throw new apiError(`Category not found`, 404);
		}

		const categoryAssignments = await prisma.assignment.updateMany({
			where: {
				categoryId: categoryId
			},
			data: {
				categoryId: null
			}
		});

		// check if category has assignments
		if (categoryAssignments.length > 0) {
			throw new apiError(`Category has assignments, cannot delete`, 400);
		}

		return await prisma.category.delete({
			where: {
				categoryId: categoryId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to delete category" + error, 500);
	}
};

/**
 * @desc Get assignments for a specific category
 * @async
 * @param {Number} categoryId - The ID of the category
 * @returns {Array} - An array of assignments
 * @throws {apiError} - If there is an error retrieving the category assignments
 */
const getCategoryAssignments = async (categoryId) => {
	try {
		return await prisma.assignment.findMany({
			where: {
				categoryId: categoryId
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to get category assignments", 500);
	}
};

/**
 * @desc Add an assignment to a category
 * @async
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns {Object} - The updated category
 * @throws {apiError} - If the category or assignment is not found, the assignment already exists in the category, the assignment doesn't belong to the same class as the category, or there is an error adding the assignment to the category
 */
const addAssignmentToCategory = async (categoryId, assignmentId) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				categoryId: categoryId
			}
		});

		// check if category exists
		if (!category) {
			throw new apiError(`Category not found`, 404);
		}

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		// check if assignment exists
		if (!assignment) {
			throw new apiError(`Assignment not found`, 404);
		}

		const categoryAssignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId,
				categoryId: categoryId
			}
		});

		// check if assignment already exists in category
		if (categoryAssignment) {
			throw new apiError(`Assignment already exists in category`, 400);
		}

		// check if assignment belongs to the same class as category
		if (category.classId !== assignment.classId) {
			throw new apiError(
				`Assignment doesn't belong to the same class as category`,
				400
			);
		}

		return await prisma.category.update({
			where: {
				categoryId: categoryId
			},
			data: {
				assignments: {
					connect: {
						assignmentId: assignmentId
					}
				}
			}
		});
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError("Failed to add assignment to category", 500);
	}
};

/**
 * @desc Delete an assignment from a category
 * @async
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns {Object} - The updated category
 * @throws {apiError} - If the category or assignment is not found, the assignment doesn't exist in the category, the assignment doesn't belong to the same class as the category, or there is an error deleting the assignment from the category
 */
const deleteAssignmentFromCategory = async (categoryId, assignmentId) => {
	try {
		const category = await prisma.category.findUnique({
			where: {
				categoryId: categoryId
			}
		});

		// check if category exists
		if (!category) {
			throw new apiError(`Category not found`, 404);
		}

		const assignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId
			}
		});

		// check if assignment exists
		if (!assignment) {
			throw new apiError(`Assignment with not found`, 404);
		}

		const categoryAssignment = await prisma.assignment.findUnique({
			where: {
				assignmentId: assignmentId,
				categoryId: categoryId
			}
		});

		// check if the category has the assignment
		if (!categoryAssignment) {
			throw new apiError(`Assignment doesn't exists in category`, 400);
		}

		// check if the category and assignment class is the same
		if (category.classId !== assignment.classId) {
			throw new apiError(
				`Assignment doesn't belong to the same class as category`,
				400
			);
		}

		const updatedCategory = await prisma.category.update({
			where: {
				categoryId: categoryId
			},
			data: {
				assignments: {
					disconnect: {
						assignmentId: assignmentId
					}
				}
			}
		});

		return updatedCategory;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		}
		throw new apiError(
			"Failed to delete assignment from category" + error,
			500
		);
	}
};

export default {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
	getCategoryAssignments,
	addAssignmentToCategory,
	deleteAssignmentFromCategory
};
