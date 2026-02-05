import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../hooks/useAuth'

export interface School {
  id: string
  name: string
  location?: string
  description?: string
  adminId?: string
  adminName?: string
  adminEmail?: string
  adminPhone?: string
  studentCount: number
  teacherCount: number
  courseCount: number
  status: 'active' | 'inactive'
  createdAt: string
}

export interface SchoolDetail extends School {
  teachers: {
    id: string
    name: string
    email: string
    courseCount: number
    status: 'active' | 'inactive'
  }[]
  recentCourses: {
    id: string
    title: string
    teacherName: string
    status: 'pending' | 'approved' | 'rejected'
  }[]
}

const MOCK_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Paysannat Main Campus',
    location: 'Kigali, Rwanda',
    description: 'The main campus of Paysannat L School network',
    adminId: 'admin-1',
    adminName: 'Jean Bosco Habimana',
    adminEmail: 'jbosco@paysannat.edu.rw',
    adminPhone: '+250 788 123 456',
    studentCount: 450,
    teacherCount: 15,
    courseCount: 32,
    status: 'active',
    createdAt: '2023-01-01',
  },
  {
    id: 'school-2',
    name: 'Paysannat Eastern',
    location: 'Eastern Province, Rwanda',
    description: 'Eastern branch of Paysannat L School',
    adminId: 'admin-2',
    adminName: 'Marie Rose Uwimana',
    adminEmail: 'mrose@paysannat.edu.rw',
    adminPhone: '+250 788 234 567',
    studentCount: 320,
    teacherCount: 10,
    courseCount: 24,
    status: 'active',
    createdAt: '2023-03-15',
  },
  {
    id: 'school-3',
    name: 'Green Hills Academy',
    location: 'Northern Province, Rwanda',
    description: 'Partner school in the Northern region',
    adminId: 'admin-3',
    adminName: 'Patrick Mugabo',
    adminEmail: 'pmugabo@greenhills.edu.rw',
    adminPhone: '+250 788 345 678',
    studentCount: 280,
    teacherCount: 12,
    courseCount: 18,
    status: 'active',
    createdAt: '2023-06-01',
  },
  {
    id: 'school-4',
    name: 'Rwanda Technical College',
    location: 'Southern Province, Rwanda',
    description: 'Technical and vocational training partner',
    adminId: 'admin-4',
    adminName: 'Alice Uwimana',
    adminEmail: 'auwimana@rtc.edu.rw',
    adminPhone: '+250 788 456 789',
    studentCount: 200,
    teacherCount: 8,
    courseCount: 13,
    status: 'active',
    createdAt: '2023-09-01',
  },
]

const MOCK_SCHOOL_DETAILS: Record<string, SchoolDetail> = {
  'school-1': {
    ...MOCK_SCHOOLS[0],
    teachers: [
      { id: 't1', name: 'Emmanuel Habimana', email: 'ehabimana@paysannat.edu.rw', courseCount: 5, status: 'active' },
      { id: 't2', name: 'Grace Mukamana', email: 'gmukamana@paysannat.edu.rw', courseCount: 3, status: 'active' },
      { id: 't3', name: 'Pierre Nshimiyimana', email: 'pnshimiyimana@paysannat.edu.rw', courseCount: 4, status: 'active' },
    ],
    recentCourses: [
      { id: 'c1', title: 'Introduction to Agriculture', teacherName: 'Emmanuel Habimana', status: 'approved' },
      { id: 'c2', title: 'Digital Literacy', teacherName: 'Grace Mukamana', status: 'pending' },
      { id: 'c3', title: 'Environmental Science', teacherName: 'Pierre Nshimiyimana', status: 'approved' },
    ],
  },
  'school-2': {
    ...MOCK_SCHOOLS[1],
    teachers: [
      { id: 't4', name: 'Jean Paul Bizimana', email: 'jpbizimana@paysannat.edu.rw', courseCount: 4, status: 'active' },
      { id: 't5', name: 'Claudine Ingabire', email: 'cingabire@paysannat.edu.rw', courseCount: 2, status: 'active' },
    ],
    recentCourses: [
      { id: 'c4', title: 'Crop Management', teacherName: 'Jean Paul Bizimana', status: 'approved' },
      { id: 'c5', title: 'Livestock Care', teacherName: 'Claudine Ingabire', status: 'pending' },
    ],
  },
  'school-3': {
    ...MOCK_SCHOOLS[2],
    teachers: [
      { id: 't6', name: 'David Nsengiyumva', email: 'dnsengiyumva@greenhills.edu.rw', courseCount: 3, status: 'active' },
      { id: 't7', name: 'Jacqueline Uwera', email: 'juwera@greenhills.edu.rw', courseCount: 2, status: 'inactive' },
    ],
    recentCourses: [
      { id: 'c6', title: 'Business Fundamentals', teacherName: 'David Nsengiyumva', status: 'approved' },
    ],
  },
  'school-4': {
    ...MOCK_SCHOOLS[3],
    teachers: [
      { id: 't8', name: 'Samuel Mugisha', email: 'smugisha@rtc.edu.rw', courseCount: 4, status: 'active' },
    ],
    recentCourses: [
      { id: 'c7', title: 'Technical Drawing', teacherName: 'Samuel Mugisha', status: 'approved' },
      { id: 'c8', title: 'Workshop Safety', teacherName: 'Samuel Mugisha', status: 'pending' },
    ],
  },
}

export function useSchools() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['schools'],
    queryFn: async (): Promise<School[]> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return MOCK_SCHOOLS
    },
    enabled: user?.role === 'super_admin' || user?.role === 'school_admin',
  })
}

export function useSchool(schoolId: string | undefined) {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: async (): Promise<School | null> => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return MOCK_SCHOOLS.find(s => s.id === schoolId) || null
    },
    enabled: !!schoolId,
  })
}

export function useSchoolDetail(schoolId: string | undefined) {
  return useQuery({
    queryKey: ['schoolDetail', schoolId],
    queryFn: async (): Promise<SchoolDetail | null> => {
      await new Promise(resolve => setTimeout(resolve, 300))
      if (!schoolId) return null
      return MOCK_SCHOOL_DETAILS[schoolId] || null
    },
    enabled: !!schoolId,
  })
}

export function useUpdateSchool() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<School> }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] })
      queryClient.invalidateQueries({ queryKey: ['school'] })
      queryClient.invalidateQueries({ queryKey: ['schoolDetail'] })
    },
  })
}
