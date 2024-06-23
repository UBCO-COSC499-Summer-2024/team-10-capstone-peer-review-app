// authService.test.js
import { mockDeep, mockReset } from 'jest-mock-extended';
import bcrypt from 'bcrypt';

import prisma from '../../prisma/prismaClient.js';
import apiError from '../../src/utils/apiError.js';
import authService from '../../src/services/authService.js';

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
});
