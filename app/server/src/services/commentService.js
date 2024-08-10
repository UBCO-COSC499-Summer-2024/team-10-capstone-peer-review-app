/**
 * @module commentService
 */

import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

/**
 * @desc Get or create a comment chain for a specific assignment and student.
 * @async
 * @param {number} assignmentId - The ID of the assignment.
 * @param {number} studentId - The ID of the student.
 * @returns {Promise<Object>} The comment chain object.
 */
const getOrCreateCommentChain = async (assignmentId, studentId) => {
  let commentChain = await prisma.commentChain.findUnique({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId,
      },
    },
  });

  if (!commentChain) {
    commentChain = await prisma.commentChain.create({
      data: {
        assignmentId,
        studentId,
      },
    });
  }

  return commentChain;
};

/**
 * @desc Add a comment to an assignment.
 * @async
 * @param {uuid} assignmentId - The ID of the assignment.
 * @param {uuid} userId - The ID of the user adding the comment.
 * @param {string} content - The content of the comment.
 * @param {uuid} studentId - The ID of the student.
 * @returns {Promise<Object>} The created comment object.
 * @throws {apiError} If there is an error adding the comment.
 */
const addCommentToAssignment = async (assignmentId, userId, content, studentId) => {
  try {
    const commentChain = await getOrCreateCommentChain(assignmentId, studentId);

    const comment = await prisma.comment.create({
      data: {
        content,
        commentChain: {
          connect: { commentChainId: commentChain.commentChainId }
        },
        user: {
          connect: { userId: userId }
        }
      },
      include: {
        user: {
          select: {
            userId: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });
    return comment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new apiError(`Failed to add comment: ${error.message}`, 500);
  }
};

/**
 * Get comments for an assignment.
 * @async
 * @param {number} assignmentId - The ID of the assignment.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} An array of comment objects.
 * @throws {apiError} If there is an error getting the comments.
 */
const getCommentsForAssignment = async (assignmentId, userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { role: true },
    });

    if (user.role === 'STUDENT') {
      const commentChain = await prisma.commentChain.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId,
            studentId: userId,
          },
        },
        include: {
          comments: {
            include: {
              user: {
                select: {
                  userId: true,
                  firstname: true,
                  lastname: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return commentChain ? commentChain.comments : [];
    } else {
      const commentChains = await prisma.commentChain.findMany({
        where: { assignmentId },
        include: {
          student: {
            select: {
              userId: true,
              firstname: true,
              lastname: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  userId: true,
                  firstname: true,
                  lastname: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return commentChains;
    }
  } catch (error) {
    throw new apiError(error.message, error.statusCode || 500);
  }
};

export default {
  addCommentToAssignment,
  getCommentsForAssignment,
};