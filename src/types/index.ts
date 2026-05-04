export type UserRole = 'student' | 'teacher' | 'admin'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  is_active: boolean
  school: string | null
  subjects: string[] | null
  approval_status: ApprovalStatus | null
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export type ContentType = 'video' | 'audio' | 'article'
export type ContentStatus = 'draft' | 'pending' | 'published' | 'rejected'

export interface ExternalLink {
  label: string
  url: string
}

export interface Content {
  id: string
  title: string
  description: string
  content_type: ContentType
  file_url: string | null
  teacher_id: string
  subject: string
  grade_level: string
  duration_minutes: number | null
  hashtags: string[] | null
  external_links: ExternalLink[] | null
  status: ContentStatus
  views_count: number
  likes_count: number
  dislikes_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

export interface FeedPage {
  page: number
  limit: number
  total: number
  items: Content[]
}

export interface CategoriesResponse {
  categories: string[]
}

export interface TrendingResponse {
  trending_searches: string[]
  trending_content: Content[]
}

export interface EngagementState {
  content_id: string
  likes_count: number
  dislikes_count: number
  user_vote: 'like' | 'dislike' | null
}

export interface CommentItem {
  id: string
  content_id: string
  user_id: string
  user_name: string | null
  user_role: UserRole | null
  text: string
  parent_comment_id: string | null
  is_unread: boolean
  created_at: string
}

export interface TeacherInboxItem extends CommentItem {
  content_title: string | null
}

export interface CommentPage {
  page: number
  limit: number
  total: number
  items: CommentItem[]
}

export interface TeacherInboxPage {
  page: number
  limit: number
  total: number
  items: TeacherInboxItem[]
}

export type AnnouncementPriority = 'normal' | 'high'

export interface AnnouncementListItem {
  id: string
  title: string
  content_preview: string
  priority: AnnouncementPriority
  created_at: string
  is_read: boolean
  has_unread_indicator: boolean
}

export interface AnnouncementDetail {
  id: string
  title: string
  content: string
  priority: AnnouncementPriority
  created_by: string
  created_at: string
  is_read: boolean
}

export interface AnnouncementPage {
  page: number
  limit: number
  total: number
  items: AnnouncementListItem[]
}

export interface NotificationItem {
  id: string
  notification_type: string
  title: string
  message: string
  related_content_id: string | null
  related_announcement_id: string | null
  actor_id: string | null
  is_read: boolean
  created_at: string
}

export interface NotificationPage {
  unread_count: number
  total: number
  items: NotificationItem[]
}
