import request from 'supertest';
import app from '../src/index.js'; // Import your app

const newUser = {
  username: 'testuser',
  password: 'testpassword',
  email: 'testuser@example.com',
  firstname: 'Test',
  lastname: 'User',
  role: 'student'
};

const loginUser = {
  email: 'testuser@example.com',
  password: 'testpassword'
};

describe('Auth Endpoints', () => {
  let server;

  beforeAll(() => {
    server = app.listen(); // Start the server before all tests
  });

  afterAll((done) => {
    server.close(done); // Close the server after all tests
  });

  it('should create a new user', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', newUser.username);
  });

  it('should authenticate the user', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send(loginUser);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});