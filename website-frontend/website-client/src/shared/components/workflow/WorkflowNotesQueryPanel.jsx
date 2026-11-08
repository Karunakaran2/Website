import PropTypes from 'prop-types'
import { FormLabel, TextAreaField, FieldHint, FieldError } from '@/shared/components/forms'
import { ActionButton } from '@/shared/components/buttons'
import WorkflowQueryHistoryTimeline from './WorkflowQueryHistoryTimeline'
import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'

const NOTES_MAX = 500
const QUERY_MAX = 1000

/**
 * Reusable Notes + Query sections for workflow forms (reference pattern aligned with
 * Probity VoucherNotesQuerySection — presentation only; parent owns save/mutation).
 */
export default function WorkflowNotesQueryPanel({
  notes = '',
  onNotesChange,
  onSaveNotes,
  saveNotesLoading = false,
  savedNotes = [],
  canEditNotes = true,
  queryDraft = '',
  onQueryDraftChange,
  onRaiseQuery,
  raiseQueryLoading = false,
  queryHistory = [],
  canRaiseQuery = true,
  queryFileName = '',
  onQueryFileChange,
  queryFileError = '',
  className = '',
}) {
  const notesLength = notes?.length ?? 0

  return (
    <div className={`grid grid-cols-1 gap-5 lg:grid-cols-2 ${className}`}>
      <section className={`${PAGE_SECTION_SHELL_CLASS} p-4 space-y-3`} aria-labelledby="wf-notes-heading">
        <h2 id="wf-notes-heading" className="text-sm font-bold text-slate-900">
          Notes
        </h2>
        <FieldHint>Internal remarks saved with the record. Not shown on printed outputs unless configured.</FieldHint>

        {savedNotes.length > 0 ? (
          <ul className="space-y-2 border-b border-slate-100 pb-3">
            {savedNotes.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-700">
                <p className="whitespace-pre-wrap">{entry.text}</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  {entry.author ? `${entry.author} · ` : ''}
                  {entry.savedOn || 'Saved'}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {canEditNotes ? (
          <>
            <TextAreaField
              id="workflow-notes"
              name="workflowNotes"
              label="Add note"
              rows={4}
              value={notes}
              onChange={(e) => onNotesChange?.(e.target.value)}
              hint={`${notesLength}/${NOTES_MAX} characters`}
              maxLength={NOTES_MAX}
            />
            <div className="flex justify-end">
              <ActionButton
                type="button"
                variant="save"
                disabled={!notes.trim() || saveNotesLoading}
                onClick={onSaveNotes}
                className="text-xs"
              >
                {saveNotesLoading ? 'Saving…' : 'Save note'}
              </ActionButton>
            </div>
          </>
        ) : (
          <FieldHint>You do not have permission to add notes on this record.</FieldHint>
        )}
      </section>

      <section className={`${PAGE_SECTION_SHELL_CLASS} p-4 space-y-3`} aria-labelledby="wf-query-heading">
        <h2 id="wf-query-heading" className="text-sm font-bold text-slate-900">
          Query
        </h2>
        <FieldHint>Raise a query for clarification. Attach supporting documents when required.</FieldHint>

        {canRaiseQuery ? (
          <>
            <TextAreaField
              id="workflow-query"
              name="workflowQuery"
              label="New query"
              rows={4}
              value={queryDraft}
              onChange={(e) => onQueryDraftChange?.(e.target.value)}
              maxLength={QUERY_MAX}
            />
            <div>
              <FormLabel htmlFor="workflow-query-file">Attachment (optional)</FormLabel>
              <input
                id="workflow-query-file"
                type="file"
                className="mt-1 block w-full max-w-md text-xs text-slate-700 file:mr-3 file:rounded file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium"
                onChange={(e) => onQueryFileChange?.(e.target.files?.[0] ?? null)}
              />
              {queryFileName ? (
                <FieldHint className="mt-1">Selected: {queryFileName}</FieldHint>
              ) : null}
              <FieldError message={queryFileError} />
              <FieldHint className="mt-2">
                Query text is sent only when you click Raise query — it is not saved with the main form until then.
              </FieldHint>
            </div>
            <div className="flex justify-end">
              <ActionButton
                type="button"
                variant="primary"
                disabled={!queryDraft.trim() || raiseQueryLoading}
                onClick={onRaiseQuery}
                className="text-xs"
              >
                {raiseQueryLoading ? 'Sending…' : 'Raise query'}
              </ActionButton>
            </div>
          </>
        ) : (
          <FieldHint>You do not have permission to raise queries on this record.</FieldHint>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <FormLabel as="span" label="Query history" />
          <WorkflowQueryHistoryTimeline queries={queryHistory} />
        </div>
      </section>
    </div>
  )
}

WorkflowNotesQueryPanel.propTypes = {
  notes: PropTypes.string,
  onNotesChange: PropTypes.func,
  onSaveNotes: PropTypes.func,
  saveNotesLoading: PropTypes.bool,
  savedNotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      author: PropTypes.string,
      savedOn: PropTypes.string,
    }),
  ),
  canEditNotes: PropTypes.bool,
  queryDraft: PropTypes.string,
  onQueryDraftChange: PropTypes.func,
  onRaiseQuery: PropTypes.func,
  raiseQueryLoading: PropTypes.bool,
  queryHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      status: PropTypes.string,
      raisedOn: PropTypes.string,
      response: PropTypes.string,
    }),
  ),
  canRaiseQuery: PropTypes.bool,
  queryFileName: PropTypes.string,
  onQueryFileChange: PropTypes.func,
  queryFileError: PropTypes.string,
  className: PropTypes.string,
}
