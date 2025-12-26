# Visionise - Project Management Platform

![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5+-purple?style=flat-square&logo=vite)
![Node](https://img.shields.io/badge/Node-16+-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green?style=flat-square&logo=mongodb)
![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)

## 📋 About the Project

**Visionise** is a modern and intuitive project management platform that enables teams to collaborate effectively. It offers a complete view of tasks, team members, and project progress with advanced visualizations (Gantt, Kanban, Scrum).

### Key Features

✅ **Authentication & User Profile**
- Secure sign up and sign in
- Personal profile management
- JWT-based authentication
- Password encryption with bcrypt

✅ **Project Management**
- Create, edit, delete projects
- Multiple management methods (Kanban, Scrum, Waterfall)
- Detailed view with title and description
- Global project progress bar
- Team member management

✅ **Task Management**
- Create and edit tasks
- Multiple statuses: Not Started, In Progress, Completed, Cancelled, Reported
- Priority levels: Low, Normal, High, Critical
- Task types: Normal, Critical, Blocking, Enhancement
- Individual progress bars
- Start and end dates
- Assign responsible members

✅ **Advanced Visualizations**
- 📊 **Gantt Chart**: Visual timeline of tasks with dates
- 🎯 **Kanban Board**: Organization by status columns with drag & drop
- 🔄 **Scrum Board**: Sprint management and workload tracking

✅ **Design & Accessibility**
- 🎨 Elegant pastel color palette (beige/green)
- 📱 Responsive design (mobile, tablet, desktop)
- 🌙 Clean and modern UI
- ✨ Smooth transitions and animations

---

## 🏗️ Project Architecture

This project follows a **client-server architecture** with a clear separation between frontend and backend:

```
Visionise/
├── 📁 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.jsx       # Navigation with profile dropdown
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── GanttChart.jsx   # Gantt visualization
│   │   │   ├── KanbanBoard.jsx  # Kanban board with drag & drop
│   │   │   └── ScrumBoard.jsx   # Scrum board visualization
│   │   │
│   │   ├── pages/               # Main application pages
│   │   │   ├── Home.jsx         # Landing/dashboard page
│   │   │   ├── SignIn.jsx       # Login page
│   │   │   ├── SignUp.jsx       # Registration page
│   │   │   ├── Profile.jsx      # User profile view
│   │   │   ├── EditProfile.jsx  # Profile editing
│   │   │   └── Project.jsx      # Project detail page
│   │   │
│   │   ├── services/            # API communication layer
│   │   │   ├── api.js           # Axios instance & config
│   │   │   ├── auth.js          # Authentication API calls
│   │   │   ├── projects.js      # Project API calls
│   │   │   └── tasks.js         # Task API calls
│   │   │
│   │   ├── context/             # Global state management
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   │
│   │   ├── App.jsx              # Main app component & routing
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   │
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── package.json             # Frontend dependencies
│   └── .env                     # Frontend environment variables
│
└── 📁 Backend (Node.js + Express + MongoDB)
    ├── server/
    │   ├── controllers/         # Request handlers (business logic)
    │   │   ├── auth.js          # Authentication logic
    │   │   ├── projects.js      # Project CRUD operations
    │   │   └── tasks.js         # Task CRUD operations
    │   │
    │   ├── models/              # MongoDB schemas
    │   │   ├── User.js          # User model (email, password, profile)
    │   │   ├── Project.js       # Project model (title, description, method)
    │   │   └── Task.js          # Task model (title, status, dates, progress)
    │   │
    │   ├── middleware/          # Express middleware
    │   │   └── auth.js          # JWT verification middleware
    │   │
    │   ├── scripts/             # Utility scripts
    │   │   └── addManagementMethodToProjects.js  # Migration script
    │   │
    │   ├── server.js            # Express server entry point
    │   ├── config.js            # Server configuration
    │   ├── package.json         # Backend dependencies
    │   ├── .env                 # Backend environment variables
    │   └── requirements.txt     # Python dependencies (if needed)
    │
    ├── README.md                # This file
    └── .gitignore               # Git ignore rules
```

### Architecture Explanation

#### 🎨 Frontend (React + Vite)

**Location**: Root directory (`/`)

The frontend is a **Single Page Application (SPA)** built with React and Vite:

- **Components**: Reusable UI pieces (Header, Footer, Charts, Boards)
- **Pages**: Full page views corresponding to routes
- **Services**: API communication layer using Axios
- **Context**: Global state management for authentication
- **Port**: `5173` (Vite development server)

**Data Flow**:
```
User Action → React Component → Service (API call) → Backend API
                     ↓
              State Update (Context/useState)
                     ↓
              UI Re-render
```

#### 🔧 Backend (Node.js + Express)

**Location**: `/server` directory

The backend is a **RESTful API** built with Express.js and MongoDB:

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define data structure (Mongoose schemas)
- **Middleware**: Request processing (authentication, validation)
- **Port**: `5000` (Express server)

**Data Flow**:
```
HTTP Request → Express Router → Middleware (Auth) → Controller
                                                         ↓
                                                   MongoDB Query
                                                         ↓
                                              Response ← JSON Data
```

### Communication Between Frontend & Backend

```
┌─────────────────────┐         HTTP/HTTPS        ┌──────────────────────┐
│                     │      (JSON REST API)      │                      │
│   FRONTEND          │ ←─────────────────────→  │   BACKEND            │
│   (React + Vite)    │                           │   (Express + Node)   │
│   Port: 5173        │                           │   Port: 5000         │
│                     │                           │                      │
└─────────────────────┘                           └──────────────────────┘
                                                             ↓
                                                    ┌─────────────────┐
                                                    │   MongoDB       │
                                                    │   (Atlas)       │
                                                    │   Database      │
                                                    └─────────────────┘
```

**API Endpoints**:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/tasks` - Get project tasks
- `POST /api/projects/:id/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18+ | UI component framework |
| **React Router DOM** | 6+ | Client-side routing |
| **Axios** | ^1.6.0 | HTTP client for API calls |
| **Context API** | Native | Global state management |
| **CSS3** | Native | Styling with modern features |
| **Vite** | 5+ | Fast build tool and dev server |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 16+ | JavaScript runtime |
| **Express** | ^4.18.0 | Web framework |
| **MongoDB** | 6+ | NoSQL database |
| **Mongoose** | ^8.0.0 | MongoDB ODM |
| **JWT** | ^9.0.0 | Authentication tokens |
| **bcryptjs** | ^2.4.3 | Password hashing |
| **dotenv** | ^16.0.0 | Environment variables |
| **cors** | ^2.8.5 | Cross-origin requests |

## 📁 Detailed File Structure

### Frontend Files (`/src`)

#### **Components** (`src/components/`)

| File | Purpose | Key Features |
|---|---|---|
| `Header.jsx` | Main navigation bar | Profile dropdown, logout, responsive menu |
| `Header.css` | Navigation styling | Pastel color palette, hover effects |
| `Footer.jsx` | Page footer | Copyright, links |
| `Footer.css` | Footer styling | Fixed bottom position |
| `GanttChart.jsx` | Timeline visualization | Date axis, task bars by status, legend |
| `GanttChart.css` | Gantt styling | Pastel task colors (#D4C5B9, #C9E9D4, #D4DFF5) |
| `KanbanBoard.jsx` | Kanban view | Drag & drop, priority badges, progress bars |
| `KanbanBoard.css` | Kanban styling | Card layout, priority colors, animations |
| `ScrumBoard.jsx` | Scrum sprint view | Sprint columns, task dates, assignees |
| `ScrumBoard.css` | Scrum styling | Column layout, date formatting |

#### **Pages** (`src/pages/`)

| File | Route | Purpose | State Management |
|---|---|---|---|
| `Home.jsx` | `/` | Landing page | None |
| `Home.css` | - | Landing styling | - |
| `SignIn.jsx` | `/signin` | Login form | AuthContext |
| `SignIn.css` | - | Login styling | - |
| `SignUp.jsx` | `/signup` | Registration form | AuthContext |
| `SignUp.css` | - | Registration styling | - |
| `Profile.jsx` | `/profile` | User dashboard | Projects list from API |
| `Profile.css` | - | Dashboard styling | - |
| `EditProfile.jsx` | `/edit-profile` | Profile editing | AuthContext |
| `EditProfile.css` | - | Edit form styling | - |
| `Project.jsx` | `/project/:id` | Project details | Tasks, members, management method |
| `Project.css` | - | Project page styling | Modal, tabs, forms |

#### **Services** (`src/services/`)

| File | Purpose | Exports |
|---|---|---|
| `api.js` | Axios instance configuration | `api` (axios with baseURL, interceptors) |
| `auth.js` | Authentication API calls | `signup()`, `signin()` |
| `projects.js` | Project API calls | `getProjects()`, `createProject()`, `updateProject()`, `deleteProject()`, `addMember()` |
| `tasks.js` | Task API calls | `getTasks()`, `createTask()`, `updateTask()`, `deleteTask()` |

#### **Context** (`src/context/`)

| File | Purpose | Provides |
|---|---|---|
| `AuthContext.jsx` | Global authentication state | `user`, `isSignedIn`, `signUp()`, `signIn()`, `logout()` |

### Backend Files (`/server`)

#### **Controllers** (`server/controllers/`)

| File | Handles | Endpoints |
|---|---|---|
| `auth.js` | User authentication | `POST /api/auth/signup`, `POST /api/auth/signin` |
| `projects.js` | Project operations | `GET/POST/PUT/DELETE /api/projects`, `POST /api/projects/:id/members` |
| `tasks.js` | Task operations | `GET /api/projects/:id/tasks`, `POST/PUT/DELETE /api/tasks/:id` |

#### **Models** (`server/models/`)

| File | Schema | Fields |
|---|---|---|
| `User.js` | User document | `email`, `password` (hashed), `firstName`, `lastName`, `profession`, `birthDate` |
| `Project.js` | Project document | `title`, `description`, `owner`, `members[]`, `managementMethod` (Kanban/Scrum/Waterfall) |
| `Task.js` | Task document | `title`, `description`, `status`, `priority`, `type`, `assignedTo`, `startDate`, `endDate`, `progress`, `project` |

#### **Middleware** (`server/middleware/`)

| File | Purpose | Usage |
|---|---|---|
| `auth.js` | JWT verification | Protects routes, extracts user from token |

#### **Scripts** (`server/scripts/`)

| File | Purpose | Usage |
|---|---|---|
| `addManagementMethodToProjects.js` | Database migration | Adds `managementMethod` field to existing projects |

#### **Configuration** (`server/`)

| File | Purpose | Contains |
|---|---|---|
| `server.js` | Express app entry point | Routes, middleware, MongoDB connection, server startup |
| `config.js` | Configuration constants | Port, MongoDB URI, JWT secret |
| `package.json` | Backend dependencies | Express, Mongoose, JWT, bcrypt, cors, dotenv |
| `.env` | Environment variables | `MONGODB_URI`, `JWT_SECRET`, `PORT` |

---

## 🔐 Authentication Flow

### Registration Process

```
User fills SignUp form
        ↓
SignUp.jsx calls auth.signup()
        ↓
POST /api/auth/signup
        ↓
auth.js controller:
  - Validates email format
  - Hashes password (bcryptjs)
  - Creates User document
  - Generates JWT token
        ↓
Returns: { token, user: { email, firstName, lastName } }
        ↓
AuthContext saves to localStorage
        ↓
Redirect to /profile
```

### Login Process

```
User enters credentials
        ↓
SignIn.jsx calls auth.signin()
        ↓
POST /api/auth/signin
        ↓
auth.js controller:
  - Finds user by email
  - Compares password hash
  - Generates JWT token
        ↓
Returns: { token, user }
        ↓
AuthContext saves to localStorage
        ↓
Redirect to /profile
```

### Protected Routes

```
User requests project data
        ↓
services/api.js adds Authorization header
        ↓
GET /api/projects (with JWT token)
        ↓
middleware/auth.js:
  - Verifies JWT signature
  - Extracts user ID
  - Attaches to req.user
        ↓
Controller accesses req.user
        ↓
Returns filtered data
```

---

## 📊 Data Models

### User Schema

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  profession: String,
  birthDate: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Project Schema

```javascript
{
  title: String (required),
  description: String,
  owner: String (email, required),
  members: [String] (emails array),
  managementMethod: Enum ['Kanban', 'Scrum', 'Waterfall'],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task Schema

```javascript
{
  title: String (required),
  description: String,
  project: ObjectId (ref: Project),
  status: Enum ['Not Started', 'In Progress', 'Completed', 'Cancelled', 'Reported'],
  priority: Enum ['Low', 'Normal', 'High', 'Critical'],
  type: Enum ['Normal', 'Critical', 'Blocking', 'Enhancement'],
  assignedTo: String (email),
  startDate: Date,
  endDate: Date,
  progress: Number (0-100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🎨 Color Palette

### Pastel Theme

| Color | Hex | Usage |
|---|---|---|
| **Beige** | `#D4C5B9` | Not Started tasks, neutral backgrounds |
| **Green** | `#C9E9D4` | In Progress tasks, success states |
| **Blue** | `#D4DFF5` | Completed tasks, informational |
| **Red** | `#F5D4D4` | Cancelled tasks, error states |
| **Orange** | `#F5E6D4` | Reported tasks, warnings |

### Priority Colors

| Priority | Color | Badge Style |
|---|---|---|
| **Low** | Blue | `background: #e3f2fd` |
| **Normal** | Green | `background: #e8f5e9` |
| **High** | Orange | `background: #fff3e0` |
| **Critical** | Red | `background: #ffebee` |

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)

### Environment Variables

#### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/visionise
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/HARRABIInes/Visionize-Final.git
cd Visionise
```

#### 2. Install Frontend Dependencies

```bash
npm install
```

#### 3. Start Frontend Development Server

```bash
npm run dev
```

Access at `http://localhost:5173`

#### 4. Install Backend Dependencies

```bash
cd server
npm install
```

#### 5. Configure Environment Variables

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_minimum_32_characters
NODE_ENV=development
```

#### 6. Run Database Migration (if needed)

```bash
cd server
node scripts/addManagementMethodToProjects.js
```

#### 7. Start Backend Server

```bash
# From server/ directory
node server.js
```

Server runs on `http://localhost:5000`

#### 8. Run Both Servers Simultaneously

**Terminal 1** (Frontend):
```bash
npm run dev
```

**Terminal 2** (Backend):
```bash
cd server
node server.js
```

---

## 📡 API Reference

### Authentication Endpoints

#### Register New User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "profession": "Developer",
  "birthDate": "1990-01-01"
}

Response: 201 Created
{
  "token": "jwt_token_here",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login User

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "jwt_token_here",
  "user": { ...userDetails }
}
```

### Project Endpoints

#### Get All User Projects

```http
GET /api/projects
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "project_id",
    "title": "My Project",
    "description": "Project description",
    "owner": "user@example.com",
    "members": ["member1@example.com"],
    "managementMethod": "Kanban"
  }
]
```

#### Create New Project

```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "managementMethod": "Scrum"
}

Response: 201 Created
{
  "_id": "new_project_id",
  ...projectData
}
```

#### Update Project

```http
PUT /api/projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}

Response: 200 OK
{
  ...updatedProjectData
}
```

#### Delete Project

```http
DELETE /api/projects/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Project deleted successfully"
}
```

#### Add Member to Project

```http
POST /api/projects/:id/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newmember@example.com"
}

Response: 200 OK
{
  ...updatedProjectData
}
```

### Task Endpoints

#### Get Project Tasks

```http
GET /api/projects/:projectId/tasks
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "task_id",
    "title": "Task title",
    "status": "In Progress",
    "priority": "High",
    "progress": 50,
    ...taskDetails
  }
]
```

#### Create Task

```http
POST /api/projects/:projectId/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "Not Started",
  "priority": "Normal",
  "type": "Normal",
  "assignedTo": "member@example.com",
  "startDate": "2024-01-01",
  "endDate": "2024-01-15",
  "progress": 0
}

Response: 201 Created
{
  "_id": "new_task_id",
  ...taskData
}
```

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "In Progress",
  "progress": 50
}

Response: 200 OK
{
  ...updatedTaskData
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Logout functionality
- [ ] Token persistence across page reloads
- [ ] Protected route access (redirect to /signin if not authenticated)

#### Project Management
- [ ] Create new project
- [ ] View projects list in profile
- [ ] Edit project details
- [ ] Delete project
- [ ] Add members by email
- [ ] Switch management method (Kanban/Scrum/Waterfall)

#### Task Management
- [ ] Create task with all fields
- [ ] Update task status
- [ ] Change task priority
- [ ] Edit task progress
- [ ] Assign task to member
- [ ] Delete task
- [ ] View tasks in Gantt chart
- [ ] View tasks in Kanban board
- [ ] View tasks in Scrum board

#### UI/UX
- [ ] Responsive design on mobile
- [ ] Form validation errors display
- [ ] Loading states
- [ ] Success/error notifications
- [ ] Navigation between pages
- [ ] Profile editing

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend cannot connect to backend

**Problem**: Axios requests fail with network error

**Solution**:
1. Check backend is running: `http://localhost:5000/api/projects`
2. Verify `VITE_API_URL` in frontend `.env`
3. Check CORS configuration in `server/server.js`

#### JWT token invalid

**Problem**: "Invalid token" error on protected routes

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Sign in again
3. Check `JWT_SECRET` in backend `.env`

#### MongoDB connection failed

**Problem**: "MongoServerError: Authentication failed"

**Solution**:
1. Verify MongoDB URI in `server/.env`
2. Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for development)
3. Ensure database user has correct permissions

#### Tasks not displaying in boards

**Problem**: Tasks exist but don't show in Kanban/Scrum/Gantt

**Solution**:
1. Check task status matches English enum values
2. Run migration: `node server/scripts/addManagementMethodToProjects.js`
3. Verify project has correct `managementMethod` field

#### Server crashes on startup

**Problem**: "Cannot find module" or port already in use

**Solution**:
1. Run `npm install` in server directory
2. Kill process using port 5000: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
3. Check all dependencies are installed

---

## 🔧 Development Scripts

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend

```bash
# Start server
node server.js

# Start with nodemon (auto-restart)
npm run dev

# Run migration script
node scripts/addManagementMethodToProjects.js
```

---

## 📂 Project Structure Summary

```
Frontend (React + Vite)
├── UI Components (Header, Footer, Charts, Boards)
├── Pages (Home, Auth, Profile, Projects)
├── Services (API communication with Axios)
├── Context (Global authentication state)
└── Assets (Images, CSS)

Backend (Node.js + Express)
├── Controllers (Business logic)
├── Models (MongoDB schemas)
├── Middleware (Authentication)
├── Scripts (Database utilities)
└── Configuration (Environment, routes)

Database (MongoDB Atlas)
├── users collection
├── projects collection
└── tasks collection
```

---

## 🤝 Contributing

### Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Code Style

- **React**: Functional components with hooks
- **JavaScript**: ES6+ syntax
- **CSS**: Vanilla CSS with BEM naming convention
- **Commits**: Descriptive messages in present tense

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Ines HARRABI** - [GitHub](https://github.com/HARRABIInes)

---

## 🙏 Acknowledgments

- React team for amazing framework
- MongoDB for flexible database
- Vite for blazing fast build tool
- Express.js for backend simplicity
- Open source community

---

## 📧 Contact

For questions or support, please contact: [GitHub Issues](https://github.com/HARRABIInes/Visionize-Final/issues)

---

**Made with ❤️ using React, Node.js, Express, and MongoDB**
