const request = require('supertest');
const app = require('../../src/app');

describe('API Routes - Authentication Tests', () => {
    describe('GET /health', () => {
        it('should return health check', async () => {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ok: true });
        });
    });

    describe('Protected Routes - Authentication Required', () => {
        it('GET /api/users should return 401 without token', async () => {
            const response = await request(app).get('/api/users');
            expect(response.status).toBe(401);
        });

        it('GET /api/users/profile should return 401 without token', async () => {
            const response = await request(app).get('/api/users/profile');
            expect(response.status).toBe(401);
        });

        it('POST /api/stores should return 401 without token', async () => {
            const response = await request(app)
                .post('/api/stores')
                .send({ storeName: 'Test' });
            expect(response.status).toBe(401);
        });

        it('POST /api/customer-orders should return 401 without token', async () => {
            const response = await request(app)
                .post('/api/customer-orders')
                .send({});
            expect(response.status).toBe(401);
        });

        it('POST /api/restock-orders should return 401 without token', async () => {
            const response = await request(app)
                .post('/api/restock-orders')
                .send({});
            expect(response.status).toBe(401);
        });

        it('PUT /api/users/123 should return 401 without token', async () => {
            const response = await request(app)
                .put('/api/users/123')
                .send({ username: 'test' });
            expect(response.status).toBe(401);
        });

        it('DELETE /api/stores/123 should return 401 without token', async () => {
            const response = await request(app).delete('/api/stores/123');
            expect(response.status).toBe(401);
        });
    });
});
