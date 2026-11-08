import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import GigwIconGallery from '../components/GigwIconGallery'
import TableRowActionsLiveStrip from '../components/TableRowActionsLiveStrip'
import WorkbenchDemoSection from '../components/WorkbenchDemoSection'
import WorkbenchSubsectionTitle from '../components/WorkbenchSubsectionTitle'
import {
  GigwIconButton,
  GIGW_EDIT_ICON,
  GIGW_ADD_ICON,
  GIGW_SUBMIT_ICON,
  GIGW_FREEZE_ICON,
} from '@/shared/components/buttons'

export default function IconButtonsActionPage() {
  const [lastAction, setLastAction] = useState(null)

  const triggerAction = (label) => {
    setLastAction({
      label,
      time: new Date().toLocaleTimeString(),
    })
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <GigwIconGallery showCommonUi={false} />

      <WorkbenchDemoSection
        title="GIGW action icon buttons (GigwIconButton)"
        description="36×36px touch box, accessible tooltips, tone hover feedback, and visible focus rings."
      >
        <div className="space-y-6">
          <div>
            <WorkbenchSubsectionTitle title="Standard tone variations" />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={Eye}
                  tone="info"
                  title="View Record Details"
                  onClick={() => triggerAction('View (tone="info")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;info&quot;</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={GIGW_EDIT_ICON}
                  tone="info"
                  title="Edit Master Entry"
                  onClick={() => triggerAction('Edit (tone="info")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;info&quot;</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={GIGW_ADD_ICON}
                  tone="success"
                  title="Add Sub-Item"
                  onClick={() => triggerAction('Add (tone="success")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;success&quot;</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={GIGW_SUBMIT_ICON}
                  tone="success"
                  title="Submit for Approval"
                  onClick={() => triggerAction('Submit (tone="success")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;success&quot;</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={Trash2}
                  tone="destructive"
                  title="Delete Entry"
                  onClick={() => triggerAction('Delete (tone="destructive")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;destructive&quot;</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <GigwIconButton
                  icon={GIGW_FREEZE_ICON}
                  tone="neutral"
                  title="Freeze Period Ledger"
                  onClick={() => triggerAction('Freeze (tone="neutral")')}
                />
                <span className="text-[10px] text-slate-500 font-mono">tone=&quot;neutral&quot;</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <WorkbenchSubsectionTitle title="Table row action shorthands" />
            <p className="mb-4 text-[13px] text-slate-600">
              Pre-composed row action components with default icons, semantic tones, and localized accessibility tooltips.
            </p>
            <TableRowActionsLiveStrip onAction={(label) => triggerAction(label)} />
          </div>
        </div>
      </WorkbenchDemoSection>

      <WorkbenchDemoSection
        title="Disabled states & tooltips"
        description="Disabled action icon buttons use muted opacity and not-allowed cursor while blocking pointer and keyboard activation."
      >

        <div className="flex flex-wrap items-center gap-4">
          <GigwIconButton
            icon={Eye}
            tone="info"
            disabled
            title="Disabled view action"
          />
          <GigwIconButton
            icon={GIGW_EDIT_ICON}
            tone="info"
            disabled
            title="Disabled edit action"
          />
          <GigwIconButton
            icon={Trash2}
            tone="destructive"
            disabled
            title="Disabled delete action"
          />
        </div>

        {/* Telemetry Display */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-50 p-4 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Last Action Invoked: </span>
            <strong className="text-slate-900">
              {lastAction ? `${lastAction.label} at ${lastAction.time}` : 'None yet (Hover for tooltip or click any icon button)'}
            </strong>
          </div>
          {lastAction && (
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="text-xs font-semibold text-[#01458e] underline hover:text-[#003366]"
            >
              Clear log
            </button>
          )}
        </div>
      </WorkbenchDemoSection>
    </div>
  )
}
