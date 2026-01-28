# Knowledge Portal LMS - Frontend

A modern learning management system for the Paysannat L School Network (4 schools, 20,000 students, ~40 teachers).

## Week 1 - MVP Foundation

This is the Week 1 deliverable including:
- Complete project setup with Vite + React
- Authentication system with token management
- Login page with validation
- Protected routes and role-based routing
- Responsive layout with navbar and sidebar
- Role-based dashboard (Admin, Teacher, Student)
- API client with interceptors

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/
│   ├── common/       # Reusable components (Button, Input, Card, etc.)
│   └── layout/       # Layout components (Navbar, Sidebar, Layout)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── routes/           # Route guards (ProtectedRoute, RoleRoute)
├── store/            # Zustand stores
├── utils/            # Utilities and constants
├── App.jsx           # Main app with routes
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` if needed:
```
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Features Implemented

### Authentication
- Login with email and password
- Remember me functionality
- Token-based authentication (JWT)
- Automatic token refresh on 401
- Secure token storage in localStorage
- Protected routes

### User Roles
- **Admin**: Full access to user management, schools, and all courses
- **Teacher**: Access to courses, grading, and students
- **Student**: Access to courses, assignments, and grades

### UI Components
- Responsive design (mobile-first)
- Clean, accessible interface
- Loading states and error handling
- Role-based navigation
- User dropdown menu

### Layout
- Fixed navbar with user info
- Collapsible sidebar (hamburger on mobile)
- Role-based navigation items
- Active route highlighting

## API Endpoints Used

```
POST   /api/auth/login      - Login
POST   /api/auth/logout     - Logout
POST   /api/auth/refresh    - Refresh token
GET    /api/auth/me         - Get current user
PUT    /api/auth/password   - Change password
```

## Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps (Week 2-4)

- Course management (CRUD)
- User management for admins
- Assignment creation and submission
- Grading system
- File uploads
- Real-time notifications
- Progress tracking
- Reports and analytics

## Notes

- Placeholder pages show "Coming Soon" for Week 2-4 features
- All routes are protected and require authentication
- Token refresh happens automatically on 401 errors
- Network errors are handled gracefully

## License

Copyright © 2026 Paysannat L School Network
