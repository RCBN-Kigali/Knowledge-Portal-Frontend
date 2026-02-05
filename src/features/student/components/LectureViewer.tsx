import { CheckCircle2 } from 'lucide-react'
import { Button, Spinner } from '../../../components/ui'
import type { Lesson } from '../../../types'

interface LectureViewerProps {
  lesson: Lesson
  isCompleting: boolean
  onComplete: () => void
}

function LectureViewer({ lesson, isCompleting, onComplete }: LectureViewerProps) {
  return (
    <div className="space-y-6">
      {lesson.content?.videoUrl && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            src={lesson.content.videoUrl}
            controls
            className="w-full h-full"
            controlsList="nodownload"
          />
        </div>
      )}

      {lesson.content?.text && (
        <div
          className="prose prose-sm sm:prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: lesson.content.text }}
        />
      )}

      {!lesson.isCompleted && (
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={onComplete}
            loading={isCompleting}
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  )
}

export default LectureViewer
