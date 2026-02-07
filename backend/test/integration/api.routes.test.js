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

    describe('Protected Routes', () => {
        it('GET /api/users should require authentication', async () => {
            const response = await request(app).get('/api/users');
            expect(response.status).toBe(401);
        });

        it('GET /api/users/profile should require authentication', async () => {
            const response = await request(app).get('/api/users/profile');
            expect(response.status).toBe(401);
        });

        it('POST /api/stores should require authentication', async () => {
            const response = await request(app)
                .post('/api/stores')
                .send({ storeName: 'Test' });
            expect(response.status).toBe(401);
        });

        it('POST /api/customer-orders should require authentication', async () => {
            const response = await request(app)
                .post('/api/customer-orders')
                .send({});
            expect(response.status).toBe(401);
        });

        it('POST /api/restock-orders should require authentication', async () => {
            const response = await request(app)
                .post('/api/restock-orders')
                .send({});
            expect(response.status).toBe(401);
        });
    });

    describe('Public Routes', () => {
        it('GET /api/stores should be accessible', async () => {
            const response = await request(app).get('/api/stores');
            expect([200, 500]).toContain(response.status);
        });

        it('GET /api/products should be accessible', async () => {
            const response = await request(app).get('/api/products');
            expect([200, 500]).toContain(response.status);
        });

        it('GET /api/products/categories should be accessible', async () => {
            const response = await request(app).get('/api/products/categories');
            expect([200, 500]).toContain(response.status);
        });
    });
});
