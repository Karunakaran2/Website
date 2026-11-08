export const DASHBOARD_FINANCIAL_YEAR_OPTIONS = [
  '2025-2026',
  '2024-2025',
  '2023-2024',
  '2022-2023',
]

export function getCurrentFinancialYear() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  if (month >= 4) {
    return `${year}-${year + 1}`
  }
  return `${year - 1}-${year}`
}
