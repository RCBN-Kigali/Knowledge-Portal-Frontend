import { BookOpen, Users, School, Target } from 'lucide-react'
import { Card } from '../../components/ui'

function About() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide accessible, quality education to rural communities across Africa.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a supportive learning community that connects students and teachers.',
    },
    {
      icon: BookOpen,
      title: 'Quality Content',
      description: 'Curated courses from experienced educators, designed for low-bandwidth access.',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <School className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Paysannat L School</h1>
        <p className="text-lg text-gray-600">
          We are a network of 4 rural schools committed to delivering quality education to over
          20,000 students across our region. Knowledge Portal is our digital learning platform,
          connecting students with experienced teachers from both our schools and independent
          educators.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {values.map((value) => (
          <Card key={value.title} className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <value.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-gray-600">{value.description}</p>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <Card className="p-8 bg-primary-50 border-primary-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">20,000+</p>
            <p className="text-gray-600 mt-1">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">40+</p>
            <p className="text-gray-600 mt-1">Teachers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">4</p>
            <p className="text-gray-600 mt-1">Schools</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">100+</p>
            <p className="text-gray-600 mt-1">Courses</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default About
