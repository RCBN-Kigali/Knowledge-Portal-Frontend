import { DataTable, Avatar, Button } from '../../../components/ui'
import type { User } from '../../../types'

interface TeacherStudent extends User {
  enrolledCourses: number
  averageProgress: number
}

interface StudentTableProps {
  students: TeacherStudent[]
  onEnroll: (studentId: string) => void
  loading?: boolean
}

function StudentTable({ students, onEnroll, loading }: StudentTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (row: TeacherStudent) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'enrolledCourses', header: 'Enrolled', sortable: true },
    {
      key: 'averageProgress',
      header: 'Avg Progress',
      sortable: true,
      render: (row: TeacherStudent) => `${row.averageProgress}%`,
    },
    {
      key: 'actions',
      header: '',
      render: (row: TeacherStudent) => (
        <Button size="sm" variant="ghost" onClick={() => onEnroll(row.id)}>
          Enroll
        </Button>
      ),
    },
  ]

  return <DataTable columns={columns} data={students} loading={loading} />
}

export default StudentTable
