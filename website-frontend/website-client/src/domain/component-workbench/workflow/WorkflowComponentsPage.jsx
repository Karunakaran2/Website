import { useState } from 'react'
import { WorkflowNotesQueryPanel } from '@/shared/components/workflow'
import { WORKBENCH_SECTION_CARD_CLASS } from '../constants/workbenchPreviewStyles'
import { showAppToast } from '@/shared/components/toast/appToast'

export default function WorkflowComponentsPage() {
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState([
    {
      id: 'n1',
      text: 'Verified supporting documents against physical asset tag.',
      author: 'Demo Verifier',
      savedOn: '01-11-2026 10:15',
    },
  ])
  const [queryDraft, setQueryDraft] = useState('')
  const [queryHistory, setQueryHistory] = useState([
    {
      id: 'q1',
      text: 'Please attach custodian acceptance note.',
      raisedOn: '2026-10-28T10:00:00',
      status: 'Open',
    },
  ])
  const [saveLoading, setSaveLoading] = useState(false)
  const [raiseLoading, setRaiseLoading] = useState(false)

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Workflow UI</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          <code className="text-[12px]">WorkflowNotesQueryPanel</code> — notes list, new note entry,
          query draft, and query history timeline. Parent owns save/mutation; this demo updates local
          state only.
        </p>
      </div>

      <WorkflowNotesQueryPanel
        notes={notes}
        onNotesChange={setNotes}
        savedNotes={savedNotes}
        onSaveNotes={() => {
          if (!notes.trim()) return
          setSaveLoading(true)
          window.setTimeout(() => {
            setSavedNotes((prev) => [
              ...prev,
              {
                id: `n-${Date.now()}`,
                text: notes.trim(),
                author: 'Workbench Demo',
                savedOn: new Date().toLocaleString(),
              },
            ])
            setNotes('')
            setSaveLoading(false)
            showAppToast('Note saved (demo).', 'success', { action: 'save' })
          }, 600)
        }}
        saveNotesLoading={saveLoading}
        queryDraft={queryDraft}
        onQueryDraftChange={setQueryDraft}
        queryHistory={queryHistory}
        onRaiseQuery={() => {
          if (!queryDraft.trim()) return
          setRaiseLoading(true)
          window.setTimeout(() => {
            setQueryHistory((prev) => [
              ...prev,
              {
                id: `q-${Date.now()}`,
                text: queryDraft.trim(),
                raisedOn: new Date().toISOString(),
                status: 'Open',
              },
            ])
            setQueryDraft('')
            setRaiseLoading(false)
            showAppToast('Query raised (demo).', 'success', { action: 'submit' })
          }, 600)
        }}
        raiseQueryLoading={raiseLoading}
      />
    </div>
  )
}
