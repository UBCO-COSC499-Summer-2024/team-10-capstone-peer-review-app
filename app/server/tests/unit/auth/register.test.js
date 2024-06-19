import request from 'supertest';
import app from '../../../src/index.js'; 
import bcrypt from 'bcrypt';

import prisma from '../../../src/prisma.js';

describe('Register route', () => {
    test('should respond with a 200 for valid registration', async () => {
        // Create a new user object
        const newUser = {
            email: 'testEmail@example.com',
            password: 'testPassword',
            firstname: 'Test',
            lastname: 'User',
            role: 'STUDENT'
        }; 
        // Hit resgister endpoint with new user object
        const response = await request(app)
            .post('/auth/register')
            .send(newUser)
        // Check if response is 200 and has the correct message
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Account successfully created!");
        // Check if the user is saved in the database
        const registeredUser = await prisma.user.findUnique({ where: { email: newUser.email } });
        // Check if the user object in the database matches the new user object
        const isPasswordCorrect = await bcrypt.compare(newUser.password, registeredUser.password);

        expect(isPasswordCorrect).toBe(true); 

        expect(registeredUser).toMatchObject({
            email: newUser.email,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            role: newUser.role
    });
  });
  
  })

  test('should respond with a 400 for registration with existing email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testUser2',
        password: 'testPassword2',
        email: 'testEmail@example.com', // This email is already used in the previous test
        firstname: 'Test2',
        lastname: 'User2',
        role: 'testRole2'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'User with that email already exists');
  });
});