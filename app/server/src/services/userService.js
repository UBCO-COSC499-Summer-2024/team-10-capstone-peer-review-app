import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

const getAllUsers = async () => {
	try {
		// May eventually change to return specific fields
		const users = await prisma.user.findMany();
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
			include: { instructor: true } // Include any related data you need
		});

		return classes;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to retrieve user's classes", 500);
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
			throw new apiError("Failed to retrieve user's assignments", 500);
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
			throw new apiError("Failed to get groups in class", 500);
		}
	}
}

export default {
	getUsersByRole,
	getAllUsers,
	getUserClasses,
	getUserAssignments,
	getGroups
};
