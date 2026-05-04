import { Link } from 'react-router-dom'
import { GraduationCap, FileText, UserCog, Megaphone, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi } from '../../api/admin'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.stats,
    refetchInterval: 60_000,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            value={stats?.pending_content ?? 0}
            label="Pending Reviews"
            icon={<Clock className="w-6 h-6" />}
            tone="bg-muted text-muted-foreground"
            isLoading={isLoading}
          />
          <StatCard
            value={stats?.total_teachers ?? 0}
            label="Total Teachers"
            icon={<UserCog className="w-6 h-6" />}
            tone="bg-primary/10 text-primary"
            isLoading={isLoading}
          />
          <StatCard
            value={stats?.total_students ?? 0}
            label="Total Students"
            icon={<GraduationCap className="w-6 h-6" />}
            tone="bg-secondary/10 text-secondary"
            isLoading={isLoading}
          />
          <StatCard
            value={stats?.published_content ?? 0}
            label="Active Content"
            icon={<FileText className="w-6 h-6" />}
            tone="bg-accent/10 text-accent"
            isLoading={isLoading}
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/approvals"
            className="bg-gradient-to-br from-muted to-muted/40 border-2 border-border rounded-2xl p-8 hover:shadow-lg transition-all group relative"
          >
            {(stats?.pending_content ?? 0) > 0 && (
              <div className="absolute top-4 right-4 min-w-[2rem] h-8 px-2 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                {stats!.pending_content}
              </div>
            )}
            <div className="w-16 h-16 rounded-2xl bg-muted text-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Pending Reviews</h3>
            <p className="text-sm text-muted-foreground">Approve or reject content submitted by teachers</p>
          </Link>

          <Link
            to="/admin/teachers"
            className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCog className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Manage Teachers</h3>
            <p className="text-sm text-muted-foreground">Add, edit, or deactivate teacher accounts</p>
          </Link>

          <Link
            to="/admin/announcements"
            className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 rounded-2xl p-8 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Announcements</h3>
            <p className="text-sm text-muted-foreground">Send announcements to students and teachers</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  icon,
  tone,
  isLoading,
}: {
  value: number
  label: string
  icon: React.ReactNode
  tone: string
  isLoading: boolean
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${tone} flex items-center justify-center`}>{icon}</div>
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-16 mb-1" />
      ) : (
        <p className="text-3xl font-semibold mb-1">{value.toLocaleString()}</p>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
