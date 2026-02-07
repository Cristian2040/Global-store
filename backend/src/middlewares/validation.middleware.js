const { error } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Validation middleware factory
 * Creates middleware to validate request data against Joi schemas
 * 
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error: validationError, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown fields
        });

        if (validationError) {
            const errors = validationError.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            logger.warn('Validation failed', { errors, property });

            return error(res, 'Validation failed', 400, errors);
        }

        // Replace request property with validated and sanitized value
        req[property] = value;
        next();
    };
};

module.exports = validate;
