import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Quiz, QuizAttempt, QuizAnswer } from '../../../types'

// Mock quiz data
const MOCK_QUIZZES: Record<string, Quiz> = {
  'lesson-4': {
    id: 'quiz-1',
    lessonId: 'lesson-4',
    title: 'Algebra Basics Quiz',
    description: 'Test your understanding of basic algebra concepts',
    passingScore: 70,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        text: 'What is the value of x in the equation: 2x + 4 = 10?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '3' },
          { id: 'c', text: '4' },
          { id: 'd', text: '5' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'Which of the following is a variable?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '5' },
          { id: 'b', text: 'x' },
          { id: 'c', text: '10' },
          { id: 'd', text: '3.14' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: 'What is 3x + 2x equal to?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '5x' },
          { id: 'b', text: '6x' },
          { id: 'c', text: '5x²' },
          { id: 'd', text: '32x' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q4',
        text: 'If y = 5, what is the value of 2y + 3?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '10' },
          { id: 'b', text: '13' },
          { id: 'c', text: '8' },
          { id: 'd', text: '15' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q5',
        text: 'Which operation should be performed first in: 2 + 3 × 4?',
        type: 'single_choice',
        options: [
          { id: 'a', text: 'Addition (2 + 3)' },
          { id: 'b', text: 'Multiplication (3 × 4)' },
          { id: 'c', text: 'Either one' },
          { id: 'd', text: 'Neither' },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'lesson-13': {
    id: 'quiz-2',
    lessonId: 'lesson-13',
    title: 'Geometry Quiz',
    description: 'Test your knowledge of basic geometry concepts',
    passingScore: 70,
    timeLimit: 20,
    questions: [
      {
        id: 'q1',
        text: 'How many degrees are in a right angle?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '45°' },
          { id: 'b', text: '90°' },
          { id: 'c', text: '180°' },
          { id: 'd', text: '360°' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'What is the sum of angles in a triangle?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '90°' },
          { id: 'b', text: '180°' },
          { id: 'c', text: '270°' },
          { id: 'd', text: '360°' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: 'A square has how many equal sides?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '3' },
          { id: 'c', text: '4' },
          { id: 'd', text: '5' },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q4',
        text: 'What type of angle is greater than 90° but less than 180°?',
        type: 'single_choice',
        options: [
          { id: 'a', text: 'Acute angle' },
          { id: 'b', text: 'Right angle' },
          { id: 'c', text: 'Obtuse angle' },
          { id: 'd', text: 'Straight angle' },
        ],
        correctOptionIds: ['c'],
      },
    ],
  },
  'lesson-21': {
    id: 'quiz-3',
    lessonId: 'lesson-21',
    title: 'Practice Test',
    description: 'Comprehensive practice test covering all topics',
    passingScore: 60,
    timeLimit: 45,
    questions: [
      {
        id: 'q1',
        text: 'Solve for x: 5x - 10 = 15',
        type: 'single_choice',
        options: [
          { id: 'a', text: 'x = 3' },
          { id: 'b', text: 'x = 5' },
          { id: 'c', text: 'x = 1' },
          { id: 'd', text: 'x = 25' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: 'What is the perimeter of a rectangle with length 8 and width 5?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '13' },
          { id: 'b', text: '26' },
          { id: 'c', text: '40' },
          { id: 'd', text: '80' },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'lesson-23': {
    id: 'quiz-4',
    lessonId: 'lesson-23',
    title: 'Final Exam',
    description: 'Final examination for Introduction to Mathematics',
    passingScore: 70,
    timeLimit: 90,
    questions: [
      {
        id: 'q1',
        text: 'What is the slope of a horizontal line?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '0' },
          { id: 'b', text: '1' },
          { id: 'c', text: 'undefined' },
          { id: 'd', text: '-1' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: 'Simplify: (x + 3)(x - 3)',
        type: 'single_choice',
        options: [
          { id: 'a', text: 'x² - 9' },
          { id: 'b', text: 'x² + 9' },
          { id: 'c', text: 'x² - 6' },
          { id: 'd', text: '2x' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: 'What is the area of a triangle with base 10 and height 6?',
        type: 'single_choice',
        options: [
          { id: 'a', text: '60' },
          { id: 'b', text: '30' },
          { id: 'c', text: '16' },
          { id: 'd', text: '36' },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
}

export function useQuiz(id: string | undefined) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async (): Promise<Quiz | null> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200))

      if (!id) return null

      return MOCK_QUIZZES[id] || null
    },
    enabled: !!id,
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ quizId, answers }: { quizId: string; answers: QuizAnswer[] }): Promise<QuizAttempt> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Find the quiz and calculate score
      const quiz = Object.values(MOCK_QUIZZES).find(q => q.id === quizId)

      let correctCount = 0
      const gradedAnswers = answers.map(answer => {
        const question = quiz?.questions.find(q => q.id === answer.questionId)
        const isCorrect = question?.correctOptionIds?.every(id => answer.selectedOptionIds.includes(id)) ?? false
        if (isCorrect) correctCount++
        return { ...answer, isCorrect }
      })

      const totalQuestions = quiz?.questions.length || answers.length
      const score = Math.round((correctCount / totalQuestions) * 100)

      return {
        id: `attempt-${Date.now()}`,
        quizId,
        score,
        passed: score >= (quiz?.passingScore || 70),
        answers: gradedAnswers,
        submittedAt: new Date().toISOString(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseContent'] })
      queryClient.invalidateQueries({ queryKey: ['lesson'] })
    },
  })
}
