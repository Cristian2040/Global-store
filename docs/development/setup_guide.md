# 🚀 Development Setup Guide

Getting GlobalStore up and running locally for development.

## 1. Prerequisites
- **Node.js**: v18.x or higher.
- **MongoDB**: A running instance (local or Atlas).
- **Git**: For version control.

## 2. Installation

1.  **Clone**: `git clone <repo-url>`
2.  **Backend**:
    ```bash
    cd backend
    npm install
    cp .env.example .env  # Fill in variables
    npm run dev
    ```
3.  **Frontend**:
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local  # Fill in variables
    npm run dev
    ```

## 3. Initial Seeding
To see data in the app:
1.  Register a new **Admin** user via the UI or direct DB insertion.
2.  Use the Admin Dashboard to create the first few Global Products and Categories.

## 4. Technical Workflows
- **Validation**: When adding a new field to a model, ALWAYS update the corresponding Joi schema in `backend/src/utils/validators.js`.
- **Response**: Always use the `success` or `error` helpers from `responseHandler.js`.
