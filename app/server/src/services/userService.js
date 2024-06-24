import prisma from "../../prisma/prismaClient.js";
import ApiError from "../utils/apiError.js";

export async function getUserClasses(userId) {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { userId: userId },
      include: {
        classes: true,           // Include user classes to get class IDs
        classesInstructed: true  // Include instructed classes to get class IDs
      }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    let classIds;
    if (user.role === 'STUDENT') {
      classIds = user.classes.map(userClass => userClass.classId);
    } else {
      classIds = user.classesInstructed.map(classInstructed => classInstructed.classId);
    }

    // Retrieve classes based on class IDs
    const classes = await prisma.class.findMany({
      where: { classId: { in: classIds } },
      include: { instructor: true } // Include any related data you need
    });

    return classes;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError("Failed to retrieve user's classes", 500);
    }
  }
}


export async function getUserAssignments(userId) {
  try {
    console.log(`Fetching assignments for user with ID: ${userId}`);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { userId: userId },
      include: {
        classes: true,
        classesInstructed: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    let classIds;
    if (user.role === 'STUDENT') {
      classIds = user.classes.map(userClass => userClass.classId);
    } else {
      classIds = user.classesInstructed.map(classInstructed => classInstructed.classId);
    }

    console.log(`Class IDs: ${classIds}`);

    // Retrieve assignments based on class IDs
    const assignments = await prisma.assignment.findMany({
      where: { classId: { in: classIds } },
      include: { classes: true } // Correctly include the related `classes` field
    });

    console.log(`Assignments: ${JSON.stringify(assignments)}`);

    return assignments;
  } catch (error) {
    console.error("Error in getUserAssignments:", error);
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError("Failed to retrieve user's assignments", 500);
    }
  }
}

export default {
  getUserClasses,
  getUserAssignments,
};