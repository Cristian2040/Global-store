/**
 * Custom error class for application errors
 * Extends the native Error class with additional properties
 */
class AppError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     * @param {boolean} isOperational - Whether the error is operational (expected) or programming error
     */
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
