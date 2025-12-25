# Frontend - Employee Management System

This is the frontend for the Employee Management System, a React application built with Vite that consumes the backend API.

## Comprehensive Documentation

### Approach and Implementation Details

The frontend is a single-page application (SPA) built using React and Vite. The project follows a component-based architecture, with the UI broken down into reusable components.

-   **Routing:** The application uses `react-router-dom` for client-side routing, with routes for login, dashboard, and CRUD operations for companies, departments, and employees.
-   **State Management:** The authentication state is managed globally using React's Context API. The `AuthContext` provides the user object and authentication token to all components in the application.
-   **API Communication:** The application uses the `axios` library to make HTTP requests to the backend API. A base instance of `axios` is configured to use the API's base URL.

### Considerations

-   **Token-Based Authentication:** The application uses token-based authentication. The authentication token is stored in the browser's local storage to persist the user's session between page reloads.
-   **Protected Routes:** A `ProtectedRoute` component is used to protect routes that require authentication. This component checks if the user is authenticated before rendering the requested page; otherwise, it redirects the user to the login page.
-   **Environment Variables:** The application uses a `.env` file to store the backend API's base URL. This makes it easy to switch between different environments (e.g., development and production).

## Setup and Run Instructions

### Prerequisites

-   Node.js 14+
-   `npm` (Node Package Manager)

### Installation

1.  Navigate to the `Frontend` directory:
    ```bash
    cd Frontend
    ```
2.  Install the required dependencies from the `package.json` file:
    ```bash
    npm install
    ```
3.  Copy the `.env.example` file to `.env` and set the `VITE_API_BASE` variable to your backend's root URL (e.g., `http://localhost:8000`).
    ```bash
    cp .env.example .env
    ```

### Running the Development Server

1.  Run the following command to start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173/` (or another port if 5173 is in use).

## Task Completion Checklist

-   [x] User login and authentication
-   [x] Protected routes for authenticated users
-   [x] A dashboard page
-   [x] CRUD functionality for companies
--  [x] CRUD functionality for departments
-   [x] CRUD functionality for employees
-   [x] Token management with local storage
