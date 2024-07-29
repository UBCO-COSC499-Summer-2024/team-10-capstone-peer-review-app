import prisma from "../../prisma/prismaClient.js";
import apiError from "../utils/apiError.js";

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