import SetupEditFormSkeleton from './SetupEditFormSkeleton'

/** Inline or modal read-only details placeholder (GST, own-tax panels, etc.). */
export default function SetupDetailsSkeleton({
  sectionCount = 1,
  fieldsPerSection = 8,
  loadingMessage = 'Loading details…',
}) {
  const sections = Array.from({ length: sectionCount }, () => ({
    fields: fieldsPerSection,
    cols: 1,
  }))

  return (
    <SetupEditFormSkeleton
      sections={sections}
      showFooter={false}
      loadingMessage={loadingMessage}
    />
  )
}
