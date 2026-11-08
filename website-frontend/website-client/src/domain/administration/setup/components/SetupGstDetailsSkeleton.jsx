import SetupEditFormSkeleton from './SetupEditFormSkeleton'

/** GST details view modal — matches `SetupGstAddressDetailsView` layout. */
export default function SetupGstDetailsSkeleton({ sectionCount = 1 }) {
  const sections = Array.from({ length: sectionCount }, () => ({ fields: 10, cols: 3 }))

  return (
    <SetupEditFormSkeleton
      sections={sections}
      showFooter={false}
      loadingMessage="Loading GST details…"
    />
  )
}
