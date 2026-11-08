import { Link } from 'react-router-dom'
import ComponentDocPageShell from './ComponentDocPageShell'
import FormPlayground from '../playgrounds/FormPlayground'
import { useModuleSecondaryTab } from '@/domain/component-workbench/hooks/useModuleSecondaryTab'
import { formsCodeForTab, formsPreviewForTab, formsUsageForTab } from './formsDocTabs'
import {
  formCheckboxControlClass,
  formChoiceControlClass,
} from '@/shared/components/typography/typographyStyles'
import { SwitchControl } from '@/shared/components/forms'
import { useState } from 'react'

const TAB_ROUTES = {
  'text-input': '/component-workbench/forms/text-inputs',
  'password-input': '/component-workbench/forms/text-inputs',
  textarea: '/component-workbench/forms/text-inputs',
  select: '/component-workbench/forms/select-controls',
  'checkbox-radio': '/component-workbench/forms/checkboxes',
  switch: '/component-workbench/forms/switches',
  validation: '/component-workbench/forms/form-validation',
}

const TAB_COPY = {
  'text-input': { title: 'Text Input', lead: 'OrgTextField and InputField with labels, hints, and rose invalid borders.' },
  'password-input': { title: 'Password Input', lead: 'Masked entry with visibility toggle and autocomplete support.' },
  textarea: { title: 'Textarea', lead: 'TextAreaField for multi-line narration and remarks.' },
  select: { title: 'Select Controls', lead: 'OrgSelectField combobox and native SelectField patterns.' },
  'checkbox-radio': { title: 'Checkbox & Radio', lead: 'formCheckboxControlClass and OrgRadioGroup selections.' },
  switch: { title: 'Switch', lead: 'Boolean toggles for feature flags and preferences.' },
  validation: { title: 'Form Validation', lead: 'React Hook Form rules, FieldError, and validate-before-confirm sequencing.' },
}

export default function FormsDocs() {
  const secondaryTab = useModuleSecondaryTab('text-input')
  const [specSwitchOn, setSpecSwitchOn] = useState(true)
  const copy = TAB_COPY[secondaryTab] || TAB_COPY['text-input']
  const demoRoute = TAB_ROUTES[secondaryTab] || TAB_ROUTES['text-input']
  const propsList = [
    { name: 'label', type: 'string', required: true, description: 'Visible field label placed above input.' },
    { name: 'name', type: 'string', required: true, description: 'Input name used for form binding.' },
    { name: 'value', type: 'string | number', description: 'Controlled input value.' },
    { name: 'onChange', type: '(e: ChangeEvent) => void', required: true, description: 'Change callback triggered on input.' },
    { name: 'error', type: 'string', description: 'Validation error message displayed below input with red styling.' },
    { name: 'helperText', type: 'string', description: 'Informative guidance note rendered below input.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Renders red asterisk and sets aria-required="true".' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents editing and applies muted background.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Allows selection/copying but prevents modification.' },
  ]

  const codeExample = formsCodeForTab(secondaryTab)

  return (
    <ComponentDocPageShell
      title={copy.title}
      badge="Stable"
      lead={copy.lead}
      preview={formsPreviewForTab(secondaryTab)}
      variants={
        secondaryTab === 'checkbox-radio' ? (
          <div className="rounded border border-slate-200 bg-white p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Checkboxes &amp; Radios
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" defaultChecked readOnly className={formCheckboxControlClass} />
                <span>Notify via Email</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="demoRadio" defaultChecked readOnly className={formChoiceControlClass} />
                <span>Active Status</span>
              </label>
            </div>
          </div>
        ) : secondaryTab === 'switch' ? (
          <div className="max-w-md rounded border border-slate-200 bg-white p-4">
            <SwitchControl
              id="forms-doc-switch"
              label="Enable automatic voucher posting"
              description="Uses shared SwitchControl from @/shared/components/forms."
              checked={specSwitchOn}
              onChange={setSpecSwitchOn}
            />
          </div>
        ) : null
      }
      playground={
        secondaryTab === 'validation' ? (
          <FormPlayground />
        ) : (
          <Link className="font-semibold text-[#01458e] hover:underline" to={demoRoute}>
            Open interactive {copy.title} demo
          </Link>
        )
      }
      usage={formsUsageForTab(secondaryTab)}
      propsList={propsList}
      codeExample={codeExample}
      accessibility={
        <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm">
          <li><strong>Labels:</strong> All inputs link to their corresponding label via the <code>htmlFor</code> / <code>id</code> pairing.</li>
          <li><strong>Error Announcement:</strong> Errors use <code>role="alert"</code> so screen readers immediately inform the user upon submission.</li>
          <li><strong>Visible Focus:</strong> Focus outlines meet the WCAG 2.2 Level AA 3:1 contrast ratio against the surrounding white background.</li>
        </ul>
      }
      dosAndDonts={{
        dos: [
          'Group related radio buttons within a fieldset with a legend.',
          'Provide helpful guidance text for formatting requirements (e.g., date formats).',
          'Preserve user input when validation errors occur.',
        ],
        donts: [
          'Do not hide labels or rely solely on placeholder attributes.',
          'Avoid disabling the submit button without informing users which field is invalid.',
          'Do not use red coloring alone without an error message or icon.',
        ],
      }}
      relatedComponents={[
        { title: 'Form Playground', to: '/component-workbench/lib-playgrounds/form-playground' },
        { title: 'Button Components', to: '/component-workbench/lib-actions/buttons' },
        { title: 'Alerts & Feedback', to: '/component-workbench/lib-feedback/alerts' },
      ]}
    />
  )
}
