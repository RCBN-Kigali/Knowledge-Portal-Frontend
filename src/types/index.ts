export type UserRole = 'super_admin' | 'school_admin' | 'school_teacher' | 'school_student' | 'independent_teacher'

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: UserRole
  schoolId: string | null
  schoolName?: string
  avatarUrl?: string
  permissions: string[]
  createdAt?: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

// ─── Domain Types ────────────────────────────────────────────

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseCategory = 'mathematics' | 'science' | 'languages' | 'arts' | 'technology' | 'social_studies' | 'health' | 'agriculture' | 'other'
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed'
export type LessonType = 'lecture' | 'quiz' | 'assignment'
export type SubmissionStatus = 'submitted' | 'graded' | 'returned'

export interface School {
  id: string
  name: string
  location: string
  description?: string
  studentCount?: number
  teacherCount?: number
  logoUrl?: string
}

export interface Teacher {
  id: string
  name: string
  avatarUrl?: string
  bio?: string
  schoolId?: string | null
  schoolName?: string
  courseCount?: number
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  category: CourseCategory
  difficulty: DifficultyLevel
  teacher: Teacher
  isPublic: boolean
  schoolId?: string | null
  studentCount: number
  rating?: number
  ratingCount?: number
  moduleCount: number
  lessonCount: number
  estimatedHours?: number
  whatYouLearn?: string[]
  requirements?: string[]
  createdAt: string
  updatedAt?: string
}

export interface Module {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  type: LessonType
  order: number
  durationMinutes?: number
  isCompleted?: boolean
  content?: LessonContent
}

export interface LessonContent {
  text?: string
  videoUrl?: string
  images?: string[]
}

export interface Enrollment {
  id: string
  courseId: string
  course: Course
  studentId: string
  status: EnrollmentStatus
  progress: number
  completedLessons: number
  totalLessons: number
  enrolledAt: string
  completedAt?: string
  lastAccessedAt?: string
  currentLessonId?: string
}

export interface Quiz {
  id: string
  lessonId: string
  title: string
  description?: string
  passingScore: number
  timeLimit?: number
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  text: string
  type: 'single_choice' | 'multiple_choice'
  options: QuizOption[]
  correctOptionIds?: string[]
}

export interface QuizOption {
  id: string
  text: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  score: number
  passed: boolean
  answers: QuizAnswer[]
  submittedAt: string
}

export interface QuizAnswer {
  questionId: string
  selectedOptionIds: string[]
  isCorrect?: boolean
}

export interface Assignment {
  id: string
  lessonId: string
  title: string
  instructions: string
  maxScore: number
  allowFileUpload: boolean
  allowTextSubmission: boolean
  dueDate?: string
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  text?: string
  fileUrl?: string
  fileName?: string
  status: SubmissionStatus
  score?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  authorName: string
  authorAvatarUrl?: string
  courseId?: string
  courseName?: string
  isRead: boolean
  createdAt: string
}

export interface StudentDashboardData {
  recentCourse?: Enrollment
  enrolledCourses: Enrollment[]
  upcomingDeadlines: { lessonTitle: string; courseName: string; dueDate: string; type: LessonType }[]
  announcements: Announcement[]
  stats: {
    enrolledCount: number
    completedCount: number
    averageGrade: number
    hoursSpent: number
  }
  schoolCourses?: Course[]
}

export interface StudentProgress {
  overall: {
    enrolledCount: number
    completedCount: number
    averageGrade: number
    totalHours: number
  }
  courses: {
    courseId: string
    courseTitle: string
    progress: number
    grade?: number
    status: EnrollmentStatus
    lastAccessed?: string
  }[]
  gradeHistory: {
    lessonTitle: string
    courseName: string
    type: LessonType
    score: number
    maxScore: number
    date: string
  }[]
}
