import { Loader2 } from 'lucide-react'
import { PrimaryButton, ActionButton, CancelButton } from '@/shared/components/buttons'
import { GigwButton, GigwIconButton } from '@/shared/components/buttons/gigw'
import { GIGW_ADD_ICON, GIGW_EDIT_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import { WORKBENCH_PREVIEW_ROW_CLASS } from '../constants/workbenchPreviewStyles'

export function actionsPreviewForTab(tab) {
  switch (tab) {
    case 'icon-buttons':
      return (
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <GigwIconButton icon={GIGW_EDIT_ICON} tooltip="Edit record" aria-label="Edit record" />
          <GigwButton variant="primary" icon={GIGW_ADD_ICON}>
            Add
          </GigwButton>
        </div>
      )
    case 'button-groups':
      return (
        <div className={`${WORKBENCH_PREVIEW_ROW_CLASS} gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3`}>
          <PrimaryButton type="button">Save</PrimaryButton>
          <ActionButton type="button">Export</ActionButton>
          <CancelButton type="button">Cancel</CancelButton>
        </div>
      )
    case 'action-states':
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PrimaryButton type="button">Default</PrimaryButton>
          <PrimaryButton type="button" disabled>
            Disabled
          </PrimaryButton>
          <PrimaryButton type="button" className="pointer-events-none opacity-80" aria-busy="true">
            <Loader2 className="mr-1 inline h-4 w-4 animate-spin" aria-hidden />
            Saving…
          </PrimaryButton>
          <PrimaryButton type="button" className="ring-2 ring-[#01458e] ring-offset-2">
            Focus ring
          </PrimaryButton>
        </div>
      )
    case 'buttons':
    default:
      return (
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <PrimaryButton type="button">Primary</PrimaryButton>
          <ActionButton type="button">Secondary</ActionButton>
          <CancelButton type="button">Cancel</CancelButton>
        </div>
      )
  }
}

export function actionsCodeForTab(tab) {
  const map = {
    buttons: `import { PrimaryButton, ActionButton, CancelButton } from '@/shared/components/buttons'`,
    'icon-buttons': `import { GigwButton, GigwIconButton } from '@/shared/components/buttons/gigw'
import { GIGW_EDIT_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'`,
    'button-groups': `import { DomainListPageHeaderActions } from '@/shared/components/domain'`,
    'action-states': `<PrimaryButton disabled={isPending} aria-busy={isPending}>
  {isPending ? 'Saving…' : 'Save'}
</PrimaryButton>`,
  }
  return map[tab] || map.buttons
}

export function actionsUsageForTab(tab) {
  const map = {
    buttons: (
      <p>
        List <strong>Add</strong> uses <code>DomainListPageHeaderActions</code> + GIGW add icon — not legacy{' '}
        <code>ActionButton variant=&quot;add&quot;</code>.
      </p>
    ),
    'icon-buttons': (
      <p>
        Table rows: ≤3 actions inline; &gt;3 → first two + ⋮ overflow. Use <code>TableViewAction</code>, not raw icons.
      </p>
    ),
    'button-groups': (
      <p>Modal footers: Cancel → workflow → Save. Page headers: title left, actions right via shell context.</p>
    ),
    'action-states': (
      <p>Disable submit while mutation pending; show loading on the button that was clicked, not a full-page swap.</p>
    ),
  }
  return <div className="space-y-3">{map[tab] || map.buttons}</div>
}
