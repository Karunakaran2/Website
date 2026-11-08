import { Link } from 'react-router-dom'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import ComponentDocPageShell from './ComponentDocPageShell'
import ButtonPlayground from '../playgrounds/ButtonPlayground'
import {
  actionsCodeForTab,
  actionsPreviewForTab,
  actionsUsageForTab,
} from './actionsDocTabs'

const TAB_COPY = {
  buttons: {
    title: 'Buttons & Actions',
    lead: 'Semantic ActionButton, PrimaryButton, SubmitButton, and CancelButton variants for domain workflows.',
  },
  'icon-buttons': {
    title: 'Icon Buttons & GIGW Actions',
    lead: 'GigwButton, GigwIconButton, and table row icon actions (View, Edit, Delete) with accessible tooltips.',
  },
  'button-groups': {
    title: 'Button Groups & Toolbars',
    lead: 'Grouped primary/secondary actions in page headers, modal footers, and batch toolbars.',
  },
  'action-states': {
    title: 'Action States',
    lead: 'Loading, disabled, focus-visible, and pressed states for interactive controls.',
  },
}

export default function ActionsDocs() {
  const secondaryTab = useModuleSecondaryTab('buttons')
  const copy = TAB_COPY[secondaryTab] || TAB_COPY.buttons

  const propsList = [
    { name: 'variant', type: "'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'", default: "'primary'", description: 'Visual style and hierarchical intent of the button.' },
    { name: 'size', type: "'sm' | 'md' | 'form' | 'lg'", default: "'md'", description: 'md and form align to h-11 (44px) with inputs; sm is compact; lg for hero actions. Table icon buttons use GigwIconButton (36px).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user interaction and applies muted opacity.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces icon or label with an accessible spinning loader.' },
    { name: 'icon', type: 'ReactNode', default: 'undefined', description: 'Optional icon rendered at start or end of button.' },
    { name: 'onClick', type: '(e: MouseEvent) => void', default: 'undefined', required: true, description: 'Event handler called on mouse click or Enter/Space key.' },
    { name: 'aria-label', type: 'string', default: 'undefined', description: 'Accessible label mandatory for icon-only buttons.' },
  ]

  const codeExample = actionsCodeForTab(secondaryTab)

  return (
    <ComponentDocPageShell
      title={copy.title}
      badge="Stable"
      lead={copy.lead}
      preview={actionsPreviewForTab(secondaryTab)}
      states={null}
      playground={
        secondaryTab === 'icon-buttons' ? (
          <p className="text-sm text-slate-600">
            Live demos:{' '}
            <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/actions/icon-buttons">
              Actions → Icon Buttons
            </Link>
          </p>
        ) : secondaryTab === 'button-groups' ? (
          <Link className="font-semibold text-[#01458e] hover:underline" to="/component-workbench/actions/button-groups">
            Open Button Groups demo page
          </Link>
        ) : (
          <ButtonPlayground />
        )
      }
      usage={actionsUsageForTab(secondaryTab)}
      propsList={propsList}
      codeExample={codeExample}
      accessibility={
        <ul className="list-disc space-y-1 pl-4 text-xs sm:text-sm">
          <li><strong>Keyboard Activation:</strong> Buttons are natively focusable and trigger via both <kbd>Enter</kbd> and <kbd>Space</kbd> keys.</li>
          <li><strong>Accessible Names:</strong> Always provide descriptive children text or an <code>aria-label</code> for icon-only buttons.</li>
          <li><strong>Focus Indicators:</strong> All buttons maintain a high-contrast 2px focus ring with an offset to meet WCAG 2.2 Level AA focus visibility.</li>
        </ul>
      }
      dosAndDonts={{
        dos: [
          'Use clear verb-first labels like "Submit Voucher", "Add Account", or "Cancel".',
          'Use the loading state during pending asynchronous API requests.',
          'Always provide aria-label for icon buttons without visible text.',
        ],
        donts: [
          'Do not use generic labels like "Click Here" or "OK" when specific context exists.',
          'Never disable a button without explaining why in a tooltip or helper note if actionable.',
          'Avoid placing two primary buttons in the same modal footer.',
        ],
      }}
      relatedComponents={[
        { title: 'Button Playground', to: '/component-workbench/lib-playgrounds/btn-playground' },
        { title: 'Form Controls', to: '/component-workbench/lib-forms/text-input' },
        { title: 'Modal Dialogs', to: '/component-workbench/lib-feedback/dialogs-modals' },
      ]}
    />
  )
}
