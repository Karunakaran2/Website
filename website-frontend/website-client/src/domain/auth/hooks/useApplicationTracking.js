const DEMO_RECORD = {
  trackingId: 'KRAN-DEMO-001',
  applicantName: 'Portal Demo Applicant',
  submittedDate: '2026-01-15',
  status: 'Under Review',
  statusBadgeClass: 'bg-sky-100 text-sky-800',
  remark:
    'Your portal access request is being reviewed. You will be notified when a decision is available.',
  timeline: [
    { label: 'Application submitted', time: '2026-01-15', done: true },
    { label: 'Identity verification', time: '2026-01-16', done: true },
    { label: 'Department review', time: 'In progress', done: false },
    { label: 'Access provisioned', time: 'Pending', done: false },
  ],
}

function isMockMode() {
  return String(import.meta.env.VITE_MOCK_API ?? 'true').toLowerCase() === 'true'
}

/**
 * Fetch tracking status. Mock mode returns a sample record for KRAN-DEMO-001 only.
 * No backend tracking endpoint is wired in the design-system portal yet.
 */
export async function fetchApplicationTrackingStatus(trackingId) {
  const trimmed = String(trackingId || '').trim()
  if (!trimmed) {
    return { ok: false, code: 'required', message: 'Enter a tracking ID.' }
  }

  if (isMockMode()) {
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    if (trimmed.toUpperCase() === DEMO_RECORD.trackingId) {
      return { ok: true, data: { ...DEMO_RECORD, trackingId: trimmed } }
    }
    return {
      ok: true,
      data: {
        trackingId: trimmed,
        applicantName: '',
        submittedDate: '',
        status: 'Unknown',
        statusBadgeClass: 'bg-slate-100 text-slate-600',
        remark:
          'No status details are available for this tracking ID yet. Confirm the ID or try again later.',
        timeline: [
          {
            label: 'Awaiting status updates',
            time: 'Pending',
            done: false,
          },
        ],
      },
    }
  }

  return {
    ok: false,
    code: 'unavailable',
    message: 'Application tracking is not available until the tracking API is configured.',
  }
}
