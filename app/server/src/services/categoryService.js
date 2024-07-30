import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";



// Service methods for category operations

/**
 * Get all categories in a class
 * @returns categories
 */
const getAllCategories = async (classId) => {
    try {
        const classA = await prisma.class.findUnique({
            where: {
                classId: classId,
            },
        });

        if (!classA) {
            throw new apiError(`Class not found`, 404);
        }

        const categories = await prisma.category.findMany({
            where: {
                classId: classId,
            }, include: {
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
 * Create a new category
 * @param {String} name - The name of the category
 * @returns new category
 */
const createCategory = async (classId, name) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                name: name,
            },
        });

        if (categories.length > 0) {
            throw new apiError(`Category with name ${name} already exists`, 400);
        }

        const classA = await prisma.class.findUnique({
            where: {
                classId: classId,
            },
        });

        if (!classA) {
            throw new apiError(`Class not found`, 404);
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
        throw new apiError("Failed to create category", 500);
    }
};

/**
 * Update a category by ID
 * @param {Number} categoryId - The ID of the category
 * @param {String} name - The new name of the category
 * @returns updated category
 */
const updateCategory = async (categoryId, name) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId,
            },
        });

        if (!category) {
            throw new apiError(`Category not found`, 404);
        }

        const categories = await prisma.category.findMany({
            where: {
                name: name,
            },
        });

        if (categories.length > 0) {
            throw new apiError(`Category with name ${name} already exists`, 400);
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
        throw new apiError("Failed to update category", 500);
    }
};

/**
 * Delete a category by ID
 * @param {Number} categoryId - The ID of the category
 * @returns message indicating the category has been deleted
 */
const deleteCategory = async (categoryId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId,
            },
        });

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

        if (categoryAssignments.length > 0) {
            throw new apiError(`Category has assignments, cannot delete`, 400);
        }

        return await prisma.category.delete({
            where: {
                categoryId: categoryId,
            },
        });
    } catch (error) {
        if (error instanceof apiError) {
            console.log(error);
            throw error;
        }
        console.log(error);
        throw new apiError("Failed to delete category" + error, 500);
    }
};

/**
 * Get assignments for a specific category
 * @param {Number} categoryId - The ID of the category
 * @returns assignments
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
        throw new apiError("Failed to get category assignments", 500);
    }
};

/**
 * Add an assignment to a category
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns updated category
 */
const addAssignmentToCategory = async (categoryId, assignmentId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId,
            },
        });

        if (!category) {
            throw new apiError(`Category not found`, 404);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
            },
        });

        if (!assignment) {
            throw new apiError(`Assignment not found`, 404);
        }

        const categoryAssignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
                categoryId: categoryId
            }
        });

        if (categoryAssignment) {
            throw new apiError(`Assignment already exists in category`, 400);
        }

        if (category.classId !== assignment.classId) {
            throw new apiError(`Assignment doesn't belong to the same class as category`, 400);
        }

        return await prisma.category.update({
            where: {
                categoryId: categoryId,
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
        throw new apiError("Failed to add assignment to category", 500);
    }
};

/**
 * Delete an assignment from a category
 * @param {Number} categoryId - The ID of the category
 * @param {Number} assignmentId - The ID of the assignment
 * @returns updated category
 */
const deleteAssignmentFromCategory = async (categoryId, assignmentId) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                categoryId: categoryId,
            },
        });

        if (!category) {
            throw new apiError(`Category not found`, 404);
        }

        const assignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
            },
        });

        if (!assignment) {
            throw new apiError(`Assignment with not found`, 404);
        }

        const categoryAssignment = await prisma.assignment.findUnique({
            where: {
                assignmentId: assignmentId,
                categoryId: categoryId
            }
        });

        if (!categoryAssignment) {
            throw new apiError(`Assignment doesn't exists in category`, 400);
        }

        if (category.classId !== assignment.classId) {
            throw new apiError(`Assignment doesn't belong to the same class as category`, 400);
        }

        const updatedCategory = await prisma.category.update({
            where: {
                categoryId: categoryId,
            },
            data: {
                assignments: {
                    disconnect: {
                        assignmentId: assignmentId,
                    },
                },
            },
        });

        return updatedCategory;
    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError("Failed to delete assignment from category" + error, 500);
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