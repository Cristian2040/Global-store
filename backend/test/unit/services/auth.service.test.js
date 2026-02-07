const authService = require('../../../src/services/auth.service');
const User = require('../../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('../../../src/models/Store');
jest.mock('../../../src/models/Supplier');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                role: 'customer'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            User.create.mockResolvedValue({
                _id: '123',
                ...userData,
                password: 'hashedpassword',
                toObject: () => ({ _id: '123', ...userData })
            });
            jwt.sign.mockReturnValue('token123');

            const result = await authService.register(userData);

            expect(User.findOne).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
            expect(User.create).toHaveBeenCalled();
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(result.user.password).toBeUndefined();
        });

        it('should throw error if email already exists', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            await expect(authService.register(userData)).rejects.toThrow('Email already registered');
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const email = 'test@example.com';
            const password = 'password123';

            const mockUser = {
                _id: '123',
                email,
                password: 'hashedpassword',
                active: true,
                role: 'customer',
                toObject: () => ({ _id: '123', email, role: 'customer' })
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token123');

            const result = await authService.login(email, password);

            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedpassword');
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        it('should throw error for invalid credentials', async () => {
            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
        });
    });
});
