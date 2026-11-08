import React from 'react'
import PropTypes from 'prop-types'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'

/**
 * SampleDeleteConfirmDialog
 * Implements Section 12: Delete Confirmation Modal pattern.
 * Composes shared ConfirmDialog with explicit item name, destructive tone, and safety actions.
 */
export default function SampleDeleteConfirmDialog({
  isOpen,
  record,
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  if (!record) return null

  return (
    <ConfirmDialog
      open={isOpen}
      title="Delete Enterprise Record?"
      tone="delete"
      confirmLabel="Yes, Delete"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
      loading={isDeleting}
      message={`Are you sure you want to permanently delete "${record.title}" (${record.code})?`}
      description="This action cannot be undone. All linked tasks, logs, and allocation records associated with this item will be removed from local sample data."
    />
  )
}

SampleDeleteConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  record: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
}
