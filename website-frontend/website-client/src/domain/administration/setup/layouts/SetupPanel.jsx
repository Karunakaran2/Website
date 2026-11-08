import SetupPageContent from '../components/SetupPageContent'

export default function SetupPanel({ activePrimaryId, activeSecondaryId }) {
  return (
    <SetupPageContent activePrimaryId={activePrimaryId} activeSecondaryId={activeSecondaryId} />
  )
}
