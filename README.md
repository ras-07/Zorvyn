# Finance Dashboard API

## Project Overview
The **Finance Dashboard API** is a robust, production-ready backend system designed to manage personal and organizational financial records. It provides a secure environment for users to track income and expenses, categorize transactions, and view analytical summaries of their financial health. Built with a focus on security and scalability, it features multi-role access control and advanced bot protection.

---

## Key Features
* **User Management:** Full authentication flow including sign-up, sign-in, and profile management.
* **Financial CRUD:** Create, read, update, and delete financial transactions with category tagging.
* **Analytics & Statistics:** Real-time calculation of net balance and category-wise spending distributions.
* **Role-Based Access:** Granular permissions for Viewers, Analysts, and Admins.

---

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose ODM
* **Security:** Arcjet (Rate limiting & Bot protection), Bcrypt (Password hashing)
* **Authentication:** JSON Web Tokens (JWT)

---

## Architecture & Design

### MVC Pattern
The project follows the **Model-View-Controller** architectural pattern to ensure a clean separation of concerns:
* **Models:** Define the data structure and schema for Users and Transactions.
* **Controllers:** Contain the core business logic and request handling.
* **Routes:** Map API endpoints to specific controller functions.

### Role-Based Access Control (RBAC)
The system implements three distinct roles to manage data access:
1.  **Viewer:** Can view their own transactions and profile.
2.  **Analyst:** Inherits Viewer rights and can access financial summaries and category statistics.
3.  **Admin:** Full system access, including user management and the ability to modify any transaction.

### Atomic Transactions
In `auth.controller.js`, the system utilizes **Mongoose Sessions** during user registration. This ensures that the sign-up process is atomic; if any part of the user creation fails, the transaction is aborted, preventing partial or inconsistent data in the database.

---

## Security Implementation
* **Arcjet Shield:** Active protection against common web attacks and malicious bots using `detectBot`.
* **Rate Limiting:** Implements a **Token Bucket** algorithm (5 tokens/10s, capacity 10) to prevent API abuse and DDoS attacks.
* **Bcrypt:** Passwords are never stored in plain text; they are salted and hashed with a factor of 10 before being saved.

---

## API Documentation

### Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/auth/sign-up` | Public | Register a new user |
| POST | `/api/v1/auth/sign-in` | Public | Login and receive JWT |
| POST | `/api/v1/auth/sign-out` | Public | Log out user |

### User Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/users` | Admin | Get all users |
| GET | `/api/v1/users/:id` | Authenticated | Get profile by ID |
| PUT | `/api/v1/users/:id` | Admin | Update user details |
| DELETE| `/api/v1/users/:id` | Admin | Remove user |

### Transactions
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/transactions` | Authenticated | List transactions (Filtered by User) |
| POST | `/api/v1/transactions` | Admin | Create a new record |
| GET | `/api/v1/transactions/summary`| Admin/Analyst | Financial summary (Income/Expense) |
| GET | `/api/v1/transactions/categories`| Admin/Analyst | Category-wise stats |

---

## Setup Instructions

1.  **Clone the Repository**
2.  **Install Dependencies:** `npm install`
3.  **Configure Environment:** Create a `.env.development.local` file in the root directory and populate it with the following:
    ```env
    PORT=5500
    NODE_ENV='development'
    DB_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    JWT_EXPIRES_IN=1d
    ARCJET_KEY=your_arcjet_key
    ```
4.  **Run the Server:** `npm run dev` (assumes a dev script is configured) or `node app.js`.

---

## Assumptions & Tradeoffs
* **Stateless Sign-out:** The sign-out endpoint currently relies on the client to clear local tokens. This avoids the overhead of managing a "denylist" in the database but requires client-side compliance.
* **Privacy by Default:** Non-admin users are strictly limited to viewing only their own transactions via query filtering in the `getTransactions` controller.
* **Development Speed:** The system uses `dotenv` with specific environment files (e.g., `.env.development.local`) to streamline local development without leaking secrets.

---

## Error Handling
The API employs a **centralized Error Middleware** to ensure all responses follow a standard JSON format. This middleware specifically handles:
* **Mongoose CastErrors:** For invalid Object IDs.
* **Duplicate Key Errors (11000):** For existing emails.
* **Validation Errors:** To return specific schema violation messages to the user.

All unexpected errors default to a `500 Server Error` with a consistent object structure: `{ success: false, error: "Message" }`.
