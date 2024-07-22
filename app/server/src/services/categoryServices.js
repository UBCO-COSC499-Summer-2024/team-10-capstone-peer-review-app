import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";


// Service methods for category operations

/**
 * Get all categories
 * @returns {Promise} Promise representing the categories
 */
const getAllCategories = async (classId) => {
    try {
        const classA = await prisma.class.findUnique({
            where: {
                id: classId,
            },
        });

        if (!classA) {
            throw new apiError(404, `Class not found`);
        }

        const categories = await prisma.category.findMany({
            where: {
                classId: classId,
            },
        });

        return categories;
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to get categories");
    }
};

/**
 * Create a new category
 * @param {String} name - The name of the category
 * @returns {Promise} Promise representing the new category
 */
const createCategory = async (classId, name) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                name: name,
            },
        });

        if (categories.length > 0) {
            throw new apiError(400, `Category with name ${name} already exists`);
        }

        const classA = await prisma.class.findUnique({
            where: {
                id: classId,
            },
        });

        if (!classA) {
            throw new apiError(404, `Class not found`);
        }

        return await prisma.category.create({
            data: {
                classId: classId,
                name: name,
            },
        });
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to create category");
    }
};

/**
 * Update a category by ID
 * @param {Number} categoryId - The ID of the category
 * @param {String} name - The new name of the category
 * @returns {Promise} Promise representing the updated category
 */
const updateCategory = async (categoryId, name) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            throw new apiError(404, `Category not found`);
        }

        const categories = await prisma.category.findMany({
            where: {
                name: name,
            },
        });

        if (categories.length > 0) {
            throw new apiError(400, `Category with name ${name} already exists`);
        }

        const updatedCategory = await prisma.category.update({
            where: {
                categoryId: categoryId,
            },
            data: {
                name: name,
            },
        });

        return updatedCategory;
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to update category");
    }
};

/**
 * Delete a category by ID
 * @param {Number} categoryId - The ID of the category
 * @returns {Promise} Promise representing the deleted category
 */
const deleteCategory = async (categoryId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId,
            },
        });

        if (!category) {
            throw new apiError(404, `Category not found`);
        }

        const categoryAssignments = await prisma.category.update({
			where: {
				categoryId: categoryId
			},
			data: {
				assignments: {
					disconnect: [
                        { 
                            categoryId: categoryId 
                        }
                    ]
				}
			}
		});

        if (categoryAssignments.assignments.length > 0) {
            throw new apiError(400, `Category has assignments, cannot delete`);
        }

        return await prisma.category.delete({
            where: {
                id: categoryId,
            },
        });
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to delete category");
    }
};

/**
 * Get assignments for a specific category
 * @param {Number} categoryId - The ID of the category
 * @returns {Promise} Promise representing the assignments
 */
const getCategoryAssignments = async (categoryId) => {
    try {
        return await prisma.assignment.findMany({
            where: {
                categoryId: categoryId,
            },
        });
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to get category assignments");
    }
};

/**
 * Add an assignment to a category
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns {Promise} Promise representing the updated category
 */
const addAssignmentToCategory = async (categoryId, assignmentId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            throw new apiError(404, `Category not found`);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
            },
        });

        if (!assignment) {
            throw new apiError(404, `Assignment not found`);
        }

        const categoryAssignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
                categoryId: categoryId
            }
        });

        if (categoryAssignment) {
            throw new apiError(400, `Assignment already exists in category`);
        }

        return await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                assignments: {
                    connect: {
                        assignmentId: assignmentId,
                    },
                },
            },
        });
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to add assignment to category");
    }
};

/**
 * Delete an assignment from a category
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns {Promise} Promise representing the updated category
 */
const deleteAssignmentFromCategory = async (categoryId, assignmentId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            throw new apiError(404, `Category not found`);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                id: assignmentId,
            },
        });

        if (!assignment) {
            throw new apiError(404, `Assignment with not found`);
        }

        const categoryAssignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
                categoryId: categoryId
            }
        });

        if (!categoryAssignment) {
            throw new apiError(400, `Assignment doesn't exists in category`);
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                assignments: {
                    disconnect: {
                        id: assignmentId,
                    },
                },
            },
        });

        return updatedCategory;
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Failed to delete assignment from category");
    }
};

export default {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAssignments,
    addAssignmentToCategory,
    deleteAssignmentFromCategory,
};
