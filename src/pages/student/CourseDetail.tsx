import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Play, CheckCircle2, Circle, Lock, Clock, Award } from 'lucide-react'
import { Progress } from '../../components/ui/progress'
import { Badge } from '../../components/ui/badge'

const courseData: Record<string, {
  title: string
  subject: string
  icon: string
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  duration: string
  modules: Array<{
    id: number
    title: string
    lessons: Array<{ id: number; title: string; duration: string; completed: boolean; current?: boolean; locked?: boolean }>
  }>
}> = {
  'math-101': {
    title: 'Mathematics Grade 7',
    subject: 'Mathematics',
    icon: '📐',
    description: 'Master algebra, geometry, and problem-solving skills essential for secondary education.',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    duration: '8 weeks',
    modules: [
      {
        id: 1,
        title: 'Number Systems',
        lessons: [
          { id: 1, title: 'Integers and Operations', duration: '12 min', completed: true },
          { id: 2, title: 'Fractions and Decimals', duration: '15 min', completed: true },
          { id: 3, title: 'Percentages', duration: '10 min', completed: true },
        ],
      },
      {
        id: 2,
        title: 'Algebra Basics',
        lessons: [
          { id: 4, title: 'Variables and Expressions', duration: '14 min', completed: true },
          { id: 5, title: 'Solving Linear Equations', duration: '18 min', completed: false, current: true },
          { id: 6, title: 'Graphing on Coordinate Plane', duration: '16 min', completed: false },
        ],
      },
      {
        id: 3,
        title: 'Geometry Fundamentals',
        lessons: [
          { id: 7, title: 'Angles and Triangles', duration: '15 min', completed: false, locked: true },
          { id: 8, title: 'Area and Perimeter', duration: '12 min', completed: false, locked: true },
          { id: 9, title: 'Volume and Surface Area', duration: '14 min', completed: false, locked: true },
        ],
      },
    ],
  },
}

export default function CourseDetail() {
  const { courseId = '' } = useParams<{ courseId: string }>()
  const course = courseData[courseId]

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Course preview not available</h2>
          <p className="text-muted-foreground mb-4">
            This course is part of the upcoming structured-courses feature.
          </p>
          <Link to="/student/courses" className="text-primary hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-12">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/student/courses"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to courses</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0">
              {course.icon}
            </div>
            <div className="flex-1">
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-2">
                {course.subject}
              </Badge>
              <h1 className="mb-2 text-2xl sm:text-3xl font-semibold leading-tight">{course.title}</h1>
              <p className="text-primary-foreground/90">{course.description}</p>
            </div>
          </div>

          <div className="bg-primary-foreground/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Course Progress</span>
              <span>
                {course.completedLessons} of {course.totalLessons} lessons
              </span>
            </div>
            <Progress value={course.progress} className="h-2 bg-primary-foreground/20" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>{course.progress}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="mb-4 font-semibold text-lg">Course Content</h3>
          {course.modules.map((module) => (
            <div key={module.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h4 className="font-medium">
                  Module {module.id}: {module.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{module.lessons.length} lessons</p>
              </div>
              <div className="divide-y divide-border">
                {module.lessons.map((lesson) => {
                  const StatusIcon = lesson.locked ? Lock : lesson.completed ? CheckCircle2 : Circle
                  return (
                    <button
                      key={lesson.id}
                      disabled={lesson.locked}
                      className={`w-full px-6 py-4 flex items-center gap-4 transition-colors ${
                        lesson.locked
                          ? 'opacity-50 cursor-not-allowed'
                          : lesson.current
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <StatusIcon
                        className={`w-5 h-5 flex-shrink-0 ${
                          lesson.completed
                            ? 'text-secondary fill-current'
                            : lesson.current
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="truncate font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.duration}</p>
                      </div>
                      {!lesson.locked && (
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                              Completed
                            </Badge>
                          ) : lesson.current ? (
                            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center">
                              <Play className="w-5 h-5 fill-current" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center">
                              <Play className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-20 lg:bottom-6 px-4 sm:px-0">
          <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
            <Play className="w-5 h-5" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>
    </div>
  )
}
