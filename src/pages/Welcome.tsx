import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  GraduationCap,
  BookOpen,
  Users,
  School,
  MapPin,
  Video,
  FileText,
  Compass,
  UserCog,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react'

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, duration])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-secondary/30">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
            animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
            animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className="absolute top-20 right-20 text-primary/30"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BookOpen className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-secondary/30"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <GraduationCap className="w-20 h-20" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-primary/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20"
          >
            <MapPin className="w-4 h-4" />
            Kirehe District, Eastern Province, Rwanda
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl sm:text-5xl lg:text-7xl leading-tight font-semibold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            24,000 Students.<br />
            One Digital Classroom.
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Bridging the gap between Burundian and Rwandan students through accessible
            digital education at GS Paysannat L
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => scrollToSection('impact')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-card border-2 border-border text-foreground rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Learn More
              <ChevronDown className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-2">Welcome to</p>
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Knowledge Portal</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-2">GS Paysannat L</p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: IMPACT STATS */}
      <section id="impact" className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl sm:text-4xl font-semibold">Our Community</h2>
            <p className="text-lg text-muted-foreground">
              One platform. Five schools. Every learner counts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2 text-primary">
                <AnimatedCounter target={24000} suffix="+" />
              </div>
              <p className="text-muted-foreground">Students</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex items-center justify-center mx-auto mb-4">
                <School className="w-8 h-8" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2 text-secondary">
                <AnimatedCounter target={5} />
              </div>
              <p className="text-muted-foreground">Schools (L-A to L-E)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2 text-accent">
                <AnimatedCounter target={300} suffix="+" />
              </div>
              <p className="text-muted-foreground">Teachers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-2">Kirehe</div>
              <p className="text-muted-foreground">Eastern Province, Rwanda</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROBLEM WE SOLVE */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl sm:text-4xl font-semibold">The Challenge We Address</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GS Paysannat L faces unique challenges. Knowledge Portal is the solution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-muted/50 border-2 border-muted rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-6">
                <XCircle className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-muted-foreground">The Reality</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">•</span>
                  <span>45 computers for 24,000 students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">•</span>
                  <span>Classrooms of 90-100 students per shift</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">•</span>
                  <span>No science laboratories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">•</span>
                  <span>Limited physical learning resources</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-2xl p-8"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Knowledge Portal</h3>
              <p className="text-lg leading-relaxed mb-4">
                Knowledge Portal puts <strong>video lessons, audio content, career guidance,
                and course management</strong> in every student's hands — no lab required.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm">
                  <Sparkles className="w-4 h-4" />
                  Accessible anywhere
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-secondary/10 text-secondary rounded-lg text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Free for all students
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT KNOWLEDGE PORTAL OFFERS */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl sm:text-4xl font-semibold">What Knowledge Portal Offers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to learn and teach, accessible from any device
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center mb-6">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Video & Audio Lessons</h3>
              <p className="text-muted-foreground">
                Access recorded lessons from your teachers anytime, even with limited connectivity
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex items-center justify-center mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Course Management</h3>
              <p className="text-muted-foreground">
                Teachers create structured courses with quizzes, assignments, and progress tracking
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center mb-6">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Career Guidance</h3>
              <p className="text-muted-foreground">
                Explore career paths and university opportunities beyond Kirehe
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHO IT'S FOR */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4 text-3xl sm:text-4xl font-semibold">Who Knowledge Portal Serves</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for every member of the GS Paysannat L community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Students</h3>
              <p className="text-muted-foreground">
                Browse and enroll in public courses or access your class materials
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6">
                <UserCog className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Teachers</h3>
              <p className="text-muted-foreground">
                Upload lessons, manage your classes and track student progress
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Admins</h3>
              <p className="text-muted-foreground">
                Oversee teacher accounts and manage school-wide announcements
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA FOOTER BANNER */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl sm:text-4xl font-semibold text-primary-foreground">
              Ready to Learn? Join Knowledge Portal Today.
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-10">
              Whether you're a student, teacher, or administrator at GS Paysannat L,
              your digital classroom awaits.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary rounded-xl text-lg font-medium transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-primary-foreground/80 mt-6">
              Free for all students and staff at GS Paysannat L
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">Knowledge Portal</div>
                <div className="text-xs text-muted-foreground">GS Paysannat L</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Empowering 24,000 students across Paysannat L-A through L-E
            </p>
            <p className="text-xs text-muted-foreground">
              Kirehe District, Eastern Province, Rwanda
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
