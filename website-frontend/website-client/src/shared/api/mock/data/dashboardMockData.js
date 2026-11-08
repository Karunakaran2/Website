/**
 * Mock Data for KRAN Design System Dashboard Cards, Charts and Widgets
 */

export const MOCK_DASHBOARD_CARDS = [
  {
    widgetKey: 'active_components',
    widgetName: 'Active Design Components',
    displayValue: '142',
    color: '#01458e',
  },
  {
    widgetKey: 'design_tokens',
    widgetName: 'Design Tokens Defined',
    displayValue: '586',
    color: '#0284c7',
  },
  {
    widgetKey: 'adopting_projects',
    widgetName: 'Adopting Projects',
    displayValue: '24',
    color: '#16a34a',
  },
  {
    widgetKey: 'pending_reviews',
    widgetName: 'Pending RFC / Reviews',
    displayValue: '8',
    color: '#d97706',
  },
  {
    widgetKey: 'compliance_rate',
    widgetName: 'WCAG 2.1 AA Compliance',
    displayValue: '99.4%',
    color: '#7c3aed',
  },
]

export const MOCK_DASHBOARD_CHARTS = [
  {
    widgetKey: 'component_usage',
    widgetName: 'Component Library Usage',
    chartType: 'bar',
    labels: ['Forms & Inputs', 'Data Tables', 'Navigation', 'Feedback & Modals'],
    series: [
      {
        label: 'Production Adoptions',
        data: [1450, 1120, 890, 760],
        color: '#01458e',
      },
      {
        label: 'Templates Implemented',
        data: [820, 940, 710, 520],
        color: '#0284c7',
      },
    ],
  },
  {
    widgetKey: 'project_distribution',
    widgetName: 'Design System Adoptions by Project',
    chartType: 'pie',
    labels: [
      'Enterprise Portal',
      'E-Governance Platform',
      'Analytics & Reporting',
      'Client Dashboard',
      'Mobile / Responsive Web',
      'Internal Tooling',
    ],
    series: [
      {
        data: [35, 25, 15, 12, 8, 5],
        color: '#4ade80,#60a5fa,#f87171,#facc15,#c084fc,#fb923c',
      },
    ],
  },
  {
    widgetKey: 'monthly_release_trend',
    widgetName: 'Monthly Component Releases & Updates',
    chartType: 'line',
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    series: [
      {
        label: 'Components Published',
        data: [12, 15, 18, 14, 22, 28, 25, 30, 32, 29, 34, 38],
        color: '#059669',
      },
    ],
  },
  {
    widgetKey: 'accessibility_standards',
    widgetName: 'Accessibility & Quality Scorecard',
    chartType: 'pie',
    labels: [
      'WCAG 2.1 AA Compliant',
      'Keyboard Accessible',
      'Screen Reader Verified',
      'High Contrast Mode',
    ],
    series: [
      {
        data: [45, 25, 20, 10],
        color: '#3b82f6,#10b981,#f59e0b,#ef4444',
      },
    ],
  },
]
