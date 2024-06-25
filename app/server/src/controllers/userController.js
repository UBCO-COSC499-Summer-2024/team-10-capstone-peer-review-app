import { getUserClasses as getUserClassesService, getUserAssignments as getUserAssignmentsService } from "../services/userService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export async function getUserClasses(req, res, next) {
  try {
    console.log("getUserClasses endpoint hit");
    const userId = req.body.userId;
    const classes = await getUserClassesService(userId);
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
}

export async function getUserAssignments(req, res, next) {
  try {
    console.log("getUserAssignments endpoint hit");
    const userId = req.body.userId;
    console.log(userId);
    const assignments = await getUserAssignmentsService(userId);
    res.status(200).json(assignments);
  } catch (error) {
    next(error);
  }
}

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
  getUserClasses,
  getUserAssignments,
  // getUserPeerReviews,
  // getUserInfo,
};
