import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSchools, type School } from '../../features/admin/hooks/useSchools'
import SchoolCard from '../../features/admin/components/SchoolCard'
import Card from '../../components/ui/Card'
import SearchBar from '../../components/ui/SearchBar'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import { Building2 } from 'lucide-react'

export default function SchoolsOverview() {
  const [search, setSearch] = useState('')
  const { data: schools, isLoading } = useSchools()
  
  const filteredSchools = schools?.filter(school => 
    school.name.toLowerCase().includes(search.toLowerCase()) ||
    school.location?.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-600 mt-1">
            Manage all partner schools in the system
          </p>
        </div>
      </div>
      
      {/* Search */}
      <div className="w-full sm:w-64">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search schools..."
        />
      </div>
      
      {/* Schools Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : filteredSchools && filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchools.map(school => (
            <Link key={school.id} to={`/superadmin/schools/${school.id}`}>
              <SchoolCard school={school} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title={search ? 'No schools found' : 'No schools yet'}
          description={search ? 'Try adjusting your search' : 'Schools will appear here once added'}
        />
      )}
      
      {/* Summary Stats */}
      {schools && schools.length > 0 && (
        <Card>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
                <p className="text-sm text-gray-500">Total Schools</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.reduce((sum, s) => sum + s.studentCount, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.reduce((sum, s) => sum + s.teacherCount, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Teachers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.reduce((sum, s) => sum + s.courseCount, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Courses</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
