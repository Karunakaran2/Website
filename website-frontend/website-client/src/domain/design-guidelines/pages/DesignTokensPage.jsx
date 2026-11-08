import GuidelineCard from '../components/GuidelineCard'

export default function DesignTokensPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GuidelineCard title="Color Palette Specifications" badge="Tokens">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Primary Navy:</strong> <code>#01458e</code> — used for main branding, primary buttons, and active tabs.</li>
            <li><strong>Primary Accent:</strong> <code>#f5c518</code> — reserved for the gold primary navigation bar.</li>
            <li><strong>Surface Background:</strong> <code>#ffffff</code> cards over <code>#f8fafc</code> / <code>#f1f5f9</code> shell canvas.</li>
            <li><strong>Borders:</strong> <code>#e2e8f0</code> (slate-200) for clean enterprise containment.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Spacing & Typography Scales" badge="Tokens">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Spacing Scale:</strong> Standard 4px grid (<code>p-1</code> = 4px, <code>p-2</code> = 8px, <code>p-4</code> = 16px, <code>p-6</code> = 24px).</li>
            <li><strong>Page Title:</strong> 24px to 30px (<code>text-2xl</code> / <code>text-3xl font-bold</code>).</li>
            <li><strong>Section Header:</strong> 18px to 20px (<code>text-lg</code> / <code>text-xl font-bold</code>).</li>
            <li><strong>Data Tables & Forms:</strong> 12px to 14px (<code>text-xs</code> / <code>text-sm</code>) with dense enterprise padding.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Elevation & Border Radii" badge="Tokens">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Card Radius:</strong> <code>rounded-xl</code> (12px) for major panels, <code>rounded-lg</code> (8px) for cards, <code>rounded-md</code> (6px) for inputs.</li>
            <li><strong>Shadows:</strong> Subtle <code>shadow-xs</code> / <code>shadow-sm</code> on light backgrounds; avoid harsh dropshadows.</li>
            <li><strong>Focus Ring:</strong> <code>focus-visible:ring-2 focus-visible:ring-[#01458e] focus-visible:ring-offset-2</code>.</li>
          </ul>
        </GuidelineCard>

        <GuidelineCard title="Responsive Breakpoints" badge="Tokens">
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
            <li><strong>Mobile:</strong> &lt; 640px (single column vertical stack).</li>
            <li><strong>Tablet:</strong> 640px – 1024px (2-column grids, collapsed navigation overflow).</li>
            <li><strong>Desktop:</strong> &ge; 1024px (two-column landing page, full horizontal primary navbar).</li>
          </ul>
        </GuidelineCard>
      </div>
    </div>
  )
}
