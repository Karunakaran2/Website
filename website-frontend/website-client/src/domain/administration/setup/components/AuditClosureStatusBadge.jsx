import { gigwStatusBadgeClass } from '@/shared/components/status/gigwStatusBadgeStyles'

export default function AuditClosureStatusBadge({ status }) {
  return <span className={gigwStatusBadgeClass(status)}>{status}</span>
}
