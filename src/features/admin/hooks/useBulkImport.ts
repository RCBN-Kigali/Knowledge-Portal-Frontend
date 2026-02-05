import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface CSVRow {
  name: string
  email: string
  role: string
  isValid: boolean
  errors: string[]
}

export interface BulkImportResult {
  successCount: number
  failedCount: number
  errors: { row: number; email: string; error: string }[]
}

export function useBulkImport() {
  const queryClient = useQueryClient()
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([])

  const parseCSV = (content: string): CSVRow[] => {
    const lines = content.trim().split('\n')
    if (lines.length < 2) return []

    // Skip header row
    const dataLines = lines.slice(1)
    const existingEmails = new Set(['jean@student.edu', 'marie@student.edu']) // Mock existing

    return dataLines.map(line => {
      const [name, email, role] = line.split(',').map(s => s.trim())
      const errors: string[] = []

      if (!name) errors.push('Name is required')
      if (!email) errors.push('Email is required')
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format')
      else if (existingEmails.has(email)) errors.push('Email already exists')
      if (!role) errors.push('Role is required')
      else if (!['school_student', 'school_teacher'].includes(role)) errors.push('Invalid role')

      return {
        name: name || '',
        email: email || '',
        role: role || '',
        isValid: errors.length === 0,
        errors,
      }
    })
  }

  const handleFileUpload = async (file: File): Promise<void> => {
    const content = await file.text()
    const rows = parseCSV(content)
    setParsedRows(rows)
  }

  const importMutation = useMutation({
    mutationFn: async (rows: CSVRow[]): Promise<BulkImportResult> => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const validRows = rows.filter(r => r.isValid)
      const invalidRows = rows.filter(r => !r.isValid)

      return {
        successCount: validRows.length,
        failedCount: invalidRows.length,
        errors: invalidRows.map((r, i) => ({
          row: i + 2,
          email: r.email,
          error: r.errors.join(', '),
        })),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    },
  })

  const importUsers = async (): Promise<BulkImportResult> => {
    return importMutation.mutateAsync(parsedRows)
  }

  const clearParsedRows = () => {
    setParsedRows([])
  }

  const downloadTemplate = () => {
    const template = 'name,email,role\nJohn Doe,john@example.com,school_student\nJane Smith,jane@example.com,school_teacher'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_import_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    parsedRows,
    handleFileUpload,
    importUsers,
    clearParsedRows,
    downloadTemplate,
    isImporting: importMutation.isPending,
  }
}
