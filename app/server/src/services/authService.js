import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(userDetails) {
  const { email, password, firstname, lastname, role } = userDetails;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User with that email already exists');
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = {
    email,
    password: hashedPassword,
    firstname,
    lastname,
    role
  };
  return await prisma.user.create({ data: user });
}

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('No user with that email');
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }
  if (!user.isEmailVerified) {
    throw new Error('Please verify your email before logging in');
  }
  return user;
}

async function verifyEmail(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { email: decoded.email } });
  if (!user) {
    throw new Error('No user with that email');
  }
  return await prisma.user.update({
    where: { email: decoded.email },
    data: { isVerified: true }
  });
}

async function resetPassword(token, newPassword) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return await prisma.user.update({
    where: { email: decoded.email },
    data: { password: hashedPassword }
  });
}

export default {
  registerUser,
  loginUser,
  verifyEmail,
  resetPassword
};