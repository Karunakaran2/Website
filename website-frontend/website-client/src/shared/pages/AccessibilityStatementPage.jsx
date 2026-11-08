import { Link } from 'react-router-dom'
import PublicDocumentLayout from '@/shared/layouts/PublicDocumentLayout/PublicDocumentLayout'
import { ROUTES } from '@/shared/constants'

export default function AccessibilityStatementPage() {
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
        <h1 className="m-0 text-2xl font-semibold text-[#01458e]">Accessibility Statement</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          We are committed to making Probity accessible to all users, including persons with
          disabilities, in accordance with the Guidelines for Indian Government Websites (GIGW)
          notified by MeitY, W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, and
          applicable Indian digital accessibility practices.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Standards followed</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>
            <strong>GIGW / MeitY:</strong> Accessibility attributes and usability expectations for
            Indian government digital platforms.
          </li>
          <li>
            <strong>W3C WCAG 2.1 AA:</strong> Perceivable, operable, understandable, and robust
            content principles (POUR).
          </li>
          <li>
            <strong>DPDP Act, 2023:</strong> Personal data is processed with purpose limitation,
            security safeguards, and user rights awareness for registered users of this application.
          </li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Accessibility features</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Skip to main content for keyboard and assistive technology users</li>
          <li>Screen reader access information for common assistive tools</li>
          <li>Text resizing (smaller to larger) without loss of core functionality</li>
          <li>Color schemes: Standard, High Contrast, and Yellow on Black</li>
          <li>Text spacing for improved readability (WCAG text spacing guidance)</li>
          <li>Highlight and underline links for clearer navigation cues</li>
          <li>Dyslexia-friendly typography option</li>
          <li>Invert colors, grayscale, enlarged cursor, and hide images</li>
          <li>English / हिंदी language preference for the interface shell</li>
          <li>Reset all accessibility preferences</li>
        </ul>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Assistive technologies</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Content is intended to work with assistive technologies such as NVDA, JAWS, Narrator,
          VoiceOver, and TalkBack. See the{' '}
          <Link
            to={ROUTES.SCREEN_READER_ACCESS}
            className="font-medium text-[#01458e] underline underline-offset-2"
          >
            Screen Reader Access
          </Link>{' '}
          page for download and usage links.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Privacy and data protection</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Accessibility preferences (such as text size and contrast) may be stored locally in your
          browser to preserve your settings. Authentication and personal data handled by Probity are
          intended to follow organisational security controls and the principles of the Digital
          Personal Data Protection Act, 2023.
        </p>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">Feedback</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          If you face any difficulty accessing content or features, please contact your Probity
          system administrator so the issue can be reviewed and addressed.
        </p>
      </article>
    </PublicDocumentLayout>
  )
}
