import prisma from '../prisma/client.js';
import ApiError from '../utils/ApiError.js';

// Get user classes
export const getUserClasses = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
    where: { id: userId },
    include: { assignments: true }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.assignments;
};

// Get user peer reviews
export const getUserPeerReviews = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { peerReviews: true }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.peerReviews;
};

// Get user info
export const getUserInfo = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};