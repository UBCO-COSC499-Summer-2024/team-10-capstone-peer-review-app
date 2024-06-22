import userService from "../services/userService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Get user classes
export const getUserClasses = asyncErrorHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const userClasses = await userService.getUserClasses(userId, role);
  return res.status(200).json({
    status: "Success",
    data: userClasses
  });
});

// Get user assignments
export const getUserAssignments = asyncErrorHandler(async (req, res) => {
  const { role, id: userId } = req.user;
  const userAssignments = await userService.getUserAssignments(userId, role);
  return res.status(200).json({
    status: "Success",
    data: userAssignments
  });
});

// Get user peer reviews
export const getUserPeerReviews = asyncErrorHandler(async (req, res) => {
  const { id: userId } = req.user;
  const userPeerReviews = await userService.getUserPeerReviews(userId);
  return res.status(200).json({
    status: "Success",
    data: userPeerReviews
  });
});

// Get user info
export const getUserInfo = asyncErrorHandler(async (req, res) => {
  const { id: userId } = req.user;
  const userInfo = await userService.getUserInfo(userId);
  return res.status(200).json({
    status: "Success",
    data: userInfo
  });
});

export default {
  getUserClasses,
  getUserAssignments,
  getUserPeerReviews,
  getUserInfo,
};
