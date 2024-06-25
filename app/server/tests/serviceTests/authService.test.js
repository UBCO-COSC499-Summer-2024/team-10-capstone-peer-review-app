// authService.test.js
import { mockDeep, mockReset } from 'jest-mock-extended';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

import prisma from '../../prisma/prismaClient.js';
import apiError from '../../src/utils/apiError.js';
import sendEmail from '../../src/utils/mailer.js';
import authService from '../../src/services/authService.js';

// TODO convert to singleton file for reusablility 

// Mock prisma
jest.mock('../../prisma/prismaClient.js', () => ({
  user: mockDeep()
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

// Mock sendEmail
jest.mock('../../src/utils/mailer.js');

describe('authService', () => {
  beforeEach(() => {
    mockReset(prisma.user);
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      prisma.user.create.mockResolvedValue({ id: 1 });

      const userDetails = {
        email: 'test@example.com',
        password: 'password',
        firstname: 'Test',
        lastname: 'User',
        role: 'user'
      };

      const result = await authService.registerUser(userDetails);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', parseInt(process.env.SALT_ROUNDS, 10));
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstname: 'Test',
          lastname: 'User',
          role: 'user',
        },
      });
      expect(result).toEqual({ id: 1 });
    });

    it('should throw an error if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      const userDetails = {
        email: 'test@example.com',
        password: 'password',
        firstname: 'Test',
        lastname: 'User',
        role: 'user'
      };

      await expect(authService.registerUser(userDetails)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        isEmailVerified: true
      });
      bcrypt.compare.mockResolvedValue(true);

      const result = await authService.loginUser('test@example.com', 'password');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        isEmailVerified: true
      });
    });

    it('should throw an error if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const email = 'test@example.com';
      const password = 'password';

      await expect(authService.loginUser(email, password)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw an error if password does not match', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        isEmailVerified: true
      });
      bcrypt.compare.mockResolvedValue(false);

      const email = 'test@example.com';
      const password = 'password';

      await expect(authService.loginUser(email, password)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedpassword');
    });

    it('should throw an error if email is not verified', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        isEmailVerified: false
      });
      bcrypt.compare.mockResolvedValue(true);

      const email = 'test@example.com';
      const password = 'password';

      await expect(authService.loginUser(email, password)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedpassword');
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });
      jwt.sign.mockReturnValue('mockedtoken');
      sendEmail.mockResolvedValue();

      const email = 'test@example.com';

      await authService.sendVerificationEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(jwt.sign).toHaveBeenCalledWith({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
      expect(sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Email Verification',
        expect.any(String)  // Match the email content
      );
    });

    it('should throw an error if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const email = 'test@example.com';

      await expect(authService.sendVerificationEmail(email)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should reset the password', async () => {
      jwt.verify.mockReturnValue({ email: 'test@example.com' });
      prisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        password: 'oldhashedpassword'
      });
      bcrypt.hash.mockResolvedValue('newhashedpassword');
      bcrypt.compare.mockResolvedValue(false);
      prisma.user.update.mockResolvedValue();

      const token = 'validtoken';
      const newPassword = 'newpassword';

      await authService.resetPassword(token, newPassword);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, parseInt(process.env.SALT_ROUNDS, 10));
      expect(bcrypt.compare).toHaveBeenCalledWith(newPassword, 'oldhashedpassword');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { password: 'newhashedpassword' }
      });
    });

    it('should throw an error if the new password is the same as the old password', async () => {
      jwt.verify.mockReturnValue({ email: 'test@example.com' });
      prisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        password: 'oldhashedpassword'
      });
      bcrypt.hash.mockResolvedValue('newhashedpassword');
      bcrypt.compare.mockResolvedValue(true);

      const token = 'validtoken';
      const newPassword = 'oldpassword';

      await expect(authService.resetPassword(token, newPassword)).rejects.toThrow(apiError);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, parseInt(process.env.SALT_ROUNDS, 10));
      expect(bcrypt.compare).toHaveBeenCalledWith(newPassword, 'oldhashedpassword');
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('sendForgotPasswordEmail', () => {
    it('should send a forgot password email', async () => {
      prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });
      jwt.sign.mockReturnValue('mockedtoken');
      sendEmail.mockResolvedValue();

      const email = 'test@example.com';

      await authService.sendForgotPasswordEmail(email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(jwt.sign).toHaveBeenCalledWith({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
      expect(sendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Password Reset',
        expect.any(String)  // Match the email content
      );
    });

    it('should throw an error if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const email = 'test@example.com';

      await expect(authService.sendForgotPasswordEmail(email)).rejects.toThrow(apiError);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe('confirmEmail', () => {
    it('should confirm the email', async () => {
      jwt.verify.mockReturnValue({ email: 'test@example.com' });
      prisma.user.findUnique.mockResolvedValue({ email: 'test@example.com' });
      prisma.user.update.mockResolvedValue();

      const token = 'validtoken';

      await authService.confirmEmail(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { isEmailVerified: true }
      });
    });

    it('should throw an error if user is not found', async () => {
      jwt.verify.mockReturnValue({ email: 'test@example.com' });
      prisma.user.findUnique.mockResolvedValue(null);

      const token = 'validtoken';

      await expect(authService.confirmEmail(token)).rejects.toThrow(apiError);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});