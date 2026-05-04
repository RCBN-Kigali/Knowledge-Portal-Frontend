import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  X,
  Calendar,
  ExternalLink,
  FileText,
  Headphones,
  Play,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { adminApi } from '../../api/admin'
import { format } from 'date-fns'
import type { Content, ContentType } from '../../types'

function getContentIcon(type: ContentType) {
  switch (type) {
    case 'video':
      return Play
    case 'audio':
      return Headphones
    case 'article':
      return FileText
  }
}

function ArticleBody({ text }: { text: string }) {
  const blocks = useMemo(
    () => text.split(/\n{2,}/).filter((b) => b.trim().length > 0),
    [text],
  )
  return (
    <div className="space-y-6 text-foreground" style={{ lineHeight: 1.7 }}>
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
          <p key={idx} className="text-muted-foreground whitespace-pre-wrap">
            {para}
          </p>
        )
      })}
    </div>
  )
}

function statusBadge(status: Content['status']): { label: string; classes: string } {
  switch (status) {
    case 'published':
      return { label: 'Published', classes: 'bg-green-500 text-white border-0' }
    case 'pending':
      return { label: 'Pending review', classes: 'bg-muted text-foreground border-0' }
    case 'rejected':
      return { label: 'Rejected', classes: 'bg-red-100 text-red-700 border-0' }
    default:
      return { label: 'Draft', classes: 'bg-muted text-muted-foreground border-0' }
  }
}

export default function ContentReview() {
  const { contentId = '' } = useParams<{ contentId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [confirm, setConfirm] = useState<'approve' | 'reject' | null>(null)

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin', 'content', contentId],
    queryFn: () => adminApi.getContent(contentId),
    enabled: !!contentId,
  })

  const approveMut = useMutation({
    mutationFn: () => adminApi.approveContent(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      navigate('/admin/approvals')
    },
  })
  const rejectMut = useMutation({
    mutationFn: () => adminApi.rejectContent(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin'] })
      navigate('/admin/approvals')
    },
  })

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <header className="bg-card border-b border-border sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <Link
              to="/admin/approvals"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to reviews</span>
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

  const Icon = getContentIcon(content.content_type)
  const badge = statusBadge(content.status)
  const isPending = content.status === 'pending'

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-12">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link
            to="/admin/approvals"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to reviews</span>
          </Link>
          <Badge className={badge.classes}>{badge.label}</Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Media */}
        {content.content_type === 'video' && content.file_url && (
          <video src={content.file_url} controls className="w-full aspect-video rounded-2xl bg-black" />
        )}
        {content.content_type === 'audio' && content.file_url && (
          <div className="bg-card border border-border rounded-2xl p-8">
            <audio src={content.file_url} controls className="w-full" />
          </div>
        )}
        {content.content_type !== 'article' && !content.file_url && (
          <div className="bg-muted border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No media file was uploaded with this submission.
          </div>
        )}

        {/* Title + meta */}
        <div>
          <h1 className="mb-3 text-2xl sm:text-3xl font-semibold leading-tight">{content.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap mb-4">
            <span className="flex items-center gap-1">
              <Icon className="w-4 h-4" />
              <span className="capitalize">{content.content_type}</span>
            </span>
            <Badge variant="secondary" className="bg-muted border-0 text-xs">
              {content.subject}
            </Badge>
            <span>{content.grade_level}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Submitted {format(new Date(content.created_at), 'PPP')}
            </span>
          </div>

          {content.hashtags && content.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag) => (
                <Badge
                  key={String(tag)}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 px-3 py-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        {content.content_type === 'article' && content.description && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 lg:p-10">
            <ArticleBody text={content.description} />
          </div>
        )}

        {content.content_type !== 'article' && content.description && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="mb-3 font-semibold text-lg">About this lesson</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content.description}
            </p>
          </div>
        )}

        {/* External links */}
        {content.external_links && content.external_links.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="mb-4 font-semibold text-lg">Additional resources</h3>
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

        {/* Decision */}
        {isPending ? (
          <div className="sticky bottom-4 lg:bottom-0 lg:relative bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setConfirm('approve')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            >
              <Check className="w-5 h-5" />
              <span>Approve & Publish</span>
            </button>
            <button
              onClick={() => setConfirm('reject')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
            >
              <X className="w-5 h-5" />
              <span>Reject</span>
            </button>
          </div>
        ) : (
          <div className="bg-muted border border-border rounded-2xl p-5 text-sm text-muted-foreground text-center">
            This content is no longer pending review. Current status:{' '}
            <span className="font-medium">{badge.label}</span>.
          </div>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div
              className={`w-12 h-12 rounded-full ${
                confirm === 'approve'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              } flex items-center justify-center mx-auto mb-4`}
            >
              {confirm === 'approve' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </div>
            <h3 className="text-center mb-2 font-semibold text-lg">
              {confirm === 'approve' ? 'Publish this content?' : 'Reject this content?'}
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              {confirm === 'approve'
                ? 'It becomes visible to all students immediately.'
                : 'The teacher sees a Rejected badge and can edit and resubmit.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => (confirm === 'approve' ? approveMut.mutate() : rejectMut.mutate())}
                disabled={approveMut.isPending || rejectMut.isPending}
                className={`flex-1 px-6 py-3 rounded-xl transition-all disabled:opacity-50 ${
                  confirm === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {approveMut.isPending || rejectMut.isPending ? 'Working…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
