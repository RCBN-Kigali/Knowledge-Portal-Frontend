import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X, Plus, ExternalLink as ExternalLinkIcon, Play, Headphones, FileText, Eye, Trash2, Upload } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { teacherContentApi } from '../../api/teacherContent'
import type { ContentType, ExternalLink as TExternalLink } from '../../types'

const contentTypeOptions = [
  { id: 'video' as ContentType, label: 'Video', icon: Play, description: 'Video lessons', activeColor: 'border-primary bg-primary/10', iconBg: 'bg-primary/10 text-primary' },
  { id: 'article' as ContentType, label: 'Article', icon: FileText, description: 'Text articles', activeColor: 'border-secondary bg-secondary/10', iconBg: 'bg-secondary/10 text-secondary' },
  { id: 'audio' as ContentType, label: 'Audio', icon: Headphones, description: 'Audio lessons', activeColor: 'border-accent bg-accent/10', iconBg: 'bg-accent/10 text-accent' },
]

const subjects = ['Science', 'Math', 'English', 'History', 'Career']
const grades = [
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'Primary 7',
  'Junior Secondary 1', 'Junior Secondary 2', 'Junior Secondary 3',
  'Senior 4', 'Senior 5', 'Senior 6',
]

export default function EditContent() {
  const { contentId = '' } = useParams<{ contentId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: existing, isLoading } = useQuery({
    queryKey: ['teacher-content', contentId],
    queryFn: () => teacherContentApi.get(contentId),
    enabled: !!contentId,
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [externalLinks, setExternalLinks] = useState<TExternalLink[]>([])
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState('')

  // Sync local state once data loads.
  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDescription(existing.description ?? '')
    setSubject(existing.subject)
    setGradeLevel(existing.grade_level)
    setHashtags((existing.hashtags ?? []).map(String))
    setExternalLinks(existing.external_links ?? [])
  }, [existing])

  const updateMut = useMutation({
    mutationFn: (status: 'draft' | 'pending' | undefined) =>
      teacherContentApi.update(contentId, {
        title,
        description,
        subject,
        grade_level: gradeLevel,
        hashtags,
        external_links: externalLinks,
        ...(status ? { status } : {}),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-content'] })
      navigate('/teacher/dashboard')
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : err?.message ?? 'Update failed')
    },
  })

  const deleteMut = useMutation({
    mutationFn: () => teacherContentApi.remove(contentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-content'] })
      navigate('/teacher/dashboard')
    },
  })

  const handleHashtagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault()
      const tag = hashtagInput.trim().replace(/^#/, '')
      if (!hashtags.includes(tag)) setHashtags([...hashtags, tag])
      setHashtagInput('')
    }
  }
  const removeHashtag = (tag: string) => setHashtags(hashtags.filter((t) => t !== tag))
  const addExternalLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setExternalLinks([...externalLinks, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }])
      setNewLinkLabel('')
      setNewLinkUrl('')
    }
  }
  const removeExternalLink = (i: number) => setExternalLinks(externalLinks.filter((_, idx) => idx !== i))

  if (isLoading || !existing) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-10 w-40 mb-6" />
        <Skeleton className="h-8 w-1/2 mb-6" />
        <Skeleton className="h-14 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/teacher/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Content</span>
          </Link>
          {existing.status === 'published' && (
            <Link
              to={`/student/content/${existing.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-muted transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="mb-8 text-2xl sm:text-3xl font-semibold">Edit Content</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 bg-input-background border-border text-base"
            />
          </div>

          <div>
            <label className="block mb-3 font-medium">Content Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contentTypeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = existing.content_type === option.id
                return (
                  <div
                    key={option.id}
                    className={`p-5 border-2 rounded-2xl ${
                      isSelected ? option.activeColor : 'border-muted bg-muted/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${option.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-semibold">{option.label}</h4>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Content type cannot be changed after creation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-14 bg-input-background border-border">
                  <SelectValue placeholder="Pick a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Grade level</label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger className="h-14 bg-input-background border-border">
                  <SelectValue placeholder="Pick a grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {existing.file_url && existing.content_type !== 'article' && (
            <div>
              <label className="block mb-3 font-medium">File</label>
              <div className="border-2 border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{existing.file_url.split('/').pop()}</p>
                    <p className="text-sm text-muted-foreground">Current file</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  File replacement will be added in a future update.
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block mb-3 font-medium">
              {existing.content_type === 'article' ? 'Article Content' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-4 border border-border rounded-2xl bg-input-background resize-vertical text-base ${
                existing.content_type === 'article' ? 'min-h-[400px]' : 'min-h-[120px]'
              }`}
              style={{ lineHeight: 1.6 }}
            />
            {existing.content_type === 'article' && (
              <p className="text-sm text-muted-foreground mt-2">
                Use ## for headings, - for lists, **bold** for emphasis
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-medium">Hashtags</label>
            <Input
              type="text"
              placeholder="Type hashtag and press Enter..."
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleHashtagAdd}
              className="h-12 bg-input-background border-border"
            />
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 px-3 py-2 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(tag)}
                      className="ml-2"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-3 font-medium">External Links</label>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <Input
                type="text"
                placeholder="Link label"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                className="h-12 bg-input-background border-border"
              />
              <Input
                type="url"
                placeholder="https://example.com"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="h-12 bg-input-background border-border"
              />
              <button
                type="button"
                onClick={addExternalLink}
                disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
            {externalLinks.length > 0 && (
              <div className="space-y-2 mt-3">
                {externalLinks.map((link, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <ExternalLinkIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{link.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(i)}
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
                      aria-label="Remove link"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={() => updateMut.mutate(undefined)}
              disabled={!title.trim() || updateMut.isPending}
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
            >
              {updateMut.isPending ? 'Saving…' : 'Update Content'}
            </button>
            {(existing.status === 'draft' || existing.status === 'rejected') && (
              <button
                type="button"
                onClick={() => updateMut.mutate('pending')}
                disabled={!title.trim() || updateMut.isPending}
                className="w-full px-6 py-4 bg-secondary text-secondary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 font-medium"
              >
                {existing.status === 'rejected' ? 'Resubmit for Review' : 'Submit for Review'}
              </button>
            )}
            {existing.status === 'pending' && (
              <div className="w-full px-6 py-4 bg-amber-50 border-2 border-amber-200 text-amber-800 rounded-xl text-center text-sm">
                This content is awaiting administrator review.
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full px-6 py-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Content
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-center mb-2 font-semibold text-lg">Delete Content?</h3>
            <p className="text-center text-muted-foreground mb-6">
              This will permanently remove this content and all comments. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-card border border-border rounded-xl hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMut.mutate()}
                disabled={deleteMut.isPending}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleteMut.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
