import { useQuery } from '@tanstack/react-query'
import type { CourseAnalytics } from '../../../types'

const MOCK_ANALYTICS: Record<string, CourseAnalytics> = {
  'tc-1': {
    enrolledCount: 45,
    completionRate: 62,
    averageScore: 78,
    moduleCompletion: [
      { moduleTitle: 'Introduction to Algebra', completionRate: 85 },
      { moduleTitle: 'Geometry', completionRate: 45 },
    ],
    quizScores: [
      { quizTitle: 'Quiz 1', averageScore: 82 },
      { quizTitle: 'Quiz 2', averageScore: 74 },
    ],
    assignmentSubmissionRate: 88,
  },
  'tc-2': {
    enrolledCount: 22,
    completionRate: 40,
    averageScore: 71,
    moduleCompletion: [
      { moduleTitle: 'Mechanics', completionRate: 60 },
      { moduleTitle: 'Thermodynamics', completionRate: 25 },
    ],
    quizScores: [
      { quizTitle: 'Mechanics Quiz', averageScore: 68 },
    ],
    assignmentSubmissionRate: 72,
  },
}

export function useCourseAnalytics(courseId: string | undefined) {
  return useQuery({
    queryKey: ['courseAnalytics', courseId],
    queryFn: async (): Promise<CourseAnalytics> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return MOCK_ANALYTICS[courseId!] || {
        enrolledCount: 0,
        completionRate: 0,
        averageScore: 0,
        moduleCompletion: [],
        quizScores: [],
        assignmentSubmissionRate: 0,
      }
    },
    enabled: !!courseId,
  })
}
