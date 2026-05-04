import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export default function TeacherPending() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto mb-4 flex items-center justify-center">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Application pending review</h1>
        <p className="text-muted-foreground mb-6">
          Thanks for signing up as a teacher. Your account is awaiting administrator approval. You'll be notified by email when it's ready.
        </p>
        <Link to="/login" className="inline-flex px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90">
          Back to log in
        </Link>
      </div>
    </div>
  )
}
