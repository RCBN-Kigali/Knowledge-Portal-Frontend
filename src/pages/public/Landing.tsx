import { Link } from 'react-router-dom'
import { BookOpen, Users, TrendingUp, Award, ArrowRight } from 'lucide-react'
import { Button, Card } from '../../components/ui'

function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Quality Education',
      description: 'Access high-quality courses from experienced teachers in rural and urban areas.',
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join a vibrant community of learners from 4 schools across the region.',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and analytics.',
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Complete courses and earn certificates to showcase your achievements.',
    },
  ]

  const stats = [
    { value: '20,000+', label: 'Students' },
    { value: '40+', label: 'Teachers' },
    { value: '4', label: 'Schools' },
    { value: '100+', label: 'Courses' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Empowering Rural Education in Africa
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-8">
              Access quality education from anywhere. Join thousands of students learning with
              Knowledge Portal, powered by Paysannat L School.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Knowledge Portal?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to making quality education accessible to everyone, everywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners today and access courses from expert teachers.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
