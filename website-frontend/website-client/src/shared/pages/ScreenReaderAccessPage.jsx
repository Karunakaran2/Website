import { Link } from 'react-router-dom'
import PublicDocumentLayout from '@/shared/layouts/PublicDocumentLayout/PublicDocumentLayout'
import { ROUTES } from '@/shared/constants'

const SCREEN_READERS = [
  {
    name: 'Non Visual Desktop Access (NVDA)',
    website: 'https://www.nvaccess.org/',
    type: 'Free',
  },
  {
    name: 'Job Access With Speech (JAWS)',
    website: 'https://www.freedomscientific.com/products/software/jaws/',
    type: 'Commercial',
  },
  {
    name: 'System Access To Go',
    website: 'https://www.satogo.com/',
    type: 'Free',
  },
  {
    name: 'VoiceOver (Apple)',
    website: 'https://www.apple.com/accessibility/vision/',
    type: 'Built-in',
  },
  {
    name: 'Narrator (Windows)',
    website: 'https://support.microsoft.com/windows/complete-guide-to-narrator',
    type: 'Built-in',
  },
  {
    name: 'TalkBack (Android)',
    website: 'https://support.google.com/accessibility/android/answer/6283677',
    type: 'Built-in',
  },
]

export default function ScreenReaderAccessPage() {
  return (
    <PublicDocumentLayout>
      <article className="mx-auto max-w-3xl font-noto">
        <p className="m-0 mb-4">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm font-medium text-[#01458e] underline underline-offset-2"
          >
            ← Back to Login
          </Link>
        </p>
        <h1 className="m-0 text-2xl font-semibold text-[#01458e]">Screen Reader Access</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Probity is designed to be used with assistive technologies in line with the Guidelines for
          Indian Government Websites (GIGW), MeitY accessibility expectations, and W3C WCAG 2.1 Level
          AA practices. Visitors with visual impairments can access content using screen readers and
          related tools.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">
          Information related to various screen readers
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Compatible screen readers with website links and licence type
            </caption>
            <thead className="bg-[#F4FAFF] dark:bg-slate-900">
              <tr className="border-b border-slate-200">
                <th scope="col" className="w-[4.75rem] px-3 py-3.5 text-center text-xs font-semibold text-slate-800 align-middle min-h-[3rem] sm:text-sm">
                  Sl. No.
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold capitalize text-slate-800 align-middle min-h-[3rem] sm:text-sm">
                  Screen Reader
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold capitalize text-slate-800 align-middle min-h-[3rem] sm:text-sm">
                  Website
                </th>
                <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold capitalize text-slate-800 align-middle min-h-[3rem] sm:text-sm">
                  Free / Commercial
                </th>
              </tr>
            </thead>
            <tbody>
              {SCREEN_READERS.map((row, index) => (
                <tr key={row.name} className="border-b border-slate-200">
                  <td className="px-3 py-2 text-center align-middle tabular-nums text-slate-800">{index + 1}</td>
                  <td className="px-3 py-2 text-center align-middle text-slate-800">{row.name}</td>
                  <td className="px-3 py-2 text-center align-middle">
                    <a
                      href={row.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#01458e] underline underline-offset-2 hover:text-[#01336a]"
                    >
                      {row.website}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-center align-middle text-slate-700">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Accessibility help</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Use Skip to Main Content to move focus past repeating navigation.</li>
          <li>Adjust text size with A− / A / A+ controls in the top accessibility bar.</li>
          <li>Switch contrast schemes (Standard, High, Yellow) for clearer readability.</li>
          <li>
            Open Accessibility Options for text spacing, link highlighting, dyslexia-friendly font,
            invert colors, grayscale, larger cursor, and hide images.
          </li>
        </ul>
      </article>
    </PublicDocumentLayout>
  )
}
