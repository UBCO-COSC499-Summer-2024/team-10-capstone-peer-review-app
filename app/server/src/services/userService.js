import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import pkg from "@prisma/client";

const { PrismaClientKnownRequestError } = pkg;

const getAllUsers = async () => {
	try {
		// May eventually change to return specific fields
		const users = await prisma.user.findMany({
			include: {
				classes: true,
				classesInstructed: true,
				groups: true
			}
		});
		return users;
	} catch (error) {
		throw new apiError("Failed to get all users", 500);
	}
};

const getUsersByRole = async (role) => {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: role
			}
		});
		return users;
	} catch (error) {
		throw new apiError(`Failed to get users with role ${role}`, 500);
	}
};

export async function getUserClasses(userId) {
	try {
		// Find the user
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			include: {
				classes: true, // Include user classes to get class IDs
				classesInstructed: true // Include instructed classes to get class IDs
			}
		});

		if (!user) {
			throw new apiError(404, "User not found");
		}

		let classIds;
		if (user.role === "STUDENT") {
			classIds = user.classes.map((userClass) => userClass.classId);
		} else {
			classIds = user.classesInstructed.map(
				(classInstructed) => classInstructed.classId
			);
		}

		// Retrieve classes based on class IDs
		const classes = await prisma.class.findMany({
			where: { classId: { in: classIds } },
			include: {
				instructor: {
					select: {
						userId: true,
						email: true,
						firstname: true,
						lastname: true,
						classesInstructed: true
					}
				},
				_count: {
					select: {
						Assignments: true,
						usersInClass: true
					}
				}
			}
		});

		// Map the classes to include the assignment & user counts directly in the class object
		const classesWithCounts = classes.map((classItem) => ({
			...classItem,
			assignmentCount: classItem._count.Assignments,
			userCount: classItem._count.usersInClass,
			_count: undefined // Remove the _count property
		}));

		return classesWithCounts;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			console.log(error);
			throw error;
		}
	}
}

export async function getUserAssignments(userId) {
	try {
		// Find the user
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			include: {
				classes: true,
				classesInstructed: true
			}
		});

		if (!user) {
			throw new apiError(404, "User not found");
		}

		let classIds;
		if (user.role === "STUDENT") {
			classIds = user.classes.map((userClass) => userClass.classId);
		} else {
			classIds = user.classesInstructed.map(
				(classInstructed) => classInstructed.classId
			);
		}

		// Retrieve assignments based on class IDs
		const assignments = await prisma.assignment.findMany({
			where: { classId: { in: classIds } },
			include: { classes: true } // Correctly include the related `classes` field
		});

		return assignments;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

export async function getGroups(userId) {
	try {
		const groups = await prisma.group.findMany({
			include: {
				students: true
			},
			where: {
				students: {
					some: {
						userId: userId
					}
				}
			}
		});
		return groups;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw error;
		}
	}
}

export async function updateProfile(userId, updateData) {
	try {
		const updatedProfile = await prisma.user.update({
			where: {
				userId: userId
			},
			data: {
				...updateData,
				updatedAt: new Date()
			}
		});
		return updatedProfile;
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (
				error.code === "P2002" &&
				error.meta &&
				error.meta.target &&
				error.meta.target.includes("email")
			) {
				throw new apiError("Email already exists", 400);
			} else {
				throw error;
			}
		} else if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to update profile", 500);
		}
	}
}

export default {
	getUsersByRole,
	getAllUsers,
	getUserClasses,
	getUserAssignments,
	getGroups,
	updateProfile
};
