import prisma from '../prisma/client.js';
import ApiError from '../utils/apiError.js';

// Get user classes based on role
export const getUserClasses = async (userId, role) => {
  if (role === 'STUDENT') {
    const userClasses = await prisma.userInClass.findMany({
      where: { userId },
      include: {
        class: true,
      },
    });
    return userClasses.map(userClass => userClass.class);
  } else if (role === 'INSTRUCTOR') {
    const instructorClasses = await prisma.class.findMany({
      where: { instructorId: userId },
    });
    return instructorClasses;
  } else {
    throw new ApiError(403, 'Invalid role');
  }
};

// Get user assignments based on role
export const getUserAssignments = async (userId, role) => {
  if (role === 'STUDENT') {
    const userAssignments = await prisma.assignment.findMany({
      where: {
        class: {
          usersInClass: {
            some: {
              userId,
            },
          },
        },
      },
    });
    return userAssignments;
  } else if (role === 'INSTRUCTOR') {
    const instructorAssignments = await prisma.assignment.findMany({
      where: {
        class: {
          instructorId: userId,
        },
      },
    });
    return instructorAssignments;
  } else {
    throw new ApiError(403, 'Invalid role');
  }
};

// Get user peer reviews
export const getUserPeerReviews = async (userId) => {
  const userPeerReviews = await prisma.review.findMany({
    where: {
      OR: [
        { reviewerId: userId },
        { revieweeId: userId },
      ],
    },
  });

  return userPeerReviews;
};

// Get user info
export const getUserInfo = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export default {
  getUserClasses,
  getUserAssignments,
  getUserPeerReviews,
  getUserInfo,
};
