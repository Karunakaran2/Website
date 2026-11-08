/**
 * True when the user intends native browser navigation (new tab/window, download, etc.)
 * rather than in-app client-side routing in the current tab.
 * @param {MouseEvent | React.MouseEvent} event
 */
export function isModifiedNavigationClick(event) {
  if (!event) {
    return false
  }
  return Boolean(
    event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      ('button' in event && event.button !== 0),
  )
}
