import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { LogOut } from 'lucide-react'

export default function TeacherDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Teacher dashboard</h1>
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-muted-foreground">
            Welcome, {user?.name}. The teacher experience (upload, content management, comments) is in the next slice.
          </p>
        </div>
      </div>
    </div>
  )
}
