const request = require('supertest');
const app = require('../../../src/app');

describe('Auth Routes Integration Tests', () => {
    describe('POST /api/auth/register', () => {
        it('should return 400 for invalid data', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'a', // too short
                    email: 'invalid-email',
                    password: '123' // too short
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 for missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return 401 without token', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);
        });
    });
});
