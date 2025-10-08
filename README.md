
# FinTrack: A Personal Finance Assistant

FinTrack is a full-stack web application designed to empower users to take control of their finances by providing a clean, intuitive dashboard for tracking income, expenses, and visualizing spending habits. The application features a secure, token-based authentication system and a RESTful API backend built with Node.js and Express that serves a dynamic React frontend.

---

## Core Features

* **📊 Interactive Dashboard:** A central hub that provides an at-a-glance overview of total income, expenses, net savings, and balance.
* **📈 Data Visualization:** View spending trends over time with a line chart and understand expense distribution with an interactive pie chart for categories.
* **🧾 Automated Receipt Scanning:** Upload receipt images or PDFs to automatically parse and create expense entries using Optical Character Recognition (OCR).
* **✍️ Transaction Management:** Easily create, view, and delete income and expense transactions.
* **🔍 Filtering & Pagination:** Efficiently navigate through transaction history with server-side pagination and filter entries by a specific date range.
* **🔒 Secure Authentication:** A complete user registration and login system using JSON Web Tokens (JWT) to ensure each user's financial data is private and secure.

### Application Demonstration

Here is a quick look at the FinTrack application in action:

![FinTrack Demo GIF](project_gif.gif)

You can see the full video demonstration on YouTube: [https://youtu.be/i8cc_5N3x7c](https://youtu.be/i8cc_5N3x7c)

---

## Tech Stack

| Category         | Technologies                                             |
| :--------------- | :------------------------------------------------------- |
| **Frontend** | React, Vite, Tailwind CSS, Recharts (for charts), Axios  |
| **Backend** | Node.js, Express.js                                      |
| **Database** | MongoDB with Mongoose ODM                                |
| **Authentication** | JSON Web Tokens (JWT), bcrypt                            |

---

## Project Structure

The project is organized into two main directories: `backend` and `frontend`, following a standard monorepo-like structure.

### Backend Structure

The backend follows a modular, feature-oriented structure to separate concerns and improve maintainability.

```

backend/
├── config/         \# Database configuration (db.js)
├── controllers/    \# Application logic for handling requests
├── middleware/     \# Custom middleware (e.g., auth, errorHandler)
├── models/         \# Mongoose schemas for MongoDB collections
├── routes/         \# API route definitions (e.g., transactions.js)
├── uploads/        \# Directory for storing user-uploaded receipts
├── utils/          \# Utility functions (e.g., ocrParser.js)
└── server.js       \# Main Express server entry point

```

### Frontend Structure

The frontend is built with React (using Vite) and organized by feature and function to promote reusability.

```

frontend/
└── src/
├── api/          \# Axios instance and API call definitions (axios.js)
├── assets/       \# Static assets like images and logos
├── components/   \# Reusable React components
│   ├── common/   \# General-purpose components (Button, Spinner)
│   ├── dashboard/\# Components specific to the dashboard page
│   └── layout/   \# Layout components (Sidebar, Topbar)
├── context/      \# React Context providers (e.g., AuthContext)
├── hooks/        \# Custom React hooks (e.g., useAuth)
├── pages/        \# Top-level page components for routing
├── utils/        \# Utility functions (e.g., formatters.js, constants.js)
└── App.jsx       \# Root application component with routing setup

````

---

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your machine:

* [Node.js](https://nodejs.org/en/) (v18.x or higher)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)
* [Git](https://git-scm.com/)
* A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for the database.

### Installation & Setup

**1. Clone the repository**
Open your terminal and clone the project to your local machine (replace `your-github-username`):

```bash
git clone [https://github.com/your-github-username/personal-finance-assistant.git](https://github.com/your-github-username/personal-finance-assistant.git)
cd personal-finance-assistant
````

**2. Backend Setup**
First, we'll set up the backend server.

  * Navigate to the backend directory:

    ```bash
    cd backend
    ```

  * Install the required npm packages:

    ```bash
    npm install
    ```

  * **Create the Environment Variables file:**
    Create a new file named `.env` in the `backend` folder and add the following variables.

    ```
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

      * `PORT`: The port on which the backend server will run.
      * `MONGO_URI`: Get this from your MongoDB Atlas account. Create a new cluster, and follow the instructions to connect to your application to get the connection string. Remember to replace `<password>` with your database user's password.
      * `JWT_SECRET`: This is a secret key for signing the authentication tokens. You can use a long, random string of characters.

  * **Run the Backend Server:**

    ```bash
    npm run dev
    ```

    The backend server should now be running on `http://localhost:5001`.

**3. Frontend Setup**
Now, let's set up the React frontend. Open a **new terminal window** so you can keep the backend running.

  * Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

    *(If you opened a new terminal, navigate from the main directory: `cd frontend`)*

  * Install the required npm packages:

    ```bash
    npm install
    ```

  * **Create the Environment Variables file:**
    Create a new file named `.env` in the `frontend` folder and add the following variable.

    ```
    VITE_API_URL=http://localhost:5001/api
    ```

      * This URL must point to your running backend server. Ensure the port (`5001`) matches the `PORT` you set in the backend's `.env` file.

  * **Run the Frontend Development Server:**

    ```bash
    npm run dev
    ```

    The React application should now be running, and your browser will open to a URL like `http://localhost:5173`.

You can now register a new user and start using the application\!

-----

## API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Route                   | Description                            | Protected |
| :------- | :---------------------- | :------------------------------------- | :-------- |
| `POST`   | `/api/auth/register`    | Register a new user.                   | No        |
| `POST`   | `/api/auth/login`       | Log in a user and get a JWT.           | No        |
| `GET`    | `/api/auth/me`          | Get the current logged-in user's data. | Yes       |
| `GET`    | `/api/transactions`     | Get all transactions for a user.       | Yes       |
| `POST`   | `/api/transactions`     | Create a new transaction.              | Yes       |
| `DELETE` | `/api/transactions/:id` | Delete a specific transaction.         | Yes       |
| `POST`   | `/api/receipts`         | Upload a receipt for OCR processing.   | Yes       |

```
```
