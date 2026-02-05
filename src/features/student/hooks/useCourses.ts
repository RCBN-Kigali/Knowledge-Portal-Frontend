import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'
import type { Course, PaginatedResponse, CourseCategory, DifficultyLevel } from '../../../types'

// Mock course data
const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Mathematics',
    description: 'Learn fundamental mathematical concepts including algebra, geometry, and basic calculus. This course is designed for beginners and covers essential topics needed for further studies.',
    thumbnailUrl: '',
    category: 'mathematics',
    difficulty: 'beginner',
    teacher: { id: 't1', name: 'Prof. Uwimana', avatarUrl: '', bio: 'Mathematics teacher with 10 years experience', schoolId: 'school-1', schoolName: 'Paysannat A', courseCount: 5 },
    isPublic: true,
    schoolId: null,
    studentCount: 245,
    rating: 4.5,
    ratingCount: 89,
    moduleCount: 5,
    lessonCount: 24,
    estimatedHours: 12,
    whatYouLearn: ['Basic algebra', 'Geometry fundamentals', 'Problem solving skills'],
    requirements: ['No prior knowledge required'],
    createdAt: '2024-01-15',
  },
  {
    id: 'course-2',
    title: 'Biology Fundamentals',
    description: 'Explore the basics of life sciences, from cells to ecosystems. Understand how living organisms function and interact with their environment.',
    thumbnailUrl: '',
    category: 'science',
    difficulty: 'beginner',
    teacher: { id: 't2', name: 'Dr. Mugabo', avatarUrl: '', bio: 'Biology specialist', schoolId: 'school-1', schoolName: 'Paysannat A', courseCount: 3 },
    isPublic: true,
    schoolId: null,
    studentCount: 189,
    rating: 4.7,
    ratingCount: 56,
    moduleCount: 6,
    lessonCount: 30,
    estimatedHours: 15,
    whatYouLearn: ['Cell biology', 'Human anatomy basics', 'Ecology'],
    requirements: ['Basic reading skills'],
    createdAt: '2024-02-01',
  },
  {
    id: 'course-3',
    title: 'English Language Skills',
    description: 'Improve your English reading, writing, and speaking abilities. Perfect for students looking to enhance their communication skills.',
    thumbnailUrl: '',
    category: 'languages',
    difficulty: 'intermediate',
    teacher: { id: 't3', name: 'Mrs. Nyirahabimana', avatarUrl: '', bio: 'English language instructor', schoolId: 'school-2', schoolName: 'Paysannat B', courseCount: 4 },
    isPublic: true,
    schoolId: null,
    studentCount: 312,
    rating: 4.3,
    ratingCount: 124,
    moduleCount: 8,
    lessonCount: 40,
    estimatedHours: 20,
    whatYouLearn: ['Grammar mastery', 'Essay writing', 'Conversation skills'],
    requirements: ['Basic English knowledge'],
    createdAt: '2024-01-20',
  },
  {
    id: 'course-4',
    title: 'Advanced Physics',
    description: 'Deep dive into mechanics, thermodynamics, and electromagnetism. For students ready to tackle complex physics concepts.',
    thumbnailUrl: '',
    category: 'science',
    difficulty: 'advanced',
    teacher: { id: 't1', name: 'Prof. Uwimana', avatarUrl: '', schoolId: 'school-1', schoolName: 'Paysannat A', courseCount: 5 },
    isPublic: false,
    schoolId: 'school-1',
    studentCount: 67,
    rating: 4.8,
    ratingCount: 23,
    moduleCount: 10,
    lessonCount: 50,
    estimatedHours: 30,
    whatYouLearn: ['Classical mechanics', 'Thermodynamics', 'Electromagnetic theory'],
    requirements: ['Introduction to Mathematics', 'Basic physics knowledge'],
    createdAt: '2024-03-01',
  },
  {
    id: 'course-5',
    title: 'Agricultural Science',
    description: 'Learn modern farming techniques, crop management, and sustainable agriculture practices relevant to Rwanda.',
    thumbnailUrl: '',
    category: 'agriculture',
    difficulty: 'beginner',
    teacher: { id: 't4', name: 'Mr. Habimana', avatarUrl: '', bio: 'Agricultural expert', schoolId: 'school-2', schoolName: 'Paysannat B', courseCount: 2 },
    isPublic: false,
    schoolId: 'school-2',
    studentCount: 156,
    rating: 4.6,
    ratingCount: 45,
    moduleCount: 7,
    lessonCount: 35,
    estimatedHours: 18,
    whatYouLearn: ['Crop rotation', 'Soil management', 'Sustainable practices'],
    requirements: ['Interest in agriculture'],
    createdAt: '2024-02-15',
  },
  {
    id: 'course-6',
    title: 'Computer Basics',
    description: 'Introduction to computers, basic software applications, and internet usage. Essential digital literacy for all students.',
    thumbnailUrl: '',
    category: 'technology',
    difficulty: 'beginner',
    teacher: { id: 't5', name: 'Mr. Niyonzima', avatarUrl: '', schoolId: 'school-1', schoolName: 'Paysannat A', courseCount: 3 },
    isPublic: true,
    schoolId: null,
    studentCount: 423,
    rating: 4.4,
    ratingCount: 167,
    moduleCount: 4,
    lessonCount: 20,
    estimatedHours: 10,
    whatYouLearn: ['Computer basics', 'Microsoft Office', 'Internet safety'],
    requirements: ['No prior experience needed'],
    createdAt: '2024-01-10',
  },
  {
    id: 'course-7',
    title: 'Kinyarwanda Literature',
    description: 'Explore Rwandan literary traditions, poetry, and contemporary writings. Celebrate our cultural heritage through literature.',
    thumbnailUrl: '',
    category: 'languages',
    difficulty: 'intermediate',
    teacher: { id: 't6', name: 'Mme. Mukamana', avatarUrl: '', schoolId: 'school-1', schoolName: 'Paysannat A', courseCount: 2 },
    isPublic: false,
    schoolId: 'school-1',
    studentCount: 89,
    rating: 4.9,
    ratingCount: 34,
    moduleCount: 6,
    lessonCount: 28,
    estimatedHours: 14,
    whatYouLearn: ['Traditional poetry', 'Modern literature', 'Critical analysis'],
    requirements: ['Fluent in Kinyarwanda'],
    createdAt: '2024-02-20',
  },
  {
    id: 'course-8',
    title: 'Health & Nutrition',
    description: 'Learn about balanced diets, disease prevention, and maintaining good health. Practical knowledge for everyday life.',
    thumbnailUrl: '',
    category: 'health',
    difficulty: 'beginner',
    teacher: { id: 't7', name: 'Dr. Ingabire', avatarUrl: '', bio: 'Public health specialist', schoolId: 'school-2', schoolName: 'Paysannat B', courseCount: 2 },
    isPublic: true,
    schoolId: null,
    studentCount: 278,
    rating: 4.5,
    ratingCount: 92,
    moduleCount: 5,
    lessonCount: 25,
    estimatedHours: 12,
    whatYouLearn: ['Nutrition basics', 'Disease prevention', 'Healthy lifestyle'],
    requirements: ['None'],
    createdAt: '2024-03-05',
  },
]

export interface CourseFilters {
  tab?: 'all' | 'school' | 'public'
  search?: string
  category?: CourseCategory
  difficulty?: DifficultyLevel
  page?: number
  perPage?: number
}

export function useCourses(filters: CourseFilters = {}) {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['courses', filters, user?.schoolId],
    queryFn: async (): Promise<PaginatedResponse<Course>> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let filtered = [...MOCK_COURSES]
      
      // Filter by tab
      if (filters.tab === 'school') {
        // Show only courses from user's school (private courses)
        filtered = filtered.filter(c => c.schoolId === user?.schoolId)
      } else if (filters.tab === 'public') {
        // Show only public courses
        filtered = filtered.filter(c => c.isPublic)
      } else {
        // 'all' - show public courses + user's school private courses
        filtered = filtered.filter(c => c.isPublic || c.schoolId === user?.schoolId)
      }
      
      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.teacher.name.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by category
      if (filters.category) {
        filtered = filtered.filter(c => c.category === filters.category)
      }
      
      // Filter by difficulty
      if (filters.difficulty) {
        filtered = filtered.filter(c => c.difficulty === filters.difficulty)
      }
      
      // Pagination
      const page = filters.page || 1
      const perPage = filters.perPage || 12
      const start = (page - 1) * perPage
      const end = start + perPage
      const paginated = filtered.slice(start, end)
      
      return {
        data: paginated,
        pagination: {
          page,
          perPage,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / perPage),
        },
      }
    },
  })
}

export function useEnroll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (courseId: string) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return { id: `enrollment-${courseId}`, courseId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['studentDashboard'] })
    },
  })
}

// Export mock courses for use in other hooks
export { MOCK_COURSES }
