/**
 * Mock Auth Data & Captcha Generator
 */

let currentCaptcha = {
  id: 'mock-cap-initial',
  code: '8X4K2',
}

export function generateMockCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 5; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const captchaId = `mock-cap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  currentCaptcha = { id: captchaId, code }

  // Generate SVG with realistic CAPTCHA styling (subtle waves, dots, angled glyphs)
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="50" viewBox="0 0 160 50">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </linearGradient>
    <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" rx="4"/>
  <rect width="100%" height="100%" fill="url(#dots)" rx="4"/>
  <path d="M 5 25 Q 40 5, 80 25 T 155 20" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.4"/>
  <path d="M 10 38 Q 50 48, 100 20 T 150 35" fill="none" stroke="#64748b" stroke-width="1" opacity="0.3"/>
  <text x="18" y="34" font-family="'Courier New', monospace, sans-serif" font-size="26" font-weight="900" letter-spacing="9" fill="#01458e">
    ${code}
  </text>
</svg>`.trim()

  const imageBase64 = `data:image/svg+xml;base64,${btoa(svg)}`

  return {
    captchaId,
    imageBase64,
    code,
  }
}

export function getCurrentCaptcha() {
  return currentCaptcha
}

export const MOCK_USERS = {
  admin: {
    username: 'admin',
    displayName: 'Administrator (KRAN)',
    firstName: 'KRAN',
    lastName: 'Admin',
    email: 'admin@kran.co.in',
    mobile: '9876543210',
    designation: 'Principal UI/UX Architect',
    postingName: 'Design System Lead',
    hierarchyName: 'KRAN Consulting Services',
    hierarchyCode: 'KRAN-HQ-DS-01',
    domain: 'D',
    role: 'Design System Administrator',
    userIdMask: 'usr-admin-001',
    userSetupIdMask: 'usr-admin-001',
  },
  demo: {
    username: 'demo',
    displayName: 'KRAN Frontend Engineer',
    firstName: 'Demo',
    lastName: 'User',
    email: 'engineer@kran.co.in',
    mobile: '9876543211',
    designation: 'Senior Frontend Engineer',
    postingName: 'UI Engineering',
    hierarchyName: 'KRAN Consulting Services',
    hierarchyCode: 'KRAN-ENG-02',
    domain: 'D',
    role: 'Frontend Engineer',
    userIdMask: 'usr-demo-002',
    userSetupIdMask: 'usr-demo-002',
  },
}

export const MOCK_SEATS = [
  {
    idMask: 'seat-kran-ds-01',
    hierarchyName: 'Design System & Component Architecture Hub',
    hierarchyCode: 'KRAN-DS-ARCH-01',
    postingName: 'Lead UI/UX Architect',
    officeName: 'KRAN Consulting Corporate HQ',
    officeType: 'Head Office',
    category: 'Architecture',
  },
  {
    idMask: 'seat-kran-eng-02',
    hierarchyName: 'Enterprise Frontend Solutions Wing',
    hierarchyCode: 'KRAN-FE-ENG-02',
    postingName: 'Senior Frontend Engineer',
    officeName: 'KRAN Innovation Lab – Kochi',
    officeType: 'Technology Unit',
    category: 'Engineering',
  },
  {
    idMask: 'seat-kran-gov-03',
    hierarchyName: 'Digital Platforms & Solutions Desk',
    hierarchyCode: 'KRAN-DIGITAL-03',
    postingName: 'Solutions Consultant',
    officeName: 'KRAN Client Delivery Centre – TVM',
    officeType: 'Delivery Centre',
    category: 'Delivery',
  },
  {
    idMask: 'seat-kran-qa-04',
    hierarchyName: 'Design QA & Accessibility Compliance Wing',
    hierarchyCode: 'KRAN-QA-ACC-04',
    postingName: 'Quality & Accessibility Lead',
    officeName: 'KRAN Quality Assurance Lab',
    officeType: 'Quality Wing',
    category: 'Standards',
  },
]
