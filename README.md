# 🍱 MessMate

**MessMate** is a full-stack MERN application that helps students discover, manage, and explore mess/food listings.

The project demonstrates a complete production-style workflow using **React, Node.js, Express, MongoDB, JWT authentication, Axios, and REST APIs**.

## 🚀 Live Demo

* **Frontend:** https://messmate-frontend.netlify.app/
* **Backend API:** https://messmate-backend-ntvv.onrender.com

## ✨ Features

### 🔐 Authentication

* User registration
* User login
* Password hashing with bcrypt
* JWT-based authentication
* Protected backend routes
* Protected React routes
* Logout functionality
* Token persistence using localStorage
* Automatic Authorization header using Axios interceptor
* Login/signup loading states
* Password validation

### 🍱 Mess Management

* Create a new mess listing
* View mess listings
* View individual mess details
* Search messes by location
* Update mess details
* Delete mess listings
* Pagination support

### 🛡️ Security

* JWT authentication
* Protected `/messes` API
* Protected `/profile` API
* Helmet security headers
* Rate limiting
* MongoDB input sanitization
* XSS protection
* CORS configuration
* Environment variables for secrets
* HTTPS on production deployment

### ⚡ Performance & Production

* Response compression
* Centralized error handling
* HTTP request logging with Morgan
* Environment-based logging
* MongoDB Atlas production database
* Production React build
* Render deployment

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │     React Frontend   │
                    │      Netlify/Render   │
                    └──────────┬───────────┘
                               │
                         Axios / REST API
                               │
                    Authorization: Bearer JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │      Backend API     │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
              JWT Authentication      Mess APIs
                    │                      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     MongoDB Atlas     │
                    │       Database        │
                    └──────────────────────┘
```

## 📁 Project Structure

### Frontend

```text
messmate-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AddMessForm.js
│   │   ├── LoginForm.js
│   │   ├── SignupForm.js
│   │   ├── Navbar.js
│   │   ├── MessList.js
│   │   └── ProtectedRoute.js
│   │
│   ├── context/
│   │   └── AuthContext.js
│   │
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Dashboard.js
│   │   └── Profile.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── axiosConfig.js
│   └── App.js
│
├── package.json
└── .gitignore
```

### Backend

```text
messmate-api/
├── middleware/
│   ├── authMiddleware.js
│   └── validateObjectId.js
│
├── models/
│   ├── Mess.js
│   └── User.js
│
├── routes/
│   ├── auth.js
│   ├── messRoutes.js
│   └── profile.js
│
├── index.js
├── package.json
└── .gitignore
```

## 🔑 Authentication Flow

```text
User
 │
 │ Register
 ▼
POST /auth/register
 │
 ▼
Password hashed using bcrypt
 │
 ▼
MongoDB
```

```text
User
 │
 │ Login
 ▼
POST /auth/login
 │
 ▼
Credentials verified
 │
 ▼
JWT generated
 │
 ▼
React stores token
 │
 ▼
Axios interceptor
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
Protected API
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint         | Access |
| ------ | ---------------- | ------ |
| POST   | `/auth/register` | Public |
| POST   | `/auth/login`    | Public |

### Profile

| Method | Endpoint   | Access       |
| ------ | ---------- | ------------ |
| GET    | `/profile` | 🔒 Protected |

### Mess

| Method | Endpoint         | Access       |
| ------ | ---------------- | ------------ |
| GET    | `/messes`        | 🔒 Protected |
| GET    | `/messes/search` | 🔒 Protected |
| GET    | `/messes/:id`    | 🔒 Protected |
| POST   | `/messes`        | 🔒 Protected |
| PUT    | `/messes/:id`    | 🔒 Protected |
| DELETE | `/messes/:id`    | 🔒 Protected |

## 🧰 Technologies

### Frontend

* React.js
* React Router
* Axios
* React Context API
* JavaScript
* HTML/CSS

### Backend

* Node.js
* Express.js
* Mongoose
* JWT
* bcryptjs
* Morgan
* Helmet
* express-rate-limit
* compression

### Database

* MongoDB
* MongoDB Atlas
* MongoDB Compass

### Deployment

* Render
* Netlify
* MongoDB Atlas

## ⚙️ Environment Variables

### Backend `.env`

```env
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Frontend `.env`

```env
REACT_APP_API_BASE_URL=your_backend_url
```

> Never commit `.env` files or expose JWT secrets and database credentials.

## 💻 Run Locally

### Backend

```bash
cd messmate-api
npm install
npm start
```

Backend will run on:

```text
http://localhost:4000
```

### Frontend

```bash
cd messmate-frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3001
```

## 🧪 Testing

The API can be tested using:

* Thunder Client
* Postman
* Browser
* React frontend

Example login request:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

## 🛡️ Production Security

The application includes:

* JWT authentication
* Password hashing
* Protected API routes
* CORS
* Helmet
* Rate limiting
* XSS protection
* MongoDB sanitization
* HTTPS deployment
* Environment variables
* Centralized error handling

## 📈 Future Improvements

* Role-based authorization
* Admin dashboard
* Mess reviews and ratings
* Image uploads
* Favorite messes
* Advanced filtering
* Google Maps integration
* Email verification
* Password reset
* Refresh tokens
* Redis caching
* Automated testing
* CI/CD pipeline

## 👨‍💻 Author

**Yashin Ansari**

B.Tech Information Technology

CSJMU Kanpur

---

⭐ If you find this project useful, consider giving the repository a star!
