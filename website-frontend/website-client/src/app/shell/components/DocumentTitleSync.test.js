import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/shared/i18/i18n'
import { formatDocumentTitle } from '@/shared/utils/documentTitle'
import { resolveRouteDocumentTitle } from './DocumentTitleSync'

describe('document title', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('joins screen, module, and product, and skips a repeated name', () => {
    expect(formatDocumentTitle('Buttons', 'Actions')).toBe(
      'Buttons – Actions – KRAN Design System',
    )
    expect(formatDocumentTitle('Home', 'Home')).toBe('Home – KRAN Design System')
    expect(formatDocumentTitle('Login')).toBe('Login – KRAN Design System')
  })

  it('gives each public route its own title', () => {
    const t = i18n.t.bind(i18n)
    expect(resolveRouteDocumentTitle('/', t)).toBe('Login – KRAN Design System')
    expect(resolveRouteDocumentTitle('/seats', t)).toBe('Seat selection – KRAN Design System')
    expect(resolveRouteDocumentTitle('/home', t)).toBe('Select an Account – KRAN Design System')
    expect(resolveRouteDocumentTitle('/profile', t)).toBe('My Profile – KRAN Design System')
    expect(resolveRouteDocumentTitle('/accessibility-statement', t)).toBe(
      'Accessibility Statement – KRAN Design System',
    )
    expect(resolveRouteDocumentTitle('/screen-reader-access', t)).toBe(
      'Screen Reader Access – KRAN Design System',
    )
  })

  it('names a module screen as screen, module, then KRAN Design System', () => {
    const t = i18n.t.bind(i18n)
    expect(resolveRouteDocumentTitle('/inbox/overview', t)).toBe('Home – KRAN Design System')
    expect(resolveRouteDocumentTitle('/component-workbench/overview/module-overview', t)).toBe(
      'Module Overview – overview – KRAN Design System',
    )
  })

  it('uses the Hindi screen and module names', async () => {
    await i18n.changeLanguage('hi')
    const t = i18n.t.bind(i18n)
    expect(resolveRouteDocumentTitle('/', t)).toBe('लॉगिन – KRAN Design System')
    expect(resolveRouteDocumentTitle('/inbox/overview', t)).toBe(
      'Home – होम – KRAN Design System',
    )
  })
})
