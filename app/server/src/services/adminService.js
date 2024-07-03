import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

// class operations

const getAdminByID = async (adminId) => {
	try {
        const user = await prisma.user.findUnique({
            where: {
                userId: adminId
            }
        });
		return user;
	} catch (error) {
		throw new apiError("Failed to retrieve admin's profiles", 500);
	}
};

const getAllUsers = async () => {
	try {
		const allUsers = await prisma.user.findMany({
			include: {
				classes: true,
				submissions: true,
				reviewsDone: true,
				reviewsReceived: true,
				classesInstructed: true,
				Rubric: true,
			}
		});
		return allUsers;
	} catch (error) {
		throw new apiError("Failed to retrieve all users", 500);
	}
};

const getAllClasses = async () => {
	try {
		const allClasses = await prisma.class.findMany({
			include: {
				groups: true,
				usersInClass: true,
				Assignments: true,
				instructor: true,
				EnrollRequest: true,
			}
		});
		return allClasses;
	} catch (error) {
		throw new apiError("Failed to retrieve all classes", 500);
	}
};

export default {
    getAdminByID,
    getAllUsers,
    getAllClasses
};
