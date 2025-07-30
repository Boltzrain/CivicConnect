# CivicConnect - Municipal Complaint Filing System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application that allows citizens to file complaints with their city's municipal departments. The application automatically generates professional complaint letters and enables users to send them via WhatsApp Web or email.

## 🌟 Features

### User Management
- **User Registration & Login**: Secure authentication system with JWT
- **Password Hashing**: Secure password storage using bcrypt
- **Form Validation**: Client-side and server-side validation
- **Protected Routes**: Route protection for authenticated users

### Complaint Management
- **File New Complaints**: Comprehensive form for filing municipal complaints
- **Issue Type Selection**: Water, Electricity, Road, Sanitation, Street Lights, Garbage Collection, Public Transport, Parks, Noise Pollution, and more
- **Location-based Routing**: Automatic department assignment based on city and issue type
- **Image Upload**: Optional image attachment with complaints (up to 5MB)
- **Auto-generated Tracking IDs**: Unique tracking identifiers for each complaint

### Communication Features
- **Auto-generated Complaint Letters**: Professional, formatted complaint letters
- **WhatsApp Integration**: Send complaints directly via WhatsApp Web
- **Email Integration**: Send complaints via email using mailto: links
- **Department Contact Database**: Pre-configured department contacts for major cities
- **Delivery Tracking**: Track when complaints are sent via different channels

### Dashboard & History
- **User Dashboard**: Overview of complaint statistics and recent activity
- **Complaint History**: Complete list of filed complaints with status tracking
- **Status Management**: Track complaint progress (Filed, In Progress, Resolved, Closed)
- **Resend Functionality**: Easily resend complaints via WhatsApp or email
- **Search & Pagination**: Efficiently browse through complaint history

### UI/UX Features
- **Responsive Design**: Bootstrap 5 powered responsive interface
- **Modern UI**: Clean, professional design with Bootstrap Icons
- **Real-time Feedback**: Loading states, success/error messages
- **Modal Previews**: Preview complaint letters before sending
- **Image Previews**: Preview uploaded images before submission

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router DOM** for navigation
- **Bootstrap 5** & **React Bootstrap** for styling
- **Bootstrap Icons** for iconography
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **express-validator** for input validation
- **CORS** for cross-origin requests

### Database Schema
- **Users**: Authentication and profile information
- **Complaints**: Complaint details, tracking, and status
- **Departments**: Municipal department contact information stored in MongoDB (replaces hardcoded data)

## 📁 Project Structure

```
CivicConnect/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── departmentController.js
│   ├── data/
│   │   └── seedData.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   └── Department.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── departmentRoutes.js
│   ├── scripts/
│   │   └── seedDatabase.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── NewComplaint.jsx
│   │   │   └── ComplaintHistory.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── complaintService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civicconnect
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Seed the database with department data**
   ```bash
   # Populate MongoDB with municipal department data for 6 cities
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend server will start on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on http://localhost:5173

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB on your local machine
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/civicconnect`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update the `MONGODB_URI` in `.env`

## 📱 Usage Guide

### Getting Started
1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your complaint statistics and recent activity

### Filing a Complaint
1. **Navigate**: Go to "New Complaint" from the navigation menu
2. **Fill Details**: 
   - Select issue type (Water, Electricity, Road, etc.)
   - Choose your city from supported cities
   - Enter pincode and detailed address
   - Describe the issue in detail
   - Upload an image (optional)
3. **Submit**: Click "File Complaint" to generate the complaint letter
4. **Send**: Use WhatsApp or Email buttons to send to the appropriate department

### Managing Complaints
1. **View History**: Go to "Complaint History" to see all your complaints
2. **Track Status**: Monitor complaint status (Filed, In Progress, Resolved, Closed)
3. **Resend**: Use WhatsApp or Email buttons to resend complaints
4. **View Details**: Click "Details" to see complete complaint information
5. **View Letter**: Click "Letter" to see the generated complaint text

### Supported Cities & Departments
Database includes 60 departments across 6 major Indian cities:
- **Mumbai**: All municipal departments with contact information (10 departments)
- **Delhi**: Municipal corporations and specialized boards (10 departments)
- **Bangalore**: BBMP and utility companies (10 departments)
- **Chennai**: Chennai Corporation and state boards (10 departments)
- **Kolkata**: KMC and West Bengal departments (10 departments)
- **Bhubaneswar**: BMC and Odisha state departments (10 departments)

## 🌍 API Endpoints

### Authentication
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Complaints
```
GET    /api/complaints              # Get user's complaints
POST   /api/complaints              # Create new complaint
GET    /api/complaints/:id          # Get single complaint
PUT    /api/complaints/:id/status   # Update complaint status
POST   /api/complaints/:id/sent     # Mark complaint as sent
DELETE /api/complaints/:id          # Delete complaint
```

### Departments
```
GET    /api/departments/cities            # Get all supported cities
GET    /api/departments/issue-types       # Get all issue types
GET    /api/departments/city/:city        # Get departments by city
GET    /api/departments/:city/:issueType  # Get specific department
GET    /api/departments                   # Get all departments (with filters)
POST   /api/departments                   # Create department (Admin)
PUT    /api/departments/:id               # Update department (Admin)
DELETE /api/departments/:id               # Delete department (Admin)
```

## 🔧 Configuration

### Adding New Cities and Departments

#### Method 1: Using Database Seeding
1. **Add to seed data**: Edit `backend/data/seedData.js` to include new city/department data
2. **Run seeding script**: 
   ```bash
   cd backend
   npm run seed
   ```

#### Method 2: Using API (Admin Access)
Create new departments via REST API:
```bash
POST /api/departments
{
  "city": "YourCity",
  "issueType": "Water",
  "name": "Water Department - YourCity",
  "contactEmail": "water@yourcity.gov.in",
  "contactPhone": "+91-XXX-XXX-XXXX",
  "address": "Department Address",
  "website": "https://yourcity.gov.in",
  "workingHours": "9:00 AM - 5:00 PM (Mon-Fri)"
}
```

#### Method 3: Direct Database Insert
Connect to MongoDB and insert department documents directly:
```javascript
db.departments.insertOne({
  city: "YourCity",
  issueType: "Water",
  name: "Water Department - YourCity",
  contactEmail: "water@yourcity.gov.in",
  contactPhone: "+91-XXX-XXX-XXXX",
  // ... other fields
});
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Input Validation**: Server-side validation using express-validator
- **File Upload Security**: File type and size restrictions
- **CORS Configuration**: Controlled cross-origin requests
- **Route Protection**: Authentication middleware for protected routes

## 🌐 Deployment

### Backend Deployment (Node.js)
1. **Environment**: Set NODE_ENV=production
2. **Database**: Use MongoDB Atlas for production
3. **Server**: Deploy to services like Heroku, AWS, or DigitalOcean

### Frontend Deployment (React)
1. **Build**: Run `npm run build` to create production build
2. **Deploy**: Deploy to services like Netlify, Vercel, or AWS S3

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please email: support@civicconnect.com

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- MongoDB team for the excellent database solution
- React team for the powerful frontend library
- Express.js team for the robust backend framework

---

**CivicConnect** - Bridging the gap between citizens and municipal services! 🏛️✨ 