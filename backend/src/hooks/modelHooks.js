const bcrypt = require('bcryptjs');

/**
 * Mongoose Hooks (Middleware)
 * 
 * Los hooks son funciones que se ejecutan automáticamente en ciertos momentos
 * del ciclo de vida de un documento (antes/después de save, update, delete, etc.)
 */

/**
 * Hook para hashear contraseñas antes de guardar
 * Uso: En el modelo User
 */
const hashPasswordBeforeSave = async function (next) {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Hook para actualizar timestamps automáticamente
 * Uso: En cualquier modelo
 */
const updateTimestamps = function (next) {
    this.updatedAt = new Date();
    next();
};

/**
 * Hook para logging de operaciones
 * Uso: En cualquier modelo para debugging
 */
const logOperation = function (next) {
    console.log(`[${this.constructor.modelName}] Operation: ${this.op || 'save'}`);
    next();
};

/**
 * Hook para validar datos antes de guardar
 * Uso: En modelos que requieren validación custom
 */
const validateBeforeSave = function (next) {
    // Ejemplo: validar que el email no esté vacío
    if (this.email && !this.email.includes('@')) {
        return next(new Error('Invalid email format'));
    }
    next();
};

/**
 * Hook para soft delete
 * Uso: En modelos que usan soft delete
 */
const softDeleteMiddleware = function (next) {
    // En lugar de eliminar, marcar como inactivo
    this.active = false;
    this.deletedAt = new Date();
    next();
};

module.exports = {
    hashPasswordBeforeSave,
    updateTimestamps,
    logOperation,
    validateBeforeSave,
    softDeleteMiddleware
};
