const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/responseHandler');
const AppError = require('../utils/AppError');

/**
 * User Controller
 * Handles HTTP requests for user operations
 */
class UserController {
    /**
     * Get all users
     * GET /api/users
     */
    getAll = asyncHandler(async (req, res) => {
        const filters = {
            role: req.query.role,
            active: req.query.active,
            search: req.query.search
        };

        const paginationOptions = {
            page: req.query.page,
            limit: req.query.limit
        };

        const result = await userService.getAll(filters, paginationOptions);

        paginated(res, result.users, result.pagination, 'Users retrieved successfully');
    });

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Check if user is requesting their own data or is admin
        if (req.user.userId !== id && req.user.role !== 'admin') {
            throw new AppError('Insufficient permissions', 403);
        }

        const user = await userService.getById(id);

        success(res, user, 'User retrieved successfully');
    });

    /**
     * Get current user profile
     * GET /api/users/profile
     */
    getProfile = asyncHandler(async (req, res) => {
        const result = await userService.getProfile(req.user.userId);

        success(res, result, 'Profile retrieved successfully');
    });

    /**
     * Update user
     * PUT /api/users/:id
     */
    update = asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Check if user is updating their own data or is admin
        if (req.user.userId !== id && req.user.role !== 'admin') {
            throw new AppError('Insufficient permissions', 403);
        }

        const user = await userService.update(id, req.body);

        success(res, user, 'User updated successfully');
    });

    /**
     * Delete user (soft delete)
     * DELETE /api/users/:id
     */
    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        await userService.delete(id);

        success(res, null, 'User deactivated successfully');
    });

    /**
     * Permanently delete user
     * DELETE /api/users/:id/permanent
     */
    permanentDelete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        await userService.permanentDelete(id);

        success(res, null, 'User permanently deleted');
    });

    /**
     * Reactivate user
     * POST /api/users/:id/reactivate
     */
    reactivate = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const user = await userService.reactivate(id);

        success(res, user, 'User reactivated successfully');
    });
}

module.exports = new UserController();
