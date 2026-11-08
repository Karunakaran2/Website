import { useCallback, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { showAppToast } from '@/shared/components'

const DEV_ZIP_URL = '/api/portal/source-zip'

function resolveProductionZipUrl() {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}releases/kran-design-system-source.zip`
}

function filenameFromContentDisposition(header) {
  if (!header) return null
  const match = /filename="([^"]+)"/i.exec(header)
  return match?.[1] ?? null
}

export default function DownloadSourceZipButton() {
  const [busy, setBusy] = useState(false)
  const abortRef = useRef(null)

  const handleDownload = useCallback(async () => {
    if (busy) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setBusy(true)
    try {
      const url = import.meta.env.DEV ? DEV_ZIP_URL : resolveProductionZipUrl()
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`)
      }

      const blob = await response.blob()
      if (!blob.size) {
        throw new Error('Empty archive')
      }

      const date = new Date().toISOString().slice(0, 10)
      const filename =
        filenameFromContentDisposition(response.headers.get('Content-Disposition'))
        ?? `kran-design-system-source-${date}.zip`

      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = filename
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(objectUrl)

      showAppToast('Source ZIP download started.', 'success', { action: 'download' })
    } catch (error) {
      if (error?.name === 'AbortError') return
      showAppToast('Could not prepare source ZIP. Try again or run npm run build:source-zip locally.', 'error')
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }, [busy])

  return (
    <GigwButton
      type="button"
      variant="outline"
      icon={Download}
      onClick={handleDownload}
      disabled={busy}
      aria-label="Download Source ZIP"
      title="Download Source ZIP"
      className="!h-7 !min-h-7 !border-white/40 !bg-transparent !px-2.5 !text-[12px] !text-white hover:!border-white hover:!bg-white/10"
    >
      {busy ? 'Preparing source ZIP…' : 'Download Source ZIP'}
    </GigwButton>
  )
}
