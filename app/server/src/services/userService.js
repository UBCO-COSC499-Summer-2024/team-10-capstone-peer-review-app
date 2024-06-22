import prisma from "../prisma/client.js";
import ApiError from "../utils/apiError.js";

// Get user classes
export const getUserClasses = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    include: { classes: true }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.classes;
};

// Get user assignments
export const getUserAssignments = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    include: { submissions: { include: { assignment: true } } }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.submissions.map(submission => submission.assignment);
};

// Get user reviews
export const getUserReviews = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    include: { reviewsDone: { include: { submission: true } } }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.reviewsDone.map(review => review.submission.assignment);
};

// Get user info
export const getUserInfo = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};
