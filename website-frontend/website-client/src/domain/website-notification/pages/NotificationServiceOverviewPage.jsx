import { NOTIFICATION_SERVICE_META } from '../constants/notificationServiceMeta'
import { NOTIFICATION_ENDPOINTS } from '../constants/endpoints'

export default function NotificationServiceOverviewPage() {
  return (
    <div className="space-y-4 p-4 font-noto text-sm text-slate-800">
      <h1 className="text-lg font-semibold text-[#263AB5]">{NOTIFICATION_SERVICE_META.title}</h1>
      <p className="text-slate-600">{NOTIFICATION_SERVICE_META.description}</p>
      <p>
        Gateway: <code>{NOTIFICATION_ENDPOINTS.base}/**</code>
      </p>
    </div>
  )
}