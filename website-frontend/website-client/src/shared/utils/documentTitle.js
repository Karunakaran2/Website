export const DOCUMENT_TITLE_PRODUCT = 'KRAN Design System'

const TITLE_SEPARATOR = ' – '

function pushTitlePart(parts, value) {
  const text = String(value ?? '').trim()
  if (!text) {
    return
  }
  const previous = parts[parts.length - 1]
  if (previous && previous.toLowerCase() === text.toLowerCase()) {
    return
  }
  parts.push(text)
}

/** Screen, then module, then product. Omits a repeated name. */
export function formatDocumentTitle(screen, moduleName, product = DOCUMENT_TITLE_PRODUCT) {
  const parts = []
  pushTitlePart(parts, screen)
  pushTitlePart(parts, moduleName)
  pushTitlePart(parts, product)
  return parts.join(TITLE_SEPARATOR) || product
}
