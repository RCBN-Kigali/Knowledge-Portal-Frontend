import { useState, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { Upload, X, File, Image, AlertCircle } from 'lucide-react'
import ProgressBar from './ProgressBar'

export interface UploadedFile {
  file: File
  progress?: number
  status?: 'pending' | 'uploading' | 'complete' | 'error'
  preview?: string
  error?: string
}

export interface FileUploadProps {
  accept?: string
  maxSize?: number
  multiple?: boolean
  onUpload?: (files: File[]) => void
  onRemove?: (index: number) => void
  files?: UploadedFile[]
  disabled?: boolean
  className?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function FileUpload({
  accept,
  maxSize,
  multiple = false,
  onUpload,
  onRemove,
  files = [],
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return
      const arr = Array.from(fileList)
      const valid = maxSize ? arr.filter((f) => f.size <= maxSize) : arr
      if (valid.length > 0) onUpload?.(valid)
    },
    [disabled, maxSize, onUpload]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const isImage = (file: File) => file.type.startsWith('image/')

  return (
    <div className={clsx('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        <Upload className={clsx('w-10 h-10 mx-auto mb-3', isDragging ? 'text-primary-500' : 'text-gray-400')} />
        <p className="text-sm font-medium text-gray-700">
          Drag and drop files here, or <span className="text-primary-600">browse</span>
        </p>
        {maxSize && (
          <p className="text-xs text-gray-500 mt-1">
            Max file size: {formatFileSize(maxSize)}
          </p>
        )}
        {accept && (
          <p className="text-xs text-gray-500 mt-0.5">
            Accepted: {accept}
          </p>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, index) => (
            <div
              key={index}
              className={clsx(
                'flex items-center gap-3 p-3 border rounded-lg',
                item.status === 'error' ? 'border-danger-200 bg-danger-50' : 'border-gray-200'
              )}
            >
              {/* Preview / Icon */}
              {item.preview && isImage(item.file) ? (
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  {isImage(item.file) ? (
                    <Image className="w-5 h-5 text-gray-400" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
                {item.status === 'uploading' && item.progress !== undefined && (
                  <ProgressBar value={item.progress} size="sm" className="mt-1" />
                )}
                {item.status === 'error' && item.error && (
                  <p className="text-xs text-danger-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" />
                    {item.error}
                  </p>
                )}
              </div>

              {/* Remove */}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
