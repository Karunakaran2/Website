import React from "react";
import PortalModalShell from "./PortalModalShell";
import { PortalModalCancelButton } from "./PortalModalButtons";
import ChromePdfViewer from "../pdf/ChromePdfViewer";

/**
 * Form preview modal with padding and a fixed viewer height.
 * Application tabs should use ChromePdfViewer directly (no modal padding).
 */
export default function FormPreviewModal({ isOpen, onClose, title, children, pdfUrl }) {
  return (
    <PortalModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="2xl"
      bodyClassName="!max-h-none !overflow-hidden !p-4"
      footerLayout="end"
      footer={<PortalModalCancelButton onClick={onClose}>Close</PortalModalCancelButton>}
    >
      {pdfUrl ? (
        <ChromePdfViewer src={pdfUrl} title={title} className="h-[min(72vh,48rem)]" />
      ) : (
        children
      )}
    </PortalModalShell>
  );
}
