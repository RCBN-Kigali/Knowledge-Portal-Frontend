import { Link } from 'react-router-dom'
import { BookOpen, Users, TrendingUp, Award, ArrowRight, LogIn, GraduationCap, School } from 'lucide-react'
import { Button, Card, Skeleton } from '../../components/ui'
import CourseCard from '../../features/student/components/CourseCard'
import { usePublicCourses } from '../../features/student/hooks/usePublicCourses'

const schools = [
  { name: 'Paysannat Main Campus', location: 'Kigali' },
  { name: 'Paysannat Eastern', location: 'Rwamagana' },
  { name: 'Paysannat Southern', location: 'Huye' },
  { name: 'Paysannat Northern', location: 'Musanze' },
]

function Landing() {
  const { data: coursesData, isLoading } = usePublicCourses({ perPage: 6 })
  const featuredCourses = coursesData?.data ?? []

  const stats = [
    { value: '20,000+', label: 'Students' },
    { value: '4', label: 'Schools' },
    { value: '100+', label: 'Courses' },
    { value: '40+', label: 'Teachers' },
  ]

  const steps = [
    { icon: School, title: 'Get Your Account', description: 'Your school administrator creates your student account.' },
    { icon: LogIn, title: 'Login', description: 'Access the portal with your school credentials.' },
    { icon: GraduationCap, title: 'Learn', description: 'Enroll in courses and learn at your own pace.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Quality Education Across Paysannat Schools
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8">
              Access quality courses from experienced teachers across our 4 schools.
              Empowering 20,000+ students with knowledge.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Login to Access Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Public Courses</h2>
              <p className="text-gray-600 mt-1">Preview available courses</p>
            </div>
            <Link to="/courses" className="text-primary-600 font-medium hover:text-primary-700 hidden sm:block">
              View All &rarr;
            </Link>
          </div>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} variant="card" />)}
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} showLoginBadge />
              ))}
            </div>
          ) : null}
          <div className="text-center mt-6 sm:hidden">
            <Link to="/courses" className="text-primary-600 font-medium">View All Courses &rarr;</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary-600" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our 4 Schools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {schools.map(school => (
              <Card key={school.name} className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <School className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{school.name}</h3>
                <p className="text-sm text-gray-500">{school.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Login with your school account to access all available courses.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Login Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
