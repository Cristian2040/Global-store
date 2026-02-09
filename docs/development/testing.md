# 🧪 Testing Standards & Operations

Quality is maintained through a combination of local unit tests and professional integration tests.

## 1. Organization
- Tests are located in `backend/tests/`.
- **Unit Tests**: Focus on Service-layer logic (auth, stock math).
- **Integration Tests**: Focus on API routes and middleware behavior.

## 2. Running Tests
```bash
cd backend
npm test
```

## 3. Best Practices
- **Isolation**: Each test should seed its own data and clean up afterwards.
- **Coverage**: Focus on "Happy Path" and critical error cases (e.g., unauthorized access, insufficient stock).
- **Naming**: Use descriptive test suites: `describe('Auth Service - Registration', ...)`
