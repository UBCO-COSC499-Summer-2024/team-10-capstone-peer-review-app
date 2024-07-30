import commentService from "../services/commentService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

export const addComment = asyncErrorHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { content, studentId } = req.body;
  const userId = req.user.userId;

  if (!studentId) {
    return res.status(400).json({
      status: "Error",
      message: "studentId is required",
    });
  }

  const comment = await commentService.addCommentToAssignment(assignmentId, userId, content, studentId);

  return res.status(200).json({
    status: "Success",
    data: comment,
  });
});

export const getComments = asyncErrorHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const userId = req.user.userId;

  const comments = await commentService.getCommentsForAssignment(assignmentId, userId);

  return res.status(200).json({
    status: "Success",
    data: comments,
  });
});