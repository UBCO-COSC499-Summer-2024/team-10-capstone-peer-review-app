import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";
import pkg from "@prisma/client";
import {
	sendNotificationToRole,
	sendNotificationToUser
} from "./notifsService.js";

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
	  // Find the user along with their classes and extended due dates
	  const user = await prisma.user.findUnique({
		where: { userId },
		include: {
		  classes: true,
		  classesInstructed: true,
		  extendedDueDates: true
		}
	  });
  
	  if (!user) {
		throw new apiError(404, "User not found");
	  }
  
	  // Determine which classes to retrieve assignments for based on the user's role
	  let classIds;
	  if (user.role === "STUDENT") {
		classIds = user.classes.map(userClass => userClass.classId);
	  } else {
		classIds = user.classesInstructed.map(classInstructed => classInstructed.classId);
	  }
  
	  // Retrieve assignments based on class IDs
	  const assignments = await prisma.assignment.findMany({
		where: { classId: { in: classIds } },
		include: { classes: true } // Include related `classes` field
	  });
  
	  // If the user is a student, apply the extended due dates
	  if (user.role === "STUDENT") {
		// Map extended due dates to their corresponding assignment IDs
		const extendedDueDatesMap = user.extendedDueDates.reduce((map, extendedDueDate) => {
		  map[extendedDueDate.assignmentId] = extendedDueDate.newDueDate;
		  return map;
		}, {});
  
		// Override assignments' due dates if extended due dates exist
		assignments.forEach(assignment => {
		  if (extendedDueDatesMap[assignment.assignmentId]) {
			// If there's an extended due date, replace the original due date
			assignment.dueDate = extendedDueDatesMap[assignment.assignmentId];
		  }
		});
	  }
  
	  return assignments;
	} catch (error) {
	  if (error instanceof apiError) {
		throw error;
	  } else {
		throw error;
	  }
	}
};  

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

export async function getAllGroups() {
	try {
		const groupsInfo = await prisma.group.findMany();

		if (!groupsInfo) {
			throw new apiError("Groups not found", 404);
		}

		return groupsInfo;
	} catch (error) {
		if (error instanceof apiError) {
			throw error;
		} else {
			throw new apiError("Failed to get all groups", 500);
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

// Reports
export async function getAdminReports() {
	try {
		const reports = await prisma.report.findMany({
			where: {
				receiverRole: "ADMIN",
				receiverId: null
			},
			include: {
				sender: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});
		return reports;
	} catch (error) {
		throw new apiError("Failed to fetch admin reports", 500);
	}
}

export async function getInstructorReports(instructorId) {
	try {
		const reports = await prisma.report.findMany({
			where: {
				receiverRole: "INSTRUCTOR",
				receiverId: instructorId
			},
			include: {
				sender: true,
				receiver: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});
		return reports;
	} catch (error) {
		throw new apiError("Failed to fetch instructor reports", 500);
	}
}

export async function getSentReports(senderId) {
	try {
		const reports = await prisma.report.findMany({
			where: {
				senderId: senderId
			},
			include: {
				sender: true,
				receiver: true
			},
			orderBy: {
				createdAt: "desc"
			}
		});
		return reports;
	} catch (error) {
		throw new apiError("Failed to fetch sent reports", 500);
	}
}

export async function sendReportToInstructor(
	senderId,
	title,
	content,
	instructorId
) {
	try {
		const newReport = await prisma.report.create({
			data: {
				senderId,
				receiverRole: "INSTRUCTOR",
				receiverId: instructorId,
				title,
				content,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});

		const senderInfo = await prisma.user.findUnique({
			where: {
				userId: senderId
			}
		});
		await sendNotificationToUser(
			senderId,
			"Report",
			`You have a new report from user ${senderInfo.firstname} ${senderInfo.lastname}`,
			instructorId,
			"report"
		);
		return newReport;
	} catch (error) {
		console.log(error);
		throw new apiError("Failed to send report to instructor", 500);
	}
}

export async function sendReportToAdmin(senderId, title, content) {
	try {
		const newReport = await prisma.report.create({
			data: {
				senderId,
				receiverRole: "ADMIN",
				receiverId: null,
				title,
				content,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		});

		const senderInfo = await prisma.user.findUnique({
			where: {
				userId: senderId
			}
		});
		await sendNotificationToRole(
			senderId,
			"Report",
			`You have a new report from user ${senderInfo.firstname} ${senderInfo.lastname}`,
			"ADMIN",
			"report"
		);
		return newReport;
	} catch (error) {
		console.log(error);
		throw new apiError("Failed to send report to admin", 500);
	}
}

export async function resolveReport(reportId) {
	try {
		const updatedReport = await prisma.report.update({
			where: {
				reportId: reportId
			},
			data: {
				isResolved: true
			}
		});

		await sendNotificationToUser(
			null,
			"Report - Resolved",
			`Your report '${updatedReport.title}' has been marked as resolved.`,
			updatedReport.senderId,
			"report"
		);
		return updatedReport;
	} catch (error) {
		throw new apiError("Failed to mark report as resolved", 500);
	}
}

export async function unResolveReport(reportId) {
	try {
		const updatedReport = await prisma.report.update({
			where: {
				reportId: reportId
			},
			data: {
				isResolved: false
			}
		});

		await sendNotificationToUser(
			null,
			"Report - Not Resolved",
			`Your report '${updatedReport.title}' has been marked as not resolved.`,
			updatedReport.senderId,
			"report"
		);
		return updatedReport;
	} catch (error) {
		throw new apiError("Failed to mark report as not resolved", 500);
	}
}

export async function deleteReport(reportId) {
	try {
		const deletedReport = await prisma.report.delete({
			where: {
				reportId: reportId
			}
		});

		// await sendNotificationToUser(null, 'Report - Deleted', `Your report '${updatedReport.title}' has been deleted.`, updatedReport.senderId, "report");
		return deletedReport;
	} catch (error) {
		console.log(error);
		throw new apiError("Failed to delete report", 500);
	}
}

export default {
	getUsersByRole,
	getAllUsers,
	getUserClasses,
	getUserAssignments,
	getGroups,
	getAllGroups,
	updateProfile,
	getAdminReports,
	getInstructorReports,
	getSentReports,
	sendReportToInstructor,
	sendReportToAdmin,
	resolveReport,
	unResolveReport,
	deleteReport
};
