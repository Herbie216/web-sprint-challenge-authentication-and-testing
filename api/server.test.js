const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe('Auth Endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    test('should return 201 on successful registration', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(201);
    });

    test('should return 400 if username or password is missing', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'testuser' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('username and password required');
    });
  });

  describe('[POST] /api/auth/login', () => {
    test('should return 200 on successful login', async () => {
      await request(server).post('/api/auth/register').send({ username: 'testuser', password: 'password' });
      const res = await request(server).post('/api/auth/login').send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('welcome, testuser');
      expect(res.body.token).toBeTruthy();
    });
  });
  

    test('should return 401 if credentials are invalid', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'wronguser', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('invalid credentials');
    });
  });

