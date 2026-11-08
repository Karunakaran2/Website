import { Children, Fragment, isValidElement } from 'react'
import FormSectionHeading from '@/shared/components/forms/FormSectionHeading'
import { setupFormFieldClass } from '../constants/setupStyles'

function reactNodeHasContent(node) {
  if (node == null || node === false || node === true) {
    return false
  }
  if (typeof node === 'string') {
    return node.trim().length > 0
  }
  if (typeof node === 'number') {
    return true
  }
  if (Array.isArray(node)) {
    return node.some(reactNodeHasContent)
  }
  if (isValidElement(node)) {
    if (node.type === Fragment) {
      return Children.toArray(node.props.children).some(reactNodeHasContent)
    }
    return true
  }
  return Boolean(node)
}

/** Header + field grid wrapper — submit footer lives on the parent <form>. */
export default function SetupFormShell({
  title,
  headerActions,
  formError,
  children,
}) {
  const hasTitle = Boolean(title)
  const hasActions = reactNodeHasContent(headerActions)
  const showHeader = hasTitle || hasActions

  return (
    <>
      {showHeader ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {hasTitle ? <FormSectionHeading title={title} /> : null}
          {hasActions ? (
            <div className={`flex flex-wrap items-center gap-2 ${hasTitle ? 'justify-end' : ''}`.trim()}>
              {headerActions}
            </div>
          ) : null}
        </div>
      ) : null}

      {formError ? (
        <p className="mb-4 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className={`probity-complex-form min-w-0 ${setupFormFieldClass}`}>{children}</div>
    </>
  )
}
