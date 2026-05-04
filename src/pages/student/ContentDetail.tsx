import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Calendar,
  MessageCircle,
  ArrowUp,
  Eye,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Skeleton } from '../../components/ui/skeleton'
import { contentApi } from '../../api/content'
import { engagementApi } from '../../api/engagement'
import { commentsApi } from '../../api/comments'
import { useAuth } from '../../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'
import type { Content } from '../../types'

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function thumbnailFor(content: Content): string {
  const subj = content.subject?.toLowerCase() ?? ''
  if (subj.includes('biology') || content.title.toLowerCase().includes('photosynth')) return '🌿'
  if (subj.includes('math') || content.title.toLowerCase().includes('equation')) return '📐'
  if (subj.includes('english') || content.title.toLowerCase().includes('essay')) return '✍️'
  if (subj.includes('history')) return '🏛️'
  if (subj.includes('chemistry')) return '⚗️'
  if (subj.includes('physics')) return '⚛️'
  if (subj.includes('career')) return '💼'
  if (subj.includes('geography') || content.title.toLowerCase().includes('water')) return '💧'
  if (subj.includes('computer')) return '💻'
  switch (content.content_type) {
    case 'video':
      return '🎬'
    case 'audio':
      return '🎧'
    case 'article':
      return '🌍'
  }
}

function formatDuration(content: Content): string | null {
  if (content.content_type === 'article') return null
  if (content.duration_minutes == null) return null
  const m = Math.floor(content.duration_minutes)
  const s = Math.round((content.duration_minutes - m) * 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function ArticleBody({ text }: { text: string }) {
  const blocks = useMemo(() => text.split(/\n{2,}/).filter((b) => b.trim().length > 0), [text])

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-12">
      <div className="text-foreground space-y-6" style={{ lineHeight: 1.7 }}>
        {blocks.map((para, idx) => {
          if (para.startsWith('## ')) {
            return (
              <h2 key={idx} className="mt-8 mb-4 text-2xl font-semibold text-foreground">
                {para.replace(/^##\s*/, '')}
              </h2>
            )
          }
          if (para.startsWith('### ')) {
            return (
              <h3 key={idx} className="mt-6 mb-3 text-xl font-semibold text-foreground">
                {para.replace(/^###\s*/, '')}
              </h3>
            )
          }
          if (/^\d+\.\s/.test(para)) {
            const items = para.split('\n').filter(Boolean)
            return (
              <ol key={idx} className="list-decimal list-inside space-y-2 text-muted-foreground">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            )
          }
          if (/^[-*]\s/.test(para)) {
            const items = para.split('\n').filter(Boolean)
            return (
              <ul key={idx} className="list-disc list-inside space-y-2 text-muted-foreground">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^[-*]\s*/, '')}</li>
                ))}
              </ul>
            )
          }
          return (
            <p key={idx} className="text-muted-foreground">
              {para}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default function ContentDetail() {
  const { contentId = '' } = useParams<{ contentId: string }>()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [comment, setComment] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentApi.get(contentId),
    enabled: !!contentId,
  })

  const { data: engagement } = useQuery({
    queryKey: ['engagement', contentId],
    queryFn: () => engagementApi.get(contentId),
    enabled: !!contentId && !!user,
  })

  const { data: comments } = useQuery({
    queryKey: ['comments', contentId],
    queryFn: () => commentsApi.list(contentId),
    enabled: !!contentId,
  })

  const likeMut = useMutation({
    mutationFn: () => engagementApi.like(contentId),
    onSuccess: (data) => qc.setQueryData(['engagement', contentId], data),
  })
  const dislikeMut = useMutation({
    mutationFn: () => engagementApi.dislike(contentId),
    onSuccess: (data) => qc.setQueryData(['engagement', contentId], data),
  })
  const commentMut = useMutation({
    mutationFn: (text: string) => commentsApi.create(contentId, text),
    onSuccess: () => {
      setComment('')
      qc.invalidateQueries({ queryKey: ['comments', contentId] })
      qc.invalidateQueries({ queryKey: ['content', contentId] })
    },
  })

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <Link to="/student" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  const likes = engagement?.likes_count ?? content.likes_count
  const dislikes = engagement?.dislikes_count ?? content.dislikes_count
  const userVote = engagement?.user_vote
  const liked = userVote === 'like'
  const disliked = userVote === 'dislike'
  const dateLabel = formatDistanceToNow(new Date(content.created_at), { addSuffix: true })
  const duration = formatDuration(content)

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/student" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Media Player */}
        {content.content_type === 'video' && (
          <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
            {content.file_url ? (
              <video src={content.file_url} controls className="w-full h-full object-contain bg-black" />
            ) : (
              <div className="text-8xl">{thumbnailFor(content)}</div>
            )}
          </div>
        )}

        {content.content_type === 'audio' && (
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-end justify-center gap-1 h-32 mb-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-primary to-primary/40 rounded-full transition-all"
                  style={{
                    height: `${20 + ((i * 17) % 80)}%`,
                    opacity: i < 15 ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
            {content.file_url ? (
              <audio src={content.file_url} controls className="w-full" />
            ) : (
              <p className="text-center text-sm text-muted-foreground">Audio not yet uploaded.</p>
            )}
          </div>
        )}

        {/* Title and Metadata */}
        <div>
          <h1 className="mb-4 text-2xl sm:text-3xl font-semibold leading-tight">{content.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm flex-shrink-0 font-semibold">
              {initialsOf(content.subject + ' ' + content.grade_level)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{content.subject} · {content.grade_level}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {dateLabel}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {content.views_count.toLocaleString()} views
                </span>
                {duration && <span>{duration}</span>}
              </div>
            </div>
          </div>

          {/* Tags */}
          {content.hashtags && content.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {content.hashtags.map((tag) => (
                <Badge key={String(tag)} variant="secondary" className="bg-primary/10 text-primary border-0 px-3 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Like/Dislike Buttons */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <button
              onClick={() => user && likeMut.mutate()}
              disabled={!user || likeMut.isPending}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                liked
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:bg-muted'
              } disabled:opacity-50`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{likes.toLocaleString()}</span>
            </button>
            <button
              onClick={() => user && dislikeMut.mutate()}
              disabled={!user || dislikeMut.isPending}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                disliked
                  ? 'bg-muted text-foreground border-border'
                  : 'bg-card border-border hover:bg-muted'
              } disabled:opacity-50`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>{dislikes.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* Article body (article type only) */}
        {content.content_type === 'article' && content.description && (
          <ArticleBody text={content.description} />
        )}

        {/* Description (video/audio only) */}
        {content.content_type !== 'article' && content.description && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="mb-3 font-semibold text-lg">About this lesson</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>
          </div>
        )}

        {/* External Links */}
        {content.external_links && content.external_links.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="mb-4 font-semibold text-lg">Additional Resources</h3>
            <div className="space-y-3">
              {content.external_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors group"
                >
                  <span className="text-primary font-medium">{link.label}</span>
                  <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="mb-6 flex items-center gap-2 font-semibold text-lg">
            <MessageCircle className="w-5 h-5" />
            {comments?.total ?? 0} Comments
          </h3>

          {user && (
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {initialsOf(user.name)}
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && comment.trim()) {
                        e.preventDefault()
                        commentMut.mutate(comment.trim())
                      }
                    }}
                    className="mb-2 h-12 bg-input-background border-border"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => comment.trim() && commentMut.mutate(comment.trim())}
                      disabled={!comment.trim() || commentMut.isPending}
                      className="px-5 py-2 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentMut.isPending ? 'Posting…' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {comments?.items.map((c) => {
              const name = c.user_name ?? 'User'
              const isReply = c.parent_comment_id !== null
              return (
                <div
                  key={c.id}
                  className={`flex gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors ${
                    isReply ? 'ml-6 bg-primary/5 border-l-2 border-primary/30' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      c.user_role === 'teacher'
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                        : 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground'
                    }`}
                  >
                    {initialsOf(name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">{name}</span>
                      {c.user_role === 'teacher' && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs">Teacher</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{c.text}</p>
                  </div>
                </div>
              )
            })}
            {(!comments || comments.items.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">Be the first to comment.</p>
            )}
          </div>
        </div>
      </div>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
