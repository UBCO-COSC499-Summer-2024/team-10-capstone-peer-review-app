import userService from "../services/userService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
	const users = await userService.getAllUsers();
	res.status(200).json({
		status: "Success",
		message: "All users fetched",
		data: users
	});
});

export const getUsersByRole = asyncErrorHandler(async (req, res, next) => {
	const role = req.params.role;
	const users = await userService.getUsersByRole(role);
	res.status(200).json({
		status: "Success",
		message: `Users with role ${role} fetched`,
		data: users
	});
});
// TODO -> Change these to get requests, ALSO, no need to send userId in body, can retrive it from req.user object that passport generates.
export const getUserClasses = asyncErrorHandler(async (req, res) => {
	console.log("getUserClasses endpoint hit");
	const userId = req.body.userId;
	const classes = await userService.getUserClassesService(userId);
	res.status(200).json(classes);
});

export const getUserAssignments = asyncErrorHandler(async (req, res) => {
	console.log("getUserAssignments endpoint hit");
	const userId = req.body.userId;
	const assignments = await userService.getUserAssignmentsService(userId);
	res.status(200).json(assignments);
});

export const getGroups = asyncErrorHandler(async (req, res) => {
	const userId = req.body.userId;
	const groupData = await userService.getGroupsService(userId);
	res.status(200).json({
		status: "Success",
		data: groupData
	});
});

// // Get user peer reviews
// export const getUserPeerReviews = asyncErrorHandler(async (req, res) => {
//   const { id: userId } = req.user;
//   const userPeerReviews = await userService.getUserPeerReviews(userId);
//   return res.status(200).json({
//     status: "Success",
//     data: userPeerReviews
//   });
// });

// // Get user info
// export const getUserInfo = asyncErrorHandler(async (req, res) => {
//   const { id: userId } = req.user;
//   const userInfo = await userService.getUserInfo(userId);
//   return res.status(200).json({
//     status: "Success",
//     data: userInfo
//   });
// });

export default {
	getAllUsers,
	getUsersByRole,
	getUserClasses,
	getUserAssignments,
	getGroups
	// getUserPeerReviews,
	// getUserInfo,
};
