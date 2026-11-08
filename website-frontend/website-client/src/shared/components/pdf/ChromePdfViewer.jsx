import React from "react";

/**
 * Chrome's built-in PDF viewer. No extra chrome or padding —
 * use FormPreviewModal when inset spacing is needed.
 */
export default function ChromePdfViewer({
  src,
  title = "Form preview",
  className = "h-[min(80vh,56rem)]",
}) {
  if (!src) {
    return null;
  }

  return (
    <embed
      title={title}
      src={`${src}#toolbar=1`}
      type="application/pdf"
      className={`block w-full ${className}`.trim()}
    />
  );
}
