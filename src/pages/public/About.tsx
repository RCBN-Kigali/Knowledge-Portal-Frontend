import { BookOpen, Users, School, Target, MapPin, Mail, Phone, Eye } from 'lucide-react'
import { Card } from '../../components/ui'

const schools = [
  { name: 'Paysannat L School - Main Campus', location: 'Kigali, Rwanda', description: 'The flagship campus serving over 8,000 students with comprehensive programs in science, arts, and technology.', students: 8000 },
  { name: 'Paysannat L School - Eastern Branch', location: 'Rwamagana, Rwanda', description: 'Focused on agricultural sciences and rural development, serving 5,000+ students.', students: 5000 },
  { name: 'Paysannat L School - Southern Branch', location: 'Huye, Rwanda', description: 'Specializing in languages and social studies, supporting 4,000 students.', students: 4000 },
  { name: 'Paysannat L School - Northern Branch', location: 'Musanze, Rwanda', description: 'Dedicated to environmental studies and health sciences, with 3,000+ students.', students: 3000 },
]

const values = [
  { icon: Target, title: 'Our Mission', description: 'To provide accessible, quality education to rural communities across Africa.' },
  { icon: Users, title: 'Community First', description: 'Building a supportive learning community that connects students and teachers.' },
  { icon: BookOpen, title: 'Quality Content', description: 'Curated courses from experienced educators, designed for low-bandwidth access.' },
  { icon: Eye, title: 'Our Vision', description: 'A future where every student in rural Africa has access to world-class education.' },
]

function About() {
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

      {/* Mission & Values */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {values.map(value => (
          <Card key={value.title} className="p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <value.icon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-gray-600 text-sm">{value.description}</p>
          </Card>
        ))}
      </div>

      {/* Our Schools */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our 4 Partner Schools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {schools.map(school => (
            <Card key={school.name} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <School className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{school.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {school.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{school.description}</p>
                  <p className="text-sm text-primary-600 font-medium mt-2">{school.students.toLocaleString()} students</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <Card className="p-8 bg-primary-50 border-primary-200 mb-16">
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

      {/* Contact */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <div className="space-y-3 text-gray-600">
          <p className="flex items-center justify-center gap-2"><Mail className="w-5 h-5 text-primary-600" /> info@paysannat.edu.rw</p>
          <p className="flex items-center justify-center gap-2"><Phone className="w-5 h-5 text-primary-600" /> +250 788 000 000</p>
          <p className="flex items-center justify-center gap-2"><MapPin className="w-5 h-5 text-primary-600" /> Kigali, Rwanda</p>
        </div>
      </div>
    </div>
  )
}

export default About
