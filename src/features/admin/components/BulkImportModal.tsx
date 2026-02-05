import { useState, useRef } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Alert from '../../../components/ui/Alert'
import { Upload, Download, Check, X } from 'lucide-react'
import type { CSVRow } from '../hooks/useBulkImport'

export interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
  parsedRows: CSVRow[]
  onFileUpload: (file: File) => Promise<void>
  onImport: () => Promise<{ successCount: number; failedCount: number }>
  onDownloadTemplate: () => void
  isImporting: boolean
}

function BulkImportModal({ 
  isOpen, 
  onClose, 
  parsedRows, 
  onFileUpload, 
  onImport, 
  onDownloadTemplate,
  isImporting 
}: BulkImportModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [importResult, setImportResult] = useState<{ successCount: number; failedCount: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const validCount = parsedRows.filter(r => r.isValid).length
  const invalidCount = parsedRows.filter(r => !r.isValid).length
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await onFileUpload(e.dataTransfer.files[0])
    }
  }
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await onFileUpload(e.target.files[0])
    }
  }
  
  const handleImport = async () => {
    const result = await onImport()
    setImportResult(result)
  }
  
  const handleClose = () => {
    setImportResult(null)
    onClose()
  }
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Import Users" size="xl">
      <div className="space-y-4">
        {importResult ? (
          <div className="space-y-4">
            <Alert variant={importResult.failedCount === 0 ? 'success' : 'warning'}>
              <p className="font-medium">Import Complete</p>
              <p className="text-sm mt-1">
                Successfully imported {importResult.successCount} users.
                {importResult.failedCount > 0 && ` ${importResult.failedCount} failed.`}
              </p>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        ) : parsedRows.length === 0 ? (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Upload a CSV file with user data</p>
              <Button variant="secondary" size="sm" onClick={onDownloadTemplate} leftIcon={<Download className="w-4 h-4" />}>
                Download Template
              </Button>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your CSV file here, or</p>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-3">Only .csv files are accepted</p>
            </div>
            
            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  <span className="font-medium text-success-600">{validCount} valid</span>
                  {invalidCount > 0 && (
                    <>, <span className="font-medium text-danger-600">{invalidCount} invalid</span></>
                  )}
                </span>
              </div>
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                Upload Different File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Status</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Name</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Email</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Role</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parsedRows.map((row, i) => (
                    <tr key={i} className={row.isValid ? 'bg-success-50' : 'bg-danger-50'}>
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <Check className="w-4 h-4 text-success-600" />
                        ) : (
                          <X className="w-4 h-4 text-danger-600" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-gray-900">{row.name || '-'}</td>
                      <td className="py-2 px-3 text-gray-900">{row.email || '-'}</td>
                      <td className="py-2 px-3 text-gray-900">{row.role || '-'}</td>
                      <td className="py-2 px-3 text-danger-600 text-xs">{row.errors.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleImport} 
                disabled={validCount === 0}
                loading={isImporting}
              >
                Import {validCount} Valid User{validCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default BulkImportModal
