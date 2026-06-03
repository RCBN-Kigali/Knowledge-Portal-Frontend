import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Plus, ExternalLink, Play, Headphones, FileText } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { teacherContentApi } from '../../api/teacherContent'
import { careerOptions } from '../../lib/careers'
import type { ContentType, ExternalLink as TExternalLink } from '../../types'

const contentTypeOptions = [
  {
    id: 'video' as ContentType,
    label: 'Video',
    icon: Play,
    description: 'Upload video lessons',
    formats: 'MP4, MOV, AVI',
    maxSize: '500MB',
    color: 'border-primary/30 hover:border-primary hover:bg-primary/5',
    activeColor: 'border-primary bg-primary/10',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'article' as ContentType,
    label: 'Article',
    icon: FileText,
    description: 'Write text articles',
    formats: 'Rich text editor',
    maxSize: 'N/A',
    color: 'border-secondary/30 hover:border-secondary hover:bg-secondary/5',
    activeColor: 'border-secondary bg-secondary/10',
    iconBg: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'audio' as ContentType,
    label: 'Audio',
    icon: Headphones,
    description: 'Upload audio lessons',
    formats: 'MP3, WAV, M4A',
    maxSize: '200MB',
    color: 'border-accent/30 hover:border-accent hover:bg-accent/5',
    activeColor: 'border-accent bg-accent/10',
    iconBg: 'bg-accent/10 text-accent',
  },
]

const subjects = ['Science', 'Math', 'English', 'History', 'Career']
const levels = ['Beginner', 'Intermediate', 'Advanced']

export default function UploadContent() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [title, setTitle] = useState('')
  const [contentType, setContentType] = useState<ContentType | ''>('')
  const [description, setDescription] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [subject, setSubject] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [career, setCareer] = useState('')
  const [externalLinks, setExternalLinks] = useState<TExternalLink[]>([])
  const [newLinkLabel, setNewLinkLabel] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // The upload runs in the background: we navigate away immediately and report
  // progress via toasts, so the teacher is never held on a spinner.
  const uploadMut = useMutation({
    mutationFn: (publish: boolean) => {
      if (!contentType) throw new Error('Pick a content type')
      // For articles, the backend has only `description`, so we put the full body there.
      const desc = contentType === 'article' ? articleBody : description
      return teacherContentApi.create({
        title: title.trim(),
        description: desc,
        content_type: contentType,
        subject,
        grade_level: gradeLevel,
        career: career || null,
        external_links: externalLinks,
        publish,
        file: contentType !== 'article' ? uploadedFile : null,
      })
    },
    onSuccess: (_data, publish) => {
      qc.invalidateQueries({ queryKey: ['teacher-content', 'list'] })
      toast.success(publish ? 'Submitted for review' : 'Saved as draft', { id: 'upload' })
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : err?.message ?? 'Upload failed', { id: 'upload' })
    },
  })

  const submit = (publish: boolean) => {
    toast.loading('Uploading…', { id: 'upload' })
    uploadMut.mutate(publish)
    navigate('/teacher/dashboard')
  }

  const addExternalLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setExternalLinks([...externalLinks, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }])
      setNewLinkLabel('')
      setNewLinkUrl('')
    }
  }

  const removeExternalLink = (i: number) => setExternalLinks(externalLinks.filter((_, idx) => idx !== i))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const canSubmit =
    !!title.trim() &&
    !!contentType &&
    !!subject &&
    !!gradeLevel &&
    (contentType === 'article' ? articleBody.trim().length > 0 : !!uploadedFile)

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/teacher/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Content</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="mb-8 text-2xl sm:text-3xl font-semibold">Create New Content</h1>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <Input
              type="text"
              placeholder="Enter content title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-14 bg-input-background border-border text-base"
            />
          </div>

          {/* Content type selector */}
          <div>
            <label className="block mb-3 font-medium">Content Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contentTypeOptions.map((option) => {
                const Icon = option.icon
                const isSelected = contentType === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setContentType(option.id)}
                    className={`p-5 border-2 rounded-2xl transition-all text-left ${
                      isSelected ? option.activeColor : option.color
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
                    <div className="text-xs text-muted-foreground border-t border-border pt-3">
                      <div>Formats: {option.formats}</div>
                      <div>Max size: {option.maxSize}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subject + Level */}
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
              <label className="block mb-2 font-medium">Level</label>
              <Select value={gradeLevel} onValueChange={setGradeLevel}>
                <SelectTrigger className="h-14 bg-input-background border-border">
                  <SelectValue placeholder="Pick a level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File upload (video/audio) */}
          {contentType && contentType !== 'article' && (
            <div>
              <label className="block mb-3 font-medium">Upload File</label>
              <label
                htmlFor="content-file"
                className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer block"
              >
                {uploadedFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB · Click to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Tap to browse files</p>
                      <p className="text-sm text-muted-foreground">
                        {contentType === 'video' ? 'MP4, MOV, AVI · Max 500MB' : 'MP3, WAV, M4A · Max 200MB'}
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="content-file"
                  type="file"
                  accept={contentType === 'video' ? 'video/*' : 'audio/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Article body */}
          {contentType === 'article' && (
            <div>
              <label className="block mb-3 font-medium">Article Content</label>
              <textarea
                value={articleBody}
                onChange={(e) => setArticleBody(e.target.value)}
                placeholder="Write your article content here... You can use markdown formatting."
                className="w-full min-h-[400px] p-4 border border-border rounded-2xl bg-input-background resize-vertical text-base"
                style={{ lineHeight: 1.6 }}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Use ## for headings, - for lists, **bold** for emphasis
              </p>
            </div>
          )}

          {/* Description (optional, for non-articles) */}
          {contentType !== 'article' && (
            <div>
              <label className="block mb-3 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn..."
                className="w-full min-h-[120px] p-4 border border-border rounded-2xl bg-input-background resize-vertical text-base"
                style={{ lineHeight: 1.6 }}
              />
            </div>
          )}

          {/* Career */}
          <div>
            <label className="block mb-3 font-medium">Career (Optional)</label>
            <Select value={career} onValueChange={setCareer}>
              <SelectTrigger className="h-14 bg-input-background border-border">
                <SelectValue placeholder="Link this content to a career" />
              </SelectTrigger>
              <SelectContent>
                {careerOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* External links */}
          <div>
            <label className="block mb-3 font-medium">External Links (Optional)</label>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <Input
                type="text"
                placeholder="Link label (e.g., 'Practice Problems')"
                value={newLinkLabel}
                onChange={(e) => setNewLinkLabel(e.target.value)}
                className="h-12 bg-input-background border-border"
              />
              <Input
                type="url"
                placeholder="URL (e.g., 'https://example.com')"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                className="h-12 bg-input-background border-border"
              />
              <button
                type="button"
                onClick={addExternalLink}
                disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
            {externalLinks.length > 0 && (
              <div className="space-y-2 mt-3">
                {externalLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{link.label}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(idx)}
                      className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center flex-shrink-0"
                      aria-label="Remove link"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => submit(true)}
              disabled={!canSubmit}
              className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Submit for Review
            </button>
            <button
              type="button"
              onClick={() => submit(false)}
              disabled={!canSubmit}
              className="flex-1 px-6 py-4 bg-card border-2 border-border text-foreground rounded-xl hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Save as Draft
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center pt-1">
            Submitted content goes to an administrator for review before becoming
            visible to students.
          </p>
        </div>
      </div>
    </div>
  )
}
