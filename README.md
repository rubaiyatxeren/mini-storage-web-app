# Storagify - File Upload & Management System

![Storagify Banner](https://via.placeholder.com/800x200/4CAF50/FFFFFF?text=Storagify+-+Secure+File+Storage+Solution)
*A modern, full-stack file upload and management application with cloud storage, user authentication, and email notifications.*

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Backend Structure](#backend-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Storagify is a comprehensive file management solution that allows users to securely upload, organize, and manage files with cloud storage integration. The application features user authentication, email notifications, and a responsive dashboard for file management.

### Demo Previews:
<img width="1366" height="643" alt="Screenshot 2026-01-12 at 16-36-29 Storagify - File uploading web app" src="https://github.com/user-attachments/assets/ce08f9d1-7b24-4758-846e-c9d36a88e920" />
<img width="1366" height="643" alt="Screenshot 2026-01-12 at 16-36-29 Storagify - File uploading web app" src="https://github.com/user-attachments/assets/3a2f9f61-319e-4f1c-9581-ee892cb5bf30" />
<img width="1349" height="643" alt="Screenshot 2026-01-12 at 16-36-36 Storagify - File uploading web app" src="https://github.com/user-attachments/assets/8a57c28a-8edb-4598-af62-96139cb5ce6b" />


### Key Highlights
- **Secure Authentication**: JWT-based user authentication with password hashing
- **Cloud Storage**: Integration with Cloudinary for reliable file storage
- **Email Notifications**: Automated welcome and upload confirmation emails
- **Responsive UI**: Modern React.js frontend with Tailwind CSS
- **File Organization**: Tag-based file categorization and filtering
- **Real-time Updates**: Instant file list updates after operations

## ✨ Features

### 🛡️ Authentication & Security
- User registration with email validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Protected routes and API endpoints
- Session management with token validation

### 📁 File Management
- Upload files up to 50MB
- Support for multiple file types (images, videos, documents)
- File preview and direct download links
- File metadata tracking (size, format, upload date)
- Batch operations with tagging system

### 📧 Email System
- Welcome emails on registration
- File upload notifications
- Configurable email templates
- Asynchronous email delivery

### 🎨 User Interface
- Responsive dashboard with file statistics
- Drag-and-drop file upload
- Real-time progress indicators
- Toast notifications for user feedback
- Clean, modern design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **Heroicons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary SDK** - Cloud storage service
- **Nodemailer** - Email sending
- **express-fileupload** - File upload middleware

### Development Tools
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development server auto-reload

## 🏗️ Architecture

```
Storagify/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main application component
│   └── vite.config.js    # Vite configuration
│
├── server/                # Backend Express application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── server.js        # Main server file
│   └── .env.example     # Environment variables template
│
└── README.md            # Project documentation
```

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for email service)

### Step 1: Clone the Repository
```bash
git clone https://github.com/rubaiyatxeren/storagify.git
cd storagify
```

### Step 2: Backend Setup
```bash
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# See Configuration section below
```

### Step 3: Frontend Setup
```bash
cd ../client

# Install dependencies
npm install
```

### Step 4: Start Development Servers

#### Option A: Run separately
```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

#### Option B: Using concurrently (recommended)
```bash
# From root directory
npm run dev
```

## ⚙️ Configuration

### Backend Environment Variables (.env)
```env
# Server
PORT=4000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/storagify
# OR MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/storagify

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email (Gmail recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### Frontend Environment Variables (.env)
```env
VITE_APP_URL=http://localhost:5173/api
```

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your `CLOUD_NAME`, `API_KEY`, and `API_SECRET` from dashboard
3. Add these to your `.env` file

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password
3. Use this password in `EMAIL_PASS`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f67890123456",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** Same structure as register

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### File Upload Endpoints

#### Upload General File
```http
POST /api/upload/file
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
file: <file>
tags: "work,personal,project" (optional)
```

#### Upload Image
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
image: <image-file>
tags: "vacation,family" (optional)
```

#### Upload Video
```http
POST /api/upload/video
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
video: <video-file>
tags: "tutorial,presentation" (optional)
```

#### Get User Files
```http
GET /api/upload/files
Authorization: Bearer <token>
```

#### Delete File
```http
DELETE /api/upload/file/:id
Authorization: Bearer <token>
```

## 🎨 Frontend Components

### Core Components

#### FileList Component
Displays user's uploaded files in a responsive table with sorting and filtering capabilities.

**Props:**
- `files`: Array of file objects
- `onDelete`: Function to handle file deletion

**Features:**
- File type icons based on format
- Human-readable file sizes
- Direct file access links
- Responsive design

#### FileUpload Component
Provides file upload interface with type selection and tagging.

**Features:**
- Multiple upload types (file/image/video)
- Progress indicators
- Tag input with comma separation
- File size validation
- Upload success feedback

#### PrivateRoute Component
Protects routes that require authentication.

**Usage:**
```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### Pages

#### Login Page
- Email/password authentication
- Form validation
- Loading states
- Redirect to dashboard on success

#### Register Page
- User registration with validation
- Password confirmation
- Username/email uniqueness checks
- Auto-login after registration

#### Dashboard Page
- User greeting and logout
- File upload section
- File listing with pagination
- File statistics and analytics

## 🔧 Backend Structure

### Models

#### User Model
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  createdAt: { type: Date, default: Date.now }
}
```

#### File Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true },
  url: { type: String, required: true },
  public_id: String,
  format: String,
  size: Number,
  tags: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
}
```

### Middleware

#### Authentication Middleware
- Validates JWT tokens
- Attaches user object to request
- Handles token expiration
- Protects routes from unauthorized access

### Controllers

#### Auth Controller
Handles user registration, login, and profile management with comprehensive error handling.

#### File Upload Controller
Manages file operations with Cloudinary integration and email notifications.

## 🚀 Deployment

### Backend Deployment (Heroku)

1. **Create Heroku App**
```bash
heroku create storagify-backend
```

2. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set DB_URL=your_mongodb_uri
heroku config:set CLOUDINARY_URL=cloudinary://key:secret@cloud_name
```

3. **Deploy**
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm i -g vercel
vercel
```

3. **Configure environment variables in deployment platform**

### Environment Variables for Production

```env
# Production .env
NODE_ENV=production
PORT=5000
DB_URL=your_production_mongodb_uri
JWT_SECRET=strong_production_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
EMAIL_USER=production_email@gmail.com
EMAIL_PASS=production_app_password
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Invalid token received from server"
**Problem:** Frontend receives malformed or missing JWT token.

**Solution:**
```javascript
// Update Login.jsx handleSubmit
const token = response.data.token || response.data.data?.token;
if (!token) {
  toast.error("No authentication token received");
  return;
}
```

#### 2. File Upload Fails
**Problem:** Files not uploading to Cloudinary.

**Solution Checklist:**
- Verify Cloudinary credentials in .env
- Check file size (max 50MB)
- Ensure express-fileupload middleware is configured
- Verify temp directory permissions

#### 3. Email Not Sending
**Problem:** No email notifications.

**Solution:**
- Verify Gmail app password
- Check spam folder
- Enable less secure apps in Gmail (if not using app passwords)
- Check NodeMailer configuration

#### 4. Database Connection Issues
**Problem:** Cannot connect to MongoDB.

**Solution:**
```bash
# Start MongoDB locally
mongod

# Or check Atlas connection string
mongodb+srv://username:password@cluster.mongodb.net/database
```

### Development Commands

```bash
# Backend
npm run dev        # Start development server
npm test           # Run tests
npm run lint       # Lint code

# Frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'Add some amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudinary](https://cloudinary.com) for cloud storage services
- [Tailwind CSS](https://tailwindcss.com) for the CSS framework
- [MongoDB](https://mongodb.com) for the database
- [React](https://reactjs.org) for the frontend library

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

Built with ❤️ by eRubaiyat

*If you find this project helpful, please give it a ⭐ on GitHub!*
