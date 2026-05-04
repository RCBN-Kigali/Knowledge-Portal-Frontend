import { Award, Target, BookOpen, Clock } from 'lucide-react'
import { Progress as ProgressBar } from '../../components/ui/progress'
import { Badge } from '../../components/ui/badge'

const weeklyActivity = [
  { day: 'Mon', hours: 2.5, lessons: 3 },
  { day: 'Tue', hours: 1.5, lessons: 2 },
  { day: 'Wed', hours: 3, lessons: 4 },
  { day: 'Thu', hours: 2, lessons: 3 },
  { day: 'Fri', hours: 1, lessons: 1 },
  { day: 'Sat', hours: 0, lessons: 0 },
  { day: 'Sun', hours: 0, lessons: 0 },
]

const achievements = [
  { id: 1, title: 'Week Warrior', description: '7 day learning streak', icon: '🔥', earned: true, date: 'Earned today', progress: 100 },
  { id: 2, title: 'Quick Learner', description: 'Complete 10 lessons in one day', icon: '⚡', earned: false, progress: 70, date: '' },
  { id: 3, title: 'Math Master', description: 'Complete Mathematics course', icon: '📐', earned: false, progress: 65, date: '' },
  { id: 4, title: 'Perfect Score', description: 'Get 100% on 5 quizzes', icon: '🎯', earned: true, date: 'Earned 3 days ago', progress: 100 },
]

const courseProgress = [
  { id: 1, name: 'Mathematics Grade 7', subject: 'Mathematics', progress: 65, completedLessons: 16, totalLessons: 24, icon: '📐' },
  { id: 2, name: 'Life Sciences', subject: 'Science', progress: 30, completedLessons: 6, totalLessons: 20, icon: '🔬' },
  { id: 3, name: 'English Language', subject: 'English', progress: 12, completedLessons: 2, totalLessons: 18, icon: '📚' },
]

export default function Progress() {
  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours))
  const totalHours = weeklyActivity.reduce((sum, d) => sum + d.hours, 0)
  const totalLessons = weeklyActivity.reduce((sum, d) => sum + d.lessons, 0)

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="mb-1 text-xl font-semibold">Progress</h2>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl p-4 sm:p-6">
            <Award className="w-6 h-6 mb-2" />
            <div className="text-2xl sm:text-3xl font-semibold mb-1">7</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </div>
          <div className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-xl p-4 sm:p-6">
            <Clock className="w-6 h-6 mb-2" />
            <div className="text-2xl sm:text-3xl font-semibold mb-1">{totalHours}</div>
            <div className="text-sm opacity-90">Hours</div>
          </div>
          <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-xl p-4 sm:p-6">
            <BookOpen className="w-6 h-6 mb-2" />
            <div className="text-2xl sm:text-3xl font-semibold mb-1">{totalLessons}</div>
            <div className="text-sm opacity-90">Lessons</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-400 text-white rounded-xl p-4 sm:p-6">
            <Target className="w-6 h-6 mb-2" />
            <div className="text-2xl sm:text-3xl font-semibold mb-1">85%</div>
            <div className="text-sm opacity-90">Avg Score</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="mb-6 font-semibold text-lg">This Week's Activity</h3>
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-40 mb-4">
            {weeklyActivity.map((day, index) => {
              const height = maxHours > 0 ? (day.hours / maxHours) * 100 : 0
              const isToday = index === 3
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end flex-1">
                    {day.hours > 0 && (
                      <div className="text-xs text-muted-foreground text-center mb-1">{day.hours}h</div>
                    )}
                    <div
                      className={`w-full rounded-t-lg transition-all ${
                        day.hours > 0 ? (isToday ? 'bg-primary' : 'bg-secondary') : 'bg-muted'
                      }`}
                      style={{ height: `${height}%`, minHeight: day.hours > 0 ? '8px' : '4px' }}
                    />
                  </div>
                  <div className={`text-xs ${isToday ? 'font-semibold' : 'text-muted-foreground'}`}>{day.day}</div>
                </div>
              )
            })}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            You've studied {totalHours} hours and completed {totalLessons} lessons this week
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">Course Progress</h3>
          <div className="space-y-3">
            {courseProgress.map((course) => (
              <div key={course.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                    {course.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 line-clamp-1 font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">{course.subject}</p>
                  </div>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                    {course.progress}%
                  </Badge>
                </div>
                <ProgressBar value={course.progress} className="h-2 mb-2" />
                <div className="text-sm text-muted-foreground">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">Achievements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`bg-card border rounded-xl p-4 ${a.earned ? 'border-accent shadow-sm' : 'border-border'}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`text-3xl ${a.earned ? '' : 'grayscale opacity-50'}`}>{a.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 font-medium">{a.title}</h4>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                </div>
                {a.earned ? (
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                    {a.date}
                  </Badge>
                ) : (
                  <div className="space-y-2">
                    <ProgressBar value={a.progress} className="h-1.5" />
                    <div className="text-xs text-muted-foreground">{a.progress}% complete</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Coming soon</p>
          <p className="text-xs mt-1">Real progress tracking ships with the courses feature. Sample data shown for preview.</p>
        </div>
      </div>
    </div>
  )
}
