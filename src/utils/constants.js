export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  REMEMBER_EMAIL: 'remember_email'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  TEACHERS: '/users/teachers',
  STUDENTS: '/users/students',
  SCHOOLS: '/schools',
  COURSES: '/courses',
  MY_COURSES: '/my-courses',
  BROWSE_COURSES: '/browse-courses',
  GRADING: '/grading',
  MY_STUDENTS: '/my-students',
  MY_GRADES: '/my-grades',
  ANNOUNCEMENTS: '/announcements'
};

export const NAVIGATION_ITEMS = {
  admin: [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    {
      name: 'Users',
      path: ROUTES.USERS,
      icon: '👥',
      children: [
        { name: 'Teachers', path: ROUTES.TEACHERS },
        { name: 'Students', path: ROUTES.STUDENTS }
      ]
    },
    { name: 'Schools', path: ROUTES.SCHOOLS, icon: '🏫' },
    { name: 'All Courses', path: ROUTES.COURSES, icon: '📚' },
    { name: 'Announcements', path: ROUTES.ANNOUNCEMENTS, icon: '📢' }
  ],
  teacher: [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { name: 'My Courses', path: ROUTES.MY_COURSES, icon: '📚' },
    { name: 'Grading', path: ROUTES.GRADING, icon: '✏️' },
    { name: 'My Students', path: ROUTES.MY_STUDENTS, icon: '👥' },
    { name: 'Announcements', path: ROUTES.ANNOUNCEMENTS, icon: '📢' }
  ],
  student: [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { name: 'My Courses', path: ROUTES.MY_COURSES, icon: '📚' },
    { name: 'Browse Courses', path: ROUTES.BROWSE_COURSES, icon: '🔍' },
    { name: 'My Grades', path: ROUTES.MY_GRADES, icon: '📝' },
    { name: 'Announcements', path: ROUTES.ANNOUNCEMENTS, icon: '📢' }
  ]
};
