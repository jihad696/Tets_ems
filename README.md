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


# Backend - Employee Management System

This is the backend for the Employee Management System, a Django project that provides a RESTful API for managing companies, departments, and employees.

## Comprehensive Documentation

### Approach and Implementation Details

The backend is built using the Django web framework and the Django REST Framework to create a robust and scalable API. The project follows a modular architecture, with different functionalities separated into the following Django apps:

-   `accounts`: Manages user authentication, and role-based access control.
-   `companies`: Manages the creation, retrieval, updating, and deletion of company records.
-   `departments`: Manages departments within each company.
-   `employees`: Manages employee profiles.

### Considerations

-   **Denormalization:** The `Company` model includes `department_count` and `employee_count` fields to optimize performance by avoiding expensive database queries. These counts are kept in sync using Django signals.
-   **Custom User Model:** A custom `User` model is used to enable email-based authentication and to add a `role` field for implementing role-based access control.
-   **Permissions:** The application uses a custom permission system to control access to different API endpoints based on user roles.

## Setup and Run Instructions

### Prerequisites

-   Python 3.8+
-   `pip` (Python package installer)

### Installation

1.  Navigate to the `Backend/ems_project` directory:
    ```bash
    cd Backend/ems_project
    ```
2.  Install the required dependencies from the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```
3.  Apply the database migrations to create the database schema:
    ```bash
    python manage.py migrate
    ```
4.  Create a superuser to access the Django admin interface and to have an initial admin user:
    ```bash
    python manage.py createsuperuser
    ```

### Running the Development Server

1.  Navigate to the `Backend/ems_project` directory.
2.  Run the following command to start the development server:
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://127.0.0.1:8000/`.

## Task Completion Checklist

-   [x] User authentication (login)
-   [x] Role-based access control (Admin, Manager, Employee)
-   [x] CRUD operations for companies
-   [x] CRUD operations for departments
-   [x] CRUD operations for employees
-   [x] API endpoint documentation

## Security Measures

### Role-Based Access Control (RBAC)

The application implements a role-based access control system to restrict access to certain operations based on the user's role. The available roles are:

-   **Administrator (`ADMIN`):** Has full access to all resources and can perform any operation.
-   **Manager (`MANAGER`):** Can create, update, and delete companies, departments, and employees.
-   **Employee (`EMPLOYEE`):** Has read-only access to most resources.

Permissions are enforced at the view level using custom permission classes. For example, creating, updating, or deleting a company requires the user to be a `MANAGER` or an `ADMIN`.

### Authentication

The API uses token-based authentication. To access protected endpoints, you must include an `Authorization` header in your requests with a valid token:

```
Authorization: Token <your_auth_token>
```

A token is obtained by sending a `POST` request to the `/api/auth/login/` endpoint with a valid email and password.

## API Documentation

The following are the main API endpoints available:

| Endpoint                          | Method  | Description                                        | Permissions              |
| --------------------------------- | ------- | -------------------------------------------------- | ------------------------ |
| `/api/auth/login/`                | `POST`  | Authenticates a user and returns an auth token.    | Public                   |
| `/api/auth/user/`                 | `GET`   | Retrieves the details of the authenticated user.   | Authenticated            |
| `/api/companies/`                 | `GET`   | Retrieves a list of all companies.                 | Authenticated            |
| `/api/companies/`                 | `POST`  | Creates a new company.                             | Manager or Admin         |
| `/api/companies/<id>/`            | `GET`   | Retrieves the details of a specific company.       | Authenticated            |
| `/api/companies/<id>/`            | `PUT`   | Updates a company.                                 | Manager or Admin         |
| `/api/companies/<id>/`            | `DELETE`| Deletes a company.                                 | Manager or Admin         |
| `/api/departments/`               | `GET`   | Retrieves a list of all departments.               | Authenticated            |
| `/api/departments/`               | `POST`  | Creates a new department.                          | Manager or Admin         |
| `/api/departments/<id>/`          | `GET`   | Retrieves the details of a specific department.    | Authenticated            |
| `/api/departments/<id>/`          | `PUT`   | Updates a department.                              | Manager or Admin         |
| `/api/departments/<id>/`          | `DELETE`| Deletes a department.                              | Manager or Admin         |
| `/api/employees/`                 | `GET`   | Retrieves a list of all employees.                 | Authenticated            |
| `/api/employees/`                 | `POST`  | Creates a new employee.                            | Manager or Admin         |
| `/api/employees/<id>/`            | `GET`   | Retrieves the details of a specific employee.      | Authenticated            |
| `/api/employees/<id>/`            | `PUT`   | Updates an employee.                               | Manager or Admin         |
| `/api/employees/<id>/`            | `DELETE`| Deletes an employee.                               | Manager or Admin         |
