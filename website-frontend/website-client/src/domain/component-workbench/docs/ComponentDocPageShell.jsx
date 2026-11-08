import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lightbulb,
  ShieldCheck,
  Code,
} from 'lucide-react'
import WorkbenchDemoSection from '../components/WorkbenchDemoSection'

export default function ComponentDocPageShell({
  title,
  /** When true (default), page H1 comes from DashboardModuleContentShell — avoid duplicate headings. */
  showPageHeading = false,
  badge = 'Stable',
  lead,
  preview,
  variants,
  states,
  playground,
  usage,
  propsList,
  codeExample,
  accessibility,
  dosAndDonts,
  relatedComponents = [],
}) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    if (!codeExample) return
    navigator.clipboard.writeText(codeExample).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="w-full space-y-8 pb-12">
      {(showPageHeading || badge || lead) && (
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center gap-2.5">
            {showPageHeading ? (
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            ) : (
              <p className="text-sm font-semibold text-slate-800">{title}</p>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#01458e] border border-blue-200">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              {badge}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              WCAG 2.2 AA
            </span>
          </div>
          {lead ? (
            <p className="mt-2 text-sm text-slate-600 sm:text-base leading-relaxed max-w-4xl">{lead}</p>
          ) : null}
        </div>
      )}

      {/* 1. Live Preview */}
      {preview ? (
        <WorkbenchDemoSection sectionId="live-preview" title="Live Preview">
          {preview}
        </WorkbenchDemoSection>
      ) : null}

      {/* 2. Variants and Sizes */}
      {variants ? (
        <WorkbenchDemoSection sectionId="variants" title="Variants and Sizes">
          {variants}
        </WorkbenchDemoSection>
      ) : null}

      {/* 3. States */}
      {states ? (
        <WorkbenchDemoSection sectionId="states" title="States">
          {states}
        </WorkbenchDemoSection>
      ) : null}

      {/* 4. Interactive Playground */}
      {playground ? (
        <WorkbenchDemoSection
          sectionId="playground"
          title="Interactive Playground"
          icon={Lightbulb}
          headerTrailing={
            <span className="text-[12px] font-medium text-slate-600">Test live props and configurations</span>
          }
          bodyClassName="rounded-b-lg border-t-0 bg-blue-50/20 p-4 sm:p-5"
        >
          {playground}
        </WorkbenchDemoSection>
      ) : null}

      {/* 5. Usage Guidelines */}
      {usage ? (
        <WorkbenchDemoSection sectionId="usage" title="Usage Guidelines">
          <div className="space-y-4 text-[13px] text-slate-700 leading-relaxed">{usage}</div>
        </WorkbenchDemoSection>
      ) : null}

      {/* 6. Props / API Reference */}
      {propsList && propsList.length > 0 ? (
        <WorkbenchDemoSection sectionId="props" title="Props / API Reference">
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-none -mx-0">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th scope="col" className="px-4 py-3 sm:px-6">Prop</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Type</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Default</th>
                  <th scope="col" className="px-4 py-3 sm:px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {propsList.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-[#01458e] sm:px-6">
                      {p.name}
                      {p.required ? (
                        <span className="ml-1 text-[10px] text-red-600 font-sans font-medium">*required</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-purple-700 sm:px-6">{p.type}</td>
                    <td className="px-4 py-3 text-slate-500 sm:px-6">{p.default || '—'}</td>
                    <td className="px-4 py-3 font-sans text-xs text-slate-700 sm:px-6 leading-relaxed">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkbenchDemoSection>
      ) : null}

      {/* 7. React Code Example */}
      {codeExample ? (
        <WorkbenchDemoSection
          sectionId="code-example"
          title="React Code Example"
          icon={Code}
          headerTrailing={
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1 text-[12px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#01458e]"
              aria-label="Copy React code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          }
        >
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-slate-100 shadow-md">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed">
              <code>{codeExample}</code>
            </pre>
          </div>
        </WorkbenchDemoSection>
      ) : null}

      {/* 8. Accessibility */}
      {accessibility ? (
        <WorkbenchDemoSection
          sectionId="accessibility"
          title="Accessibility & Keyboard Interaction"
          icon={ShieldCheck}
        >
          <div className="space-y-3 text-[13px] text-slate-700 leading-relaxed">{accessibility}</div>
        </WorkbenchDemoSection>
      ) : null}

      {/* 9. Do / Don't */}
      {dosAndDonts ? (
        <WorkbenchDemoSection sectionId="dos-donts" title="Do's and Don'ts">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Do</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {dosAndDonts.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50/30 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-2.5">
                <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                <span>Don't</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {dosAndDonts.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </WorkbenchDemoSection>
      ) : null}

      {/* 10. Related Components */}
      {relatedComponents.length > 0 ? (
        <WorkbenchDemoSection sectionId="related" title="Related Components">
          <div className="flex flex-wrap gap-2">
            {relatedComponents.map((rc) => (
              <Link
                key={rc.title}
                to={rc.to}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-[#01458e] hover:text-[#01458e] transition-colors"
              >
                <span>{rc.title}</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </Link>
            ))}
          </div>
        </WorkbenchDemoSection>
      ) : null}
    </div>
  )
}
