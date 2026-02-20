module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/app.js',
        'src/routes/**/*.js',
        'src/middlewares/rateLimit.js',
        'src/middlewares/validation.middleware.js',
        'src/utils/validators.js'
    ],
    testMatch: [
        '**/test/**/*.test.js'
    ],
    verbose: false
};
