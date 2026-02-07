/**
 * Simple logger utility
 * In production, you might want to use Winston or Pino
 */

const { NODE_ENV } = require('../config/environment/env');

const logger = {
    info: (message, meta = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    },

    error: (message, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
            message: error.message,
            stack: NODE_ENV === 'development' ? error.stack : undefined
        });
    },

    warn: (message, meta = {}) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
    },

    debug: (message, meta = {}) => {
        if (NODE_ENV === 'development') {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
        }
    }
};

module.exports = logger;
