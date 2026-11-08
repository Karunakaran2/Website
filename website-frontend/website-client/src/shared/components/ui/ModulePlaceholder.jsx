export default function ModulePlaceholder({ description }) {
  if (!description) {
    return null
  }

  return (
    <p className="m-0 text-sm font-normal text-slate-600">{description}</p>
  )
}
