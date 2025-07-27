'use client'

import { useState } from 'react'
import { TrashIcon, ArchiveBoxIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '@marketplace/ui'

type BulkActionsProps = {
  selectedCount: number
  onAction: (action: string) => void
  disabled?: boolean
}

export default function BulkActions({ selectedCount, onAction, disabled }: BulkActionsProps) {
  const [action, setAction] = useState('')

  const handleApply = () => {
    if (action) {
      onAction(action)
      setAction('')
    }
  }

  return (
    <div className={`transition-all duration-200 ${selectedCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-blue-700">
          {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
        </p>
        
        <div className="flex items-center gap-3">
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-48 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={disabled}
          >
            <option value="">Select action...</option>
            <option value="publish">Publish</option>
            <option value="draft">Set as Draft</option>
            <option value="delete">Delete</option>
            <option value="duplicate">Duplicate</option>
          </select>
          
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!action || disabled}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}