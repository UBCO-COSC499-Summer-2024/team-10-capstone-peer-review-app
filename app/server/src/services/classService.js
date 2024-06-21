import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

const getClassById = async (classId) => {
	try {
		const classData = await prisma.class.findUnique({
			where: {
				classId: classId
			}
		});
		if (!classData) {
			throw new apiError("Class not found", 404);
		}
		return classData;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to retrieve class", 500);
		}
	}
};

const createClass = async ({
	instructorId,
	classname,
	description,
	startDate,
	endDate,
	term,
	classSize
}) => {
	try {
		const newClass = await prisma.class.create({
			data: {
				classname,
				description,
				startDate,
				endDate,
				term,
				classSize,
				instructorId
			}
		});
		return newClass;
	} catch (error) {
		throw new apiError("Failed to create class", 500);
	}
};

const updateClass = async (classId, updateData) => {
	try {
		const updatedClass = await prisma.class.update({
			where: {
				classId: classId
			},
			data: updateData
		});
		return updatedClass;
	} catch (error) {
		throw new apiError("Failed to update class", 500);
	}
};

const deleteClass = async (classId) => {
	try {
		await prisma.class.delete({
			where: {
				classId: classId
			}
		});
	} catch (error) {
		throw new apiError("Failed to delete class", 500);
	}
};
// Refactoring to use student email instead.
const addStudentToClass = async (classId, studentId) => {
	try {
		const classInfo = await prisma.class.findUnique({
			where: {
				classId: classId
			},
			include: {
				usersInClass: true
			}
		});

		if (!classInfo) {
			throw new apiError("Class not found", 404);
		}

		const userInfo = await prisma.user.findUnique({
			where: {
				userId: studentId
			}
		});

		if (!userInfo) {
			throw new apiError("User not found", 404);
		}

		// Check if adding a new student exceeds the class size
		if (
			classInfo.students &&
			classInfo.students.length >= classInfo.classSize
		) {
			throw new apiError("Adding student exceeds class size", 400);
		}

		// Proceed to add the student if class size is not exceeded
		await prisma.userInClass.create({
			data: {
				userId: userId,
				classId: classId
			}
		});

		return updatedClass;
	} catch (error) {
		// Rethrow the error if it's an instance of apiError, else throw general apiError
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to add student to class", 500);
		}
	}
};

const removeStudentFromClass = async (classId, studentId) => {
	try {
		const userInClass = await prisma.userInClass.findUnique({
			where: {
				UserInClassId: {
					userId: studentId,
					classId: classId
				}
			}
		});

		// Step 3: Check if the record exists
		if (!userInClass) {
			throw new Error("Student is not enrolled in this class.");
		}

		// Step 4: Delete the record
		await prisma.userInClass.delete({
			where: {
				UserInClassId: {
					userId: studentId,
					classId: classId
				}
			}
		});
		if (!userInClass) {
			throw new Error("Student is not enrolled in this class.");
		}
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to remove student from class", 500);
		}
	}
};

export {
	getClassById,
	createClass,
	updateClass,
	deleteClass,
	addStudentToClass,
	removeStudentFromClass
};
