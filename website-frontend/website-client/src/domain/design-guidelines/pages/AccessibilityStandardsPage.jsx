import GuidelineCard from '../components/GuidelineCard'

export default function AccessibilityStandardsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="WCAG 2.2 Level AA Requirements" badge="Compliance">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Contrast:</strong> Minimum 4.5:1 text contrast for body copy; 3:1 for large headings and icons.</li>
            <li><strong>Focus Appearance:</strong> Visible 2px outline indicator with 3:1 contrast against surrounding canvas.</li>
            <li><strong>Keyboard Trap:</strong> User must never be trapped inside an element without an escape mechanism.</li>
            <li><strong>Target Size:</strong> Minimum 24x24 CSS pixels for interactive touch targets.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="GIGW Indian Government Accessibility" badge="MeitY">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Top Accessibility Bar:</strong> Support for font resizing (- / Normal / +), high-contrast modes, and yellow-on-black contrast.</li>
            <li><strong>Screen Reader Access Page:</strong> Dedicated information page detailing assistive technology support.</li>
            <li><strong>Skip to Main Content:</strong> Top skip link allowing keyboard users to bypass navigation.</li>
            <li><strong>Bilingual Support:</strong> Full support for English and Hindi (हिंदी) language toggling.</li>
          </ul>
        </GuidelineCard>
      </div>
    </div>
  )
}
