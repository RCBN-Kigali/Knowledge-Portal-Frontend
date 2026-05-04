import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Eye, Send } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { contentApi } from '../../api/content'
import { engagementApi } from '../../api/engagement'
import { commentsApi } from '../../api/comments'
import { Skeleton } from '../../components/ui/skeleton'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../hooks/useAuth'
import { formatDistanceToNow } from 'date-fns'

export default function ContentDetail() {
  const { contentId = '' } = useParams<{ contentId: string }>()
  const { user } = useAuth()
  const qc = useQueryClient()
  const [commentText, setCommentText] = useState('')

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
      setCommentText('')
      qc.invalidateQueries({ queryKey: ['comments', contentId] })
      qc.invalidateQueries({ queryKey: ['content', contentId] })
    },
  })

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-64 w-full mb-4 rounded-2xl" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  const likes = engagement?.likes_count ?? content.likes_count
  const dislikes = engagement?.dislikes_count ?? content.dislikes_count
  const userVote = engagement?.user_vote

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link to="/student" className="p-2 rounded-lg hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="font-medium truncate">{content.title}</h2>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {content.content_type === 'video' && content.file_url ? (
            <video src={content.file_url} controls className="w-full aspect-video bg-black" />
          ) : content.content_type === 'audio' && content.file_url ? (
            <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
              <audio src={content.file_url} controls className="w-full" />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-7xl">
              {content.content_type === 'video' ? '🎬' : content.content_type === 'audio' ? '🎧' : '📄'}
            </div>
          )}

          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{content.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{content.subject}</span>
                <span>·</span>
                <span>{content.grade_level}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {content.views_count}</span>
              </div>
            </div>

            {content.description && <p className="text-muted-foreground whitespace-pre-wrap">{content.description}</p>}

            {content.hashtags && content.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag) => (
                  <Badge key={tag as string} variant="secondary" className="bg-muted border-0">#{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant={userVote === 'like' ? 'default' : 'outline'}
                onClick={() => likeMut.mutate()}
                disabled={!user || likeMut.isPending}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likes}</span>
              </Button>
              <Button
                variant={userVote === 'dislike' ? 'default' : 'outline'}
                onClick={() => dislikeMut.mutate()}
                disabled={!user || dislikeMut.isPending}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{dislikes}</span>
              </Button>
            </div>
          </div>
        </div>

        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments ({comments?.total ?? 0})
          </h3>

          {user && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (commentText.trim()) commentMut.mutate(commentText.trim())
              }}
              className="flex gap-2 mb-6"
            >
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-input-background border-border rounded-xl"
              />
              <Button type="submit" disabled={!commentText.trim() || commentMut.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="space-y-4">
            {comments?.items.map((c) => (
              <div key={c.id} className="border-b border-border pb-3 last:border-0">
                <p className="text-sm whitespace-pre-wrap">{c.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
            {(!comments || comments.items.length === 0) && (
              <p className="text-sm text-muted-foreground">Be the first to comment.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
