export function setupFormModalTitle(master, editingId, { editLabel = 'Edit', addLabel = 'Add' } = {}) {
  const name = master?.title || master?.formTitle || 'Record'
  return editingId ? `${editLabel} — ${name}` : `${addLabel} — ${name}`
}

/** Footer primary label for setup add/edit modals. */
export function setupFormSubmitLabel(master, editingId) {
  if (editingId) {
    return master?.formUpdateLabel || 'Update'
  }
  return 'Save'
}
