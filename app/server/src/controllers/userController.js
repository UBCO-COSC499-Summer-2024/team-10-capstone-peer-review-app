import userService from "../services/userService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Get user classes
export const getUserClasses = asyncErrorHandler(async (req, res) => {
  const userClasses = await userService.getUserClasses(req.user.id);
  return res.status(200).json({
    status: "Success",
    data: userClasses
  });
});

// Get user assignments
export const getUserAssignments = asyncErrorHandler(async (req, res) => {
  const userAssignments = await userService.getUserAssignments(req.user.id);
  return res.status(200).json({
    status: "Success",
    data: userAssignments
  });
});

// Get user peer reviews
export const getUserPeerReviews = asyncErrorHandler(async (req, res) => {
  const userPeerReviews = await userService.getUserPeerReviews(req.user.id);
  return res.status(200).json({
    status: "Success",
    data: userPeerReviews
  });
});

// Get user info
export const getUserInfo = asyncErrorHandler(async (req, res) => {
  const userInfo = await userService.getUserInfo(req.user.id);
  return res.status(200).json({
    status: "Success",
    data: userInfo
  });
});