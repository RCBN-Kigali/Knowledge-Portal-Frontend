import Avatar from '../../../components/ui/Avatar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Dropdown from '../../../components/ui/Dropdown'
import type { AdminUser } from '../hooks/useAdminUsers'
import { MoreVertical, Edit, UserX, UserCheck, Key } from 'lucide-react'

export interface UserTableProps {
  users: AdminUser[]
  onEdit: (user: AdminUser) => void
  onDeactivate: (user: AdminUser) => void
  onActivate: (user: AdminUser) => void
  onResetPassword: (user: AdminUser) => void
  showSchool?: boolean
}

const roleLabels: Record<string, string> = {
  school_student: 'Student',
  school_teacher: 'Teacher',
  school_admin: 'School Admin',
  independent_teacher: 'Independent',
  super_admin: 'Super Admin',
}

const roleVariants: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'gray'> = {
  school_student: 'gray',
  school_teacher: 'primary',
  school_admin: 'warning',
  independent_teacher: 'success',
  super_admin: 'danger',
}

function UserTable({ users, onEdit, onDeactivate, onActivate, onResetPassword, showSchool = false }: UserTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
            {showSchool && <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">School</th>}
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date Added</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant={roleVariants[user.role]} size="sm">
                  {roleLabels[user.role] || user.role}
                </Badge>
              </td>
              {showSchool && (
                <td className="py-3 px-4 text-sm text-gray-600">
                  {user.schoolName || <span className="text-gray-400">-</span>}
                </td>
              )}
              <td className="py-3 px-4">
                <Badge 
                  variant={user.status === 'active' ? 'success' : 'gray'} 
                  size="sm"
                  dot
                >
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3 px-4">
                <Dropdown>
                  <Dropdown.Trigger>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu align="right">
                    <Dropdown.Item>
                      <button onClick={() => onEdit(user)} className="flex items-center gap-2 w-full text-left">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <button onClick={() => onResetPassword(user)} className="flex items-center gap-2 w-full text-left">
                        <Key className="w-4 h-4" /> Reset Password
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {user.status === 'active' ? (
                      <Dropdown.Item>
                        <button onClick={() => onDeactivate(user)} className="flex items-center gap-2 w-full text-left text-danger-600">
                          <UserX className="w-4 h-4" /> Deactivate
                        </button>
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item>
                        <button onClick={() => onActivate(user)} className="flex items-center gap-2 w-full text-left text-success-600">
                          <UserCheck className="w-4 h-4" /> Activate
                        </button>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
