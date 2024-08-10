/**
 * Controller methods for comment operations.
 * @module commentController
 */
import commentService from "../services/commentService.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

/**
 * @async
 * @desc It extracts the assignmentId, content, studentId, and userId from the request object. If the studentId is missing, it sends a 400 error response. Otherwise, it calls the commentService to add the comment to the assignment and sends a success response with the added comment.
 * @function addCommentToAssignment
 * @param {Object} req - The request object containing the assignmentId from the parameters, content and studentId in the body, and userID if the user is still logged in.
 * @returns {Object} The response object with a success status and the added comment.
 */
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

/**
 * @async
 * @desc It extracts the assignmentId and userId from the request object. It calls the commentService to get the comments for the assignment and sends a success response with the comments.
 * @function getCommentsForAssignment
 * @param {Object} req - The request object containing the assignmentId from the parameters and the userID if the user is still logged in.
 * @returns {Object} The response object with a success status and the comments.
 */
export const getComments = asyncErrorHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const userId = req.user.userId;

  const comments = await commentService.getCommentsForAssignment(assignmentId, userId);

  return res.status(200).json({
    status: "Success",
    data: comments,
  });
});