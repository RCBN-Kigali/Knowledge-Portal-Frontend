import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-semibold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">We couldn't find that page.</p>
        <Link to="/" className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90">
          Go home
        </Link>
      </div>
    </div>
  )
}
