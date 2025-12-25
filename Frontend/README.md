# Frontend

This is the frontend for the Employee Management System. It is a React application built with Vite.

## Setup

1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Copy the `.env.example` file to `.env` and set the `VITE_API_BASE` variable to your backend's root URL (e.g., `http://localhost:8000`).
    ```bash
    cp .env.example .env
    ```

## Running the development server

1.  Run the following command to start the development server:
    ```bash
    npm run dev
    ```

## Notes

-   The login endpoint defaults to `VITE_LOGIN_ENDPOINT` or `/api/auth/login/`. Adjust this to match your Django backend.
-   API calls use the base URL from `VITE_API_BASE`. The endpoints used are:
    -   `/companies/`, `/companies/:id/`
    -   `/departments/`, `/departments/:id/` (supports `?company=` for filtering)
    -   `/employees/`, `/employees/:id/`
-   Authentication uses a token-based header: `Authorization: Token <token>`. Update `src/context/AuthContext.jsx` if your backend uses JWT (`Bearer`) or session cookies.

## What's included

-   Routing (Login, Dashboard, Companies, Departments, Employees)
-   Authentication context with token storage
-   Forms with basic validation for employees
-   Loading and error handling hooks
