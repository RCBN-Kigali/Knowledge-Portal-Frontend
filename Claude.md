You are building the frontend for Knowledge Portal LMS - a learning management system for the Paysannat L School Network (4 schools, 20,000 students, ~40 teachers). This is Week 1 of a 4-week MVP sprint.

## Tech Stack
- React 18 with Vite
- React Query for server state
- Zustand for client state
- Tailwind CSS for styling
- React Router v6 for routing

## Week 1 Deliverables
1. Project setup with proper structure
2. Authentication context and token management
3. Login page
4. Basic navigation/layout component
5. Protected route wrapper
6. API client setup with interceptors

## Project Structure
frontend/
├── src/
│   ├── main.jsx                # App entry point
│   ├── App.jsx                 # Routes and providers
│   ├── api/                    # API client
│   │   ├── client.js           # Axios instance with interceptors
│   │   └── auth.js             # Auth API calls
│   ├── components/
│   │   ├── common/             # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Alert.jsx
│   │   └── layout/
│   │       ├── Layout.jsx      # Main layout with nav
│   │       ├── Navbar.jsx      # Top navigation
│   │       └── Sidebar.jsx     # Side navigation (role-based)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx       # Role-based dashboard shell
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   └── useAuth.js          # Auth hook
│   ├── store/
│   │   └── authStore.js        # Zustand auth store
│   ├── utils/
│   │   ├── constants.js        # App constants
│   │   └── helpers.js          # Utility functions
│   └── routes/
│       ├── ProtectedRoute.jsx  # Auth guard
│       └── RoleRoute.jsx       # Role-based guard
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
## Backend API (already built)
The backend runs at http://localhost:8000 with these Week 1 endpoints:

### Authentication
- POST /api/auth/login - Body: {email, password} → Returns: {access_token, refresh_token, user}
- POST /api/auth/refresh - Body: {refresh_token} → Returns: {access_token}
- POST /api/auth/logout - Header: Authorization Bearer token
- GET /api/auth/me - Header: Authorization Bearer token → Returns: user object
- PUT /api/auth/password - Body: {current_password, new_password}

### User Object Shape
```javascript
{
  id: "string",
  email: "string",
  full_name: "string",
  role: "student" | "teacher" | "admin",
  school_id: "string",
  profile_image: "string | null",
  is_active: true,
  last_login: "datetime | null"
}
```

## User Roles & What They See
- **Admin**: Full dashboard with user management, all courses, announcements
- **Teacher**: My courses, create course, grading queue, my students
- **Student**: My courses, available courses, my grades, assignments due

## UI/UX Requirements
1. **Responsive**: Mobile-first, works on phones and desktops
2. **Low-bandwidth friendly**: Minimal assets, fast loading
3. **Clean and simple**: Education-focused, not cluttered
4. **Accessible**: Proper labels, keyboard navigation, sufficient contrast

## Styling Guidelines (Tailwind)
- Primary color: Blue (blue-600)
- Success: Green (green-600)
- Warning: Yellow (yellow-500)
- Error: Red (red-600)
- Background: Gray-50
- Cards: White with subtle shadow
- Text: Gray-900 primary, Gray-600 secondary

## Login Page Requirements
- Clean centered card design
- Email and password fields with validation
- "Remember me" checkbox (stores email in localStorage)
- Loading state on submit button
- Error display for invalid credentials
- Redirect to dashboard on success

## Navigation Requirements
### Top Navbar
- Logo/App name on left
- User dropdown on right (name, role badge, logout)

### Sidebar (collapsible on mobile)
Show menu items based on role:

**Admin sees:**
- Dashboard
- Users (with sub-items: Teachers, Students)
- Schools
- All Courses
- Announcements

**Teacher sees:**
- Dashboard  
- My Courses
- Grading
- My Students
- Announcements

**Student sees:**
- Dashboard
- My Courses
- Browse Courses
- My Grades
- Announcements

## Auth Store (Zustand) Shape
```javascript
{
  user: null | UserObject,
  accessToken: null | string,
  refreshToken: null | string,
  isAuthenticated: boolean,
  isLoading: boolean,
  
  // Actions
  login: (email, password) => Promise,
  logout: () => void,
  refreshAccessToken: () => Promise,
  setUser: (user) => void,
  checkAuth: () => Promise, // Check token validity on app load
}
```

## API Client Requirements
- Axios instance with baseURL from env
- Request interceptor: Attach Authorization header if token exists
- Response interceptor: Handle 401 by attempting token refresh, then retry
- If refresh fails, logout user and redirect to login
- Handle network errors gracefully

## Environment Variables (.env.example)
VITE_API_URL=http://localhost:8000


## Package.json Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## Implementation Notes
1. Store tokens in localStorage for persistence across refreshes
2. On app load, check if tokens exist and validate with /api/auth/me
3. Use React Query for server state (will be used more in Week 2+)
4. Dashboard page can be a simple welcome message with role-appropriate cards for now
5. Navigation should highlight current route
6. Mobile: Sidebar becomes hamburger menu
7. Add proper loading and error states everywhere

## Design Reference
Keep it simple and functional. Think "Google Classroom meets simple admin panel". No fancy animations, focus on usability and speed.

Please implement the complete Week 1 frontend. Start with project setup and config, then auth store, API client, and finally the pages/components. Ensure responsive design and proper error handling throughout.