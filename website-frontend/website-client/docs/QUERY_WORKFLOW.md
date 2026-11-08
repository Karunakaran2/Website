# Workflow queries — Design System vs Probity

## Probity reference

Probity Client implements voucher queries in:

- `src/domain/accounting/components/VoucherQueryList.jsx`
- `src/domain/accounting/components/VoucherNotesQuerySection.jsx`

Those components depend on RTK Query endpoints (attachment list by context ref, voucher save/query mutations) and accounting-specific permissions. **Do not copy them into the Design System wholesale.**

## Design System integration (current)

| Piece | Role |
|-------|------|
| `WorkflowNotesQueryPanel` | Editable notes + raise-query form; parent owns all persistence |
| `WorkflowQueryHistoryTimeline` | Read-only timeline (Probity list **presentation** only) |

Sample Module **Forms** demonstrates mock save/raise behaviour: notes and queries appear in history **only after** explicit Save note / Raise query actions — not when the main sanction form is submitted.

## Required backend interface (for full parity)

When real APIs exist, a domain adapter should provide:

```typescript
type WorkflowQueryRow = {
  idMask: string
  remarks: string
  status: 'Open' | 'Responded' | 'Resolved' | string
  queriedOn: string // ISO or API date
  response?: string
  respondedOn?: string
  attachments?: { idMask: string; name: string }[]
}

// List history for a parent record (voucher, asset workflow, etc.)
getQueriesByContextRef(contextRef: string): Promise<WorkflowQueryRow[]>

// Raise query (may require parent record saved first)
raiseQuery(payload: {
  contextRef: string
  remarks: string
  attachmentIds?: string[]
}): Promise<WorkflowQueryRow>

// Respond / resolve (role-gated)
respondToQuery(idMask: string, payload: { response: string }): Promise<WorkflowQueryRow>
resolveQuery(idMask: string): Promise<WorkflowQueryRow>

// Attachments (optional; mirrors Probity attachment-by-context)
uploadQueryAttachment(file: File, contextRef: string): Promise<{ idMask: string; name: string }>
getAttachmentDetailsListByContextRef(contextRef: string): Promise<AttachmentMeta[]>
```

**Permissions:** gate raise, respond, and resolve actions in the parent screen (same as Probity voucher footer).

**Parent save semantics:** if the product requires the parent document to exist before a query, disable Raise query until `idMask` is assigned and show inline hint — do not POST queries against a unsaved parent.

## Status

- **Integrated:** presentation timeline + panel wiring in Sample Module (mock persistence).
- **Deferred:** RTK/voucher attachment APIs and production query mutations until backend contracts are available in this repo.
