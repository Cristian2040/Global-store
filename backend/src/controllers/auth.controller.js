const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
class AuthController {
    /**
     * Register new user
     * POST /api/auth/register
     */
    register = asyncHandler(async (req, res) => {
        const result = await authService.register(req.body);

        success(res, result, 'User registered successfully', 201);
    });

    /**
     * Login user
     * POST /api/auth/login
     */
    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        success(res, result, 'Login successful');
    });

    /**
     * Change password
     * POST /api/auth/change-password
     */
    changePassword = asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        await authService.changePassword(userId, oldPassword, newPassword);

        success(res, null, 'Password changed successfully');
    });

    /**
     * Refresh token
     * POST /api/auth/refresh
     */
    refreshToken = asyncHandler(async (req, res) => {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required'
            });
        }

        const result = await authService.refreshToken(token);

        success(res, result, 'Token refreshed successfully');
    });

    /**
     * Logout (client-side token removal)
     * POST /api/auth/logout
     */
    logout = asyncHandler(async (req, res) => {
        // In JWT, logout is handled client-side by removing the token
        // This endpoint exists for consistency and future token blacklisting
        logger.info('User logged out', { userId: req.user?.userId });

        success(res, null, 'Logout successful');
    });

    /**
     * Get current user info
     * GET /api/auth/me
     */
    getMe = asyncHandler(async (req, res) => {
        success(res, req.user, 'User info retrieved');
    });
}

module.exports = new AuthController();
