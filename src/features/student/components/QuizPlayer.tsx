import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import { Button, Card, ProgressBar, Alert } from '../../../components/ui'
import clsx from 'clsx'
import type { Quiz, QuizAttempt, QuizAnswer } from '../../../types'

interface QuizPlayerProps {
  quiz: Quiz
  onSubmit: (answers: QuizAnswer[]) => void
  isSubmitting: boolean
  result?: QuizAttempt
}

function QuizPlayer({ quiz, onSubmit, isSubmitting, result }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  const question = quiz.questions[currentIndex]
  const totalQuestions = quiz.questions.length
  const answeredCount = Object.keys(answers).length

  const selectOption = (optionId: string) => {
    setAnswers(prev => {
      const current = prev[question.id] || []
      if (question.type === 'single_choice') {
        return { ...prev, [question.id]: [optionId] }
      }
      if (current.includes(optionId)) {
        return { ...prev, [question.id]: current.filter(id => id !== optionId) }
      }
      return { ...prev, [question.id]: [...current, optionId] }
    })
  }

  const handleSubmit = () => {
    const quizAnswers: QuizAnswer[] = quiz.questions.map(q => ({
      questionId: q.id,
      selectedOptionIds: answers[q.id] || [],
    }))
    onSubmit(quizAnswers)
  }

  if (result) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center">
          {result.passed ? (
            <CheckCircle2 className="w-16 h-16 text-success-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
          )}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Not Quite'}
          </h3>
          <p className="text-gray-600 mb-4">
            You scored {result.score}% {result.passed ? '- You passed!' : `- Passing score is ${quiz.passingScore}%`}
          </p>
          <ProgressBar
            value={result.score}
            max={100}
            variant={result.passed ? 'success' : 'danger'}
            showValue
          />
        </Card>
        <div className="space-y-4">
          {quiz.questions.map((q, i) => {
            const answer = result.answers.find(a => a.questionId === q.id)
            return (
              <Card key={q.id} className="p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {i + 1}. {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const isSelected = answer?.selectedOptionIds.includes(opt.id)
                    const isCorrect = q.correctOptionIds?.includes(opt.id)
                    return (
                      <div
                        key={opt.id}
                        className={clsx(
                          'px-3 py-2 rounded-lg text-sm border',
                          isCorrect && 'bg-success-50 border-success-200 text-success-700',
                          isSelected && !isCorrect && 'bg-danger-50 border-danger-200 text-danger-700',
                          !isSelected && !isCorrect && 'border-gray-200 text-gray-600',
                        )}
                      >
                        {opt.text}
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Question {currentIndex + 1} of {totalQuestions}</span>
        <span className="text-sm text-gray-500">{answeredCount} answered</span>
      </div>
      <ProgressBar value={currentIndex + 1} max={totalQuestions} size="sm" />

      <Card className="p-6">
        <p className="text-lg font-medium text-gray-900 mb-4">{question.text}</p>
        <div className="space-y-3">
          {question.options.map(opt => {
            const isSelected = (answers[question.id] || []).includes(opt.id)
            return (
              <button
                key={opt.id}
                onClick={() => selectOption(opt.id)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-lg border-2 transition-colors',
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700',
                )}
              >
                {opt.text}
              </button>
            )
          })}
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentIndex(i => i - 1)}
          disabled={currentIndex === 0}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        {currentIndex < totalQuestions - 1 ? (
          <Button onClick={() => setCurrentIndex(i => i + 1)}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={answeredCount < totalQuestions}
          >
            Submit Quiz
          </Button>
        )}
      </div>

      {answeredCount < totalQuestions && currentIndex === totalQuestions - 1 && (
        <Alert variant="warning">
          Please answer all questions before submitting.
        </Alert>
      )}
    </div>
  )
}

export default QuizPlayer
