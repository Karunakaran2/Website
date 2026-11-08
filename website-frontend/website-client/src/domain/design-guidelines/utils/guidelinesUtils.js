/**
 * Utility functions for KRAN Design Guidelines module.
 */

export function formatTopicTitle(title) {
  return String(title ?? '').trim()
}

export function slugifyGuideline(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function filterGuidelinesBySearch(items = [], query = '') {
  const q = String(query).trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q))
  )
}
