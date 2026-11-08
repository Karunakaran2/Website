import { useState } from 'react'
import ActionIconTooltip from '@/shared/components/buttons/gigw/ActionIconTooltip'
import { GigwIconButton } from '@/shared/components/buttons/gigw'
import { GIGW_EDIT_ICON, GIGW_VERIFY_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import { getModuleRoute } from '@/shared/constants'
import { Link } from 'react-router-dom'
import {
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

export default function TooltipsFeedbackPage() {
  const [clicks, setClicks] = useState(0)

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">ActionIconTooltip</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Custom tooltip for icon-only controls. Closes on pointer down / click and stays closed until
          a new hover (GIGW requirement). Table row actions use the same behavior via{' '}
          <code className="text-[12px]">GigwIconButton</code> <code className="text-[12px]">tooltip</code> prop.
        </p>
        <p className="mt-2 text-[13px]">
          <Link className="font-semibold text-[#01458e] hover:underline" to={getModuleRoute('actions', 'table-row-actions')}>
            Open full table row actions matrix
          </Link>
        </p>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-3">Hover to show label</h3>
        <div className={WORKBENCH_PREVIEW_ROW_CLASS}>
          <ActionIconTooltip label="Edit record">
            <GigwIconButton
              icon={GIGW_EDIT_ICON}
              tone="info"
              aria-label="Edit record"
              onClick={() => setClicks((c) => c + 1)}
            />
          </ActionIconTooltip>
          <ActionIconTooltip label="Verify step">
            <GigwIconButton
              icon={GIGW_VERIFY_ICON}
              tone="positive"
              aria-label="Verify step"
              onClick={() => setClicks((c) => c + 1)}
            />
          </ActionIconTooltip>
        </div>
        <p className="mt-3 text-[12px] text-slate-600">
          Clicks (tooltip should not re-open until hover again): <strong className="tabular-nums">{clicks}</strong>
        </p>
      </div>
    </div>
  )
}
