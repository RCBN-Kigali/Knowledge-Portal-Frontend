import { useQuery } from '@tanstack/react-query'
import type { Course, Module, Lesson } from '../../../types'
import { MOCK_COURSES } from './useCourses'

interface CourseContent extends Course {
  modules: Module[]
}

// Mock lessons for each module
const createLessons = (moduleId: string, count: number, startOrder: number = 1): Lesson[] => {
  const lessonTypes: Array<'lecture' | 'quiz' | 'assignment'> = ['lecture', 'lecture', 'lecture', 'quiz', 'assignment']
  return Array.from({ length: count }, (_, i) => ({
    id: `${moduleId}-lesson-${i + 1}`,
    moduleId,
    title: `Lesson ${startOrder + i}: ${['Introduction', 'Core Concepts', 'Deep Dive', 'Practice Quiz', 'Assignment'][i % 5]}`,
    type: lessonTypes[i % 5],
    order: i + 1,
    durationMinutes: 15 + (i * 5),
    isCompleted: i < 2, // First 2 lessons completed
    content: {
      text: `This is the content for lesson ${startOrder + i}. Here you will learn important concepts and skills.`,
      videoUrl: i % 3 === 0 ? 'https://example.com/video.mp4' : undefined,
    },
  }))
}

// Mock course content data
const MOCK_COURSE_CONTENT: Record<string, CourseContent> = {
  'course-1': {
    ...MOCK_COURSES[0],
    modules: [
      {
        id: 'mod-1-1',
        courseId: 'course-1',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebraic expressions and equations',
        order: 1,
        lessons: [
          { id: 'lesson-1', moduleId: 'mod-1-1', title: 'What is Algebra?', type: 'lecture', order: 1, durationMinutes: 15, isCompleted: true, content: { text: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.' } },
          { id: 'lesson-2', moduleId: 'mod-1-1', title: 'Variables and Constants', type: 'lecture', order: 2, durationMinutes: 20, isCompleted: true, content: { text: 'Variables represent unknown values, while constants are fixed values.' } },
          { id: 'lesson-3', moduleId: 'mod-1-1', title: 'Basic Operations', type: 'lecture', order: 3, durationMinutes: 25, isCompleted: true, content: { text: 'Learn addition, subtraction, multiplication, and division with algebraic terms.' } },
          { id: 'lesson-4', moduleId: 'mod-1-1', title: 'Algebra Basics Quiz', type: 'quiz', order: 4, durationMinutes: 15, isCompleted: true },
        ],
      },
      {
        id: 'mod-1-2',
        courseId: 'course-1',
        title: 'Linear Equations',
        description: 'Solving equations with one variable',
        order: 2,
        lessons: [
          { id: 'lesson-5', moduleId: 'mod-1-2', title: 'Understanding Linear Equations', type: 'lecture', order: 1, durationMinutes: 20, isCompleted: true, content: { text: 'A linear equation is an equation where the highest power of the variable is 1.' } },
          { id: 'lesson-6', moduleId: 'mod-1-2', title: 'Solving Simple Equations', type: 'lecture', order: 2, durationMinutes: 25, isCompleted: true, content: { text: 'Step-by-step methods for solving equations like 2x + 3 = 7.' } },
          { id: 'lesson-7', moduleId: 'mod-1-2', title: 'Word Problems', type: 'lecture', order: 3, durationMinutes: 30, isCompleted: true, content: { text: 'Converting real-world problems into equations.' } },
          { id: 'lesson-8', moduleId: 'mod-1-2', title: 'Practice Problems', type: 'assignment', order: 4, durationMinutes: 45, isCompleted: true, content: { instructions: 'Solve the following 10 linear equations.', submissionType: 'text', totalPoints: 100 } },
        ],
      },
      {
        id: 'mod-1-3',
        courseId: 'course-1',
        title: 'Geometry Basics',
        description: 'Introduction to shapes and measurements',
        order: 3,
        lessons: [
          { id: 'lesson-9', moduleId: 'mod-1-3', title: 'Points, Lines, and Planes', type: 'lecture', order: 1, durationMinutes: 20, isCompleted: true, content: { text: 'The fundamental building blocks of geometry.' } },
          { id: 'lesson-10', moduleId: 'mod-1-3', title: 'Angles and Their Types', type: 'lecture', order: 2, durationMinutes: 25, isCompleted: true, content: { text: 'Acute, obtuse, right, and straight angles.' } },
          { id: 'lesson-11', moduleId: 'mod-1-3', title: 'Triangles', type: 'lecture', order: 3, durationMinutes: 30, isCompleted: true, content: { text: 'Properties of different types of triangles.' } },
          { id: 'lesson-12', moduleId: 'mod-1-3', title: 'Quadrilaterals', type: 'lecture', order: 4, durationMinutes: 25, isCompleted: true, content: { text: 'Squares, rectangles, parallelograms, and more.' } },
          { id: 'lesson-13', moduleId: 'mod-1-3', title: 'Geometry Quiz', type: 'quiz', order: 5, durationMinutes: 20, isCompleted: true },
        ],
      },
      {
        id: 'mod-1-4',
        courseId: 'course-1',
        title: 'Advanced Topics',
        description: 'More complex mathematical concepts',
        order: 4,
        lessons: [
          { id: 'lesson-14', moduleId: 'mod-1-4', title: 'Introduction to Functions', type: 'lecture', order: 1, durationMinutes: 30, isCompleted: true, content: { text: 'Understanding mathematical functions and their graphs.' } },
          { id: 'lesson-15', moduleId: 'mod-1-4', title: 'Graphing Linear Equations', type: 'lecture', order: 2, durationMinutes: 35, isCompleted: true, content: { text: 'How to plot linear equations on a coordinate plane.' } },
          { id: 'lesson-16', moduleId: 'mod-1-4', title: 'Systems of Equations', type: 'lecture', order: 3, durationMinutes: 40, isCompleted: true, content: { text: 'Solving two or more equations simultaneously.' } },
          { id: 'lesson-17', moduleId: 'mod-1-4', title: 'Problem Solving Strategies', type: 'lecture', order: 4, durationMinutes: 30, isCompleted: false, content: { text: 'Techniques for approaching complex math problems.' } },
          { id: 'lesson-18', moduleId: 'mod-1-4', title: 'Mid-Course Assessment', type: 'assignment', order: 5, durationMinutes: 60, isCompleted: false, content: { instructions: 'Complete the comprehensive assessment covering all topics.', submissionType: 'both', totalPoints: 150 } },
        ],
      },
      {
        id: 'mod-1-5',
        courseId: 'course-1',
        title: 'Final Review',
        description: 'Comprehensive review and final exam',
        order: 5,
        lessons: [
          { id: 'lesson-19', moduleId: 'mod-1-5', title: 'Algebra Review', type: 'lecture', order: 1, durationMinutes: 25, isCompleted: false, content: { text: 'Review of all algebra concepts covered.' } },
          { id: 'lesson-20', moduleId: 'mod-1-5', title: 'Geometry Review', type: 'lecture', order: 2, durationMinutes: 25, isCompleted: false, content: { text: 'Review of all geometry concepts covered.' } },
          { id: 'lesson-21', moduleId: 'mod-1-5', title: 'Practice Test', type: 'quiz', order: 3, durationMinutes: 45, isCompleted: false },
          { id: 'lesson-22', moduleId: 'mod-1-5', title: 'Study Tips', type: 'lecture', order: 4, durationMinutes: 15, isCompleted: false, content: { text: 'Tips for preparing for the final exam.' } },
          { id: 'lesson-23', moduleId: 'mod-1-5', title: 'Final Exam', type: 'quiz', order: 5, durationMinutes: 90, isCompleted: false },
          { id: 'lesson-24', moduleId: 'mod-1-5', title: 'Course Completion Project', type: 'assignment', order: 6, durationMinutes: 120, isCompleted: false, content: { instructions: 'Create a comprehensive project demonstrating your understanding.', submissionType: 'both', totalPoints: 200 } },
        ],
      },
    ],
  },
  'course-2': {
    ...MOCK_COURSES[1],
    modules: [
      {
        id: 'mod-2-1',
        courseId: 'course-2',
        title: 'Introduction to Biology',
        description: 'What is biology and why study it',
        order: 1,
        lessons: createLessons('mod-2-1', 5),
      },
      {
        id: 'mod-2-2',
        courseId: 'course-2',
        title: 'Cell Structure',
        description: 'Understanding the basic unit of life',
        order: 2,
        lessons: createLessons('mod-2-2', 6, 6),
      },
      {
        id: 'mod-2-3',
        courseId: 'course-2',
        title: 'Human Body Systems',
        description: 'Overview of major body systems',
        order: 3,
        lessons: createLessons('mod-2-3', 8, 12),
      },
    ],
  },
  'course-3': {
    ...MOCK_COURSES[2],
    modules: [
      {
        id: 'mod-3-1',
        courseId: 'course-3',
        title: 'Grammar Fundamentals',
        description: 'Parts of speech and sentence structure',
        order: 1,
        lessons: createLessons('mod-3-1', 8),
      },
      {
        id: 'mod-3-2',
        courseId: 'course-3',
        title: 'Writing Skills',
        description: 'Paragraphs and essays',
        order: 2,
        lessons: createLessons('mod-3-2', 10, 9),
      },
    ],
  },
  'course-6': {
    ...MOCK_COURSES[5],
    modules: [
      {
        id: 'mod-6-1',
        courseId: 'course-6',
        title: 'Computer Basics',
        description: 'Getting started with computers',
        order: 1,
        lessons: createLessons('mod-6-1', 5),
      },
      {
        id: 'mod-6-2',
        courseId: 'course-6',
        title: 'Microsoft Office',
        description: 'Word, Excel, and PowerPoint',
        order: 2,
        lessons: createLessons('mod-6-2', 8, 6),
      },
    ],
  },
  'course-8': {
    ...MOCK_COURSES[7],
    modules: [
      {
        id: 'mod-8-1',
        courseId: 'course-8',
        title: 'Nutrition Basics',
        description: 'Understanding nutrients and diet',
        order: 1,
        lessons: createLessons('mod-8-1', 6),
      },
      {
        id: 'mod-8-2',
        courseId: 'course-8',
        title: 'Disease Prevention',
        description: 'Staying healthy and preventing illness',
        order: 2,
        lessons: createLessons('mod-8-2', 7, 7),
      },
    ],
  },
}

// Generate content for other courses dynamically
function generateCourseContent(course: Course): CourseContent {
  const moduleCount = course.moduleCount || 3
  const lessonsPerModule = Math.ceil((course.lessonCount || 15) / moduleCount)

  const modules: Module[] = Array.from({ length: moduleCount }, (_, i) => ({
    id: `mod-${course.id}-${i + 1}`,
    courseId: course.id,
    title: `Module ${i + 1}`,
    description: `Module ${i + 1} of ${course.title}`,
    order: i + 1,
    lessons: createLessons(`mod-${course.id}-${i + 1}`, lessonsPerModule, i * lessonsPerModule + 1),
  }))

  return { ...course, modules }
}

export function useCourseContent(id: string | undefined) {
  return useQuery({
    queryKey: ['courseContent', id],
    queryFn: async (): Promise<CourseContent | undefined> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      if (!id) return undefined

      // Return pre-defined content if available
      if (MOCK_COURSE_CONTENT[id]) {
        return MOCK_COURSE_CONTENT[id]
      }

      // Generate content for any other course
      const course = MOCK_COURSES.find(c => c.id === id)
      if (course) {
        return generateCourseContent(course)
      }

      return undefined
    },
    enabled: !!id,
  })
}

export { MOCK_COURSE_CONTENT }
