import { useRef } from 'react'
import FormProfileSectionHeader from '@/shared/components/forms/FormProfileSectionHeader'
import useInlineFormScroll from '@/shared/navigation/useInlineFormScroll'
import {
  PAGE_SECTION_BODY_CLASS,
  PAGE_SECTION_SHELL_CLASS,
} from '@/shared/components/page/pageHeaderStyles'
import { BackButton } from '@/shared/components/buttons'
import { ActionConfirmProvider } from '@/shared/components/confirm'

/**
 * Listing page with add/edit on the **page** (not FormModal).
 * When `formOpen`, the table is hidden and the form fills the content area.
 * Form title renders as an in-card **section** title (not the module page header band).
 *
 * Put {@link DomainFormFooter} inside the `<form>` body (`layout="page"`).
 */
export default function ListWithFormModal({
  formOpen = false,
  onCloseForm,
  modalTitle = 'Add',
  /** @deprecated Inline layout ignores modal size. */
  modalSize,
  form,
  /** @deprecated Use in-form {@link DomainFormFooter}. */
  footer = null,
  formId,
  onFormCancel,
  submitLabel,
  submitLoading,
  formFooterLead,
  list,
  bodyMaxHeightClass,
  bodyClassName = '',
}) {
  void modalSize
  void footer
  void formId
  void onFormCancel
  void submitLabel
  void submitLoading
  void formFooterLead
  void bodyMaxHeightClass

  const sectionRef = useRef(null)
  useInlineFormScroll(formOpen, sectionRef)

  if (formOpen) {
    const handleBack = onCloseForm ?? onFormCancel

    return (
      <ActionConfirmProvider>
        <section
          ref={sectionRef}
          className={`${PAGE_SECTION_SHELL_CLASS} min-w-0 w-full`}
          aria-label={modalTitle}
        >
          <FormProfileSectionHeader
            title={modalTitle}
            trailing={
              handleBack ? (
                <BackButton type="button" onClick={handleBack}>
                  Back to list
                </BackButton>
              ) : null
            }
          />
          <div className={`${PAGE_SECTION_BODY_CLASS} ${bodyClassName}`.trim()}>{form}</div>
        </section>
      </ActionConfirmProvider>
    )
  }

  return <>{list}</>
}
