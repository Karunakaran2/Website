export function formsPreviewForTab(tab) {
  const labels = {
    'text-input': 'OrgTextField / InputField — single-line text with label and FieldError.',
    'password-input': 'PasswordInput (tailwreck) or masked OrgTextField with visibility toggle.',
    textarea: 'TextAreaField for narration and multi-line remarks.',
    select: 'OrgSelectField combobox — preferred over raw native select in domain modals.',
    'checkbox-radio': 'formCheckboxControlClass (native tick) and OrgRadioGroup.',
    switch: 'Boolean toggle for preferences; pair with visible on/off label.',
    validation: 'Rose border + FieldError; validate before confirm dialog opens.',
  }
  return (
    <p className="max-w-2xl text-sm text-slate-700">
      <strong>{labels[tab] || labels['text-input']}</strong>
    </p>
  )
}

export function formsCodeForTab(tab) {
  const map = {
    validation: `import { validateTriggerForm, confirmBeforeAction } from '@/shared/components/confirm'

await confirmBeforeAction(requestConfirm, {
  validate: () => validateTriggerForm(trigger),
  action: 'save',
  runAction: () => mutation(payload),
})`,
    select: `import { OrgSelectField } from '@/shared/components/forms'

<OrgSelectField name="department" label="Department" rules={{ required: 'Required' }} />`,
    'checkbox-radio': `import { formCheckboxControlClass } from '@/shared/components/forms'

<input type="checkbox" className={formCheckboxControlClass} />`,
  }
  return (
    map[tab] ||
    `import { OrgTextField } from '@/shared/components/forms'

<OrgTextField name="code" label="Code" register={register} rules={{ required: 'Required' }} />`
  )
}

export function formsUsageForTab(tab) {
  if (tab === 'validation') {
    return (
      <p>
        Use <code>useProbityForm</code> + per-field <code>error=&#123;errors.x?.message&#125;</code>. After failed{' '}
        <code>trigger()</code>, call <code>scheduleFocusFirstFormError</code>.
      </p>
    )
  }
  if (tab === 'password-input') {
    return <p>Set <code>autoComplete=&quot;new-password&quot;</code> or <code>current-password</code> on auth flows.</p>
  }
  return <p>Every control needs a visible <code>FormLabel</code> — placeholders are not substitutes for labels.</p>
}
