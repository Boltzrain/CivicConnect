# CivicConnect - MERN Stack Authentication App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application with user authentication, built using Vite, MVC architecture, and Bootstrap styling.

## Features

- **User Registration & Login**: Secure authentication system
- **JWT Token-based Authentication**: Stateless authentication
- **Password Hashing**: Secure password storage using bcrypt
- **Form Validation**: Client-side and server-side validation
- **Responsive Design**: Bootstrap-powered responsive UI
- **Protected Routes**: Route protection for authenticated users
- **MVC Architecture**: Clean, organized backend structure
- **Real-time Feedback**: Loading states and error handling

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Bootstrap 5** & **React Bootstrap** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## Project Structure

```
CivicConnect/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory with:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civicconnect
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Start the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:3000`

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/civicconnect`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |

### Request/Response Examples

#### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login User
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

## Validation Rules

### Registration
- **Name**: 2-50 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters with uppercase, lowercase, and number

### Login
- **Email**: Valid email format
- **Password**: Required

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Error handling without sensitive data exposure
- Protected routes and middleware

## Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Usage

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access your personal dashboard after authentication
4. **Logout**: Sign out and clear authentication token

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@civicconnect.com or create an issue in the repository. 