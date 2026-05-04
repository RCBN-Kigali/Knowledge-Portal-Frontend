import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Video, Headphones, FileText, Compass, ChevronRight } from 'lucide-react'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="font-semibold">LearnHub</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm hover:bg-muted rounded-lg">Log in</Link>
            <Link to="/signup" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Sign up</Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Learning, made for everyone.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover lessons from teachers across the country — videos, audio, and articles tailored to your grade and interests.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-lg transition-all"
          >
            Get started
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl hover:bg-muted transition-all">
            I have an account
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { Icon: Video, title: 'Video lessons', desc: 'Visual lessons you can rewatch.' },
            { Icon: Headphones, title: 'Audio learning', desc: 'Learn on the go, anywhere.' },
            { Icon: FileText, title: 'Articles', desc: 'Quick reads and study notes.' },
            { Icon: Compass, title: 'Career guidance', desc: 'Explore paths and possibilities.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-8 sm:p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Ready to start learning?</h2>
          <p className="text-muted-foreground mb-6">Create a free account and dive in.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
          >
            Sign up free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
