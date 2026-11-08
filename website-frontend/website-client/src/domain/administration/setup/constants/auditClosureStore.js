import { useSyncExternalStore } from 'react'

function date(year, month, day) {
  return new Date(year, month - 1, day)
}

const seedYears = [
  {
    idMask: 'fy-2024-25',
    fromDate: date(2024, 4, 1),
    toDate: date(2025, 3, 31),
    label: '2024-25',
    current: false,
    active: false,
    frozen: false,
  },
  {
    idMask: 'fy-2025-26',
    fromDate: date(2025, 4, 1),
    toDate: date(2026, 3, 31),
    label: '2025-26',
    current: true,
    active: true,
    frozen: false,
  },
]

export const AUDIT_CLOSURE_MONTHS = [
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
]

const seedTodos = [
  {
    idMask: 'todo-bank-recon',
    title: 'Bank reconciliation signed off',
    period: 'yearly',
    month: '',
    financialYearLabel: '2025-26',
    complete: true,
    active: true,
    finalized: false,
  },
  {
    idMask: 'todo-asset-verification',
    title: 'Fixed asset physical verification',
    period: 'yearly',
    month: '',
    financialYearLabel: '2025-26',
    complete: false,
    active: true,
    finalized: false,
  },
  {
    idMask: 'todo-statutory-dues',
    title: 'Statutory dues reconciled',
    period: 'yearly',
    month: '',
    financialYearLabel: '2025-26',
    complete: true,
    active: true,
    finalized: true,
  },
  {
    idMask: 'todo-opening-balance',
    title: 'Opening trial balance reviewed',
    period: 'yearly',
    month: '',
    financialYearLabel: '2024-25',
    complete: false,
    active: false,
    finalized: false,
  },
  {
    idMask: 'todo-gst-april',
    title: 'GST return filed',
    period: 'monthly',
    month: 'April',
    financialYearLabel: '2025-26',
    complete: false,
    active: true,
    finalized: false,
  },
  {
    idMask: 'todo-bank-book-march',
    title: 'Bank book closed',
    period: 'monthly',
    month: 'March',
    financialYearLabel: '2025-26',
    complete: true,
    active: true,
    finalized: true,
  },
]

export function checklistPeriodLabel(todo) {
  if (todo?.period === 'monthly') {
    return todo.month || 'Monthly'
  }
  return 'Yearly'
}

let state = {
  years: seedYears,
  todos: seedTodos,
}

const listeners = new Set()

function emit(next) {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function financialYearLabel(fromDate, toDate) {
  if (!(fromDate instanceof Date) || !(toDate instanceof Date)) {
    return ''
  }
  const end = String(toDate.getFullYear()).slice(-2)
  return `${fromDate.getFullYear()}-${end}`
}

export function useAuditClosureData() {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export function currentFinancialYear() {
  return state.years.find((year) => year.current) ?? null
}

export function addFinancialYear({ fromDate, toDate }) {
  const label = financialYearLabel(fromDate, toDate)
  const nextYear = {
    idMask: `fy-${label}-${Date.now().toString(36)}`,
    fromDate,
    toDate,
    label,
    current: true,
    active: true,
    frozen: false,
  }
  emit({
    ...state,
    years: [
      nextYear,
      ...state.years.map((year) => ({
        ...year,
        current: false,
        active: year.frozen ? Boolean(year.active) : false,
      })),
    ],
  })
}

export function updateFinancialYear({ idMask, fromDate, toDate }) {
  const current = state.years.find((year) => year.idMask === idMask)
  if (!current || current.frozen) {
    return
  }
  const label = financialYearLabel(fromDate, toDate)
  emit({
    ...state,
    years: state.years.map((year) => (
      year.idMask === idMask ? { ...year, fromDate, toDate, label } : year
    )),
    todos: state.todos.map((todo) => (
      todo.financialYearLabel === current.label
        ? { ...todo, financialYearLabel: label }
        : todo
    )),
  })
}

export function activateFinancialYear(idMask) {
  const target = state.years.find((year) => year.idMask === idMask)
  if (!target || target.frozen || state.years.some((year) => year.frozen)) {
    return
  }
  emit({
    ...state,
    years: state.years.map((year) => (
      year.idMask === idMask
        ? { ...year, active: true, current: true }
        : { ...year, active: false, current: false }
    )),
  })
}

export function deactivateFinancialYear(idMask) {
  emit({
    ...state,
    years: state.years.map((year) => (
      year.idMask === idMask && !year.frozen ? { ...year, active: false } : year
    )),
  })
}

export function freezeFinancialYear(idMask) {
  const target = state.years.find((year) => year.idMask === idMask)
  if (!target || !target.active || target.frozen || state.years.some((year) => year.frozen)) {
    return
  }
  emit({
    ...state,
    years: state.years.map((year) => (
      year.idMask === idMask ? { ...year, frozen: true, active: true } : year
    )),
  })
}

export function savePreClosureTodo({ idMask, title, period, month, financialYearLabel }) {
  const yearLabel = financialYearLabel || currentFinancialYear()?.label || ''
  const nextMonth = period === 'monthly' ? month : ''
  if (idMask) {
    emit({
      ...state,
      todos: state.todos.map((todo) => (
        todo.idMask === idMask
          ? { ...todo, title, month: nextMonth, financialYearLabel: yearLabel }
          : todo
      )),
    })
    return
  }
  emit({
    ...state,
    todos: [
      {
        idMask: `todo-${Date.now().toString(36)}`,
        title,
        period,
        month: nextMonth,
        financialYearLabel: yearLabel,
        complete: false,
        active: true,
        finalized: false,
      },
      ...state.todos,
    ],
  })
}

export function markPreClosureTodoComplete(idMask) {
  emit({
    ...state,
    todos: state.todos.map((todo) => (
      todo.idMask === idMask ? { ...todo, complete: true } : todo
    )),
  })
}

export function deactivatePreClosureTodo(idMask) {
  emit({
    ...state,
    todos: state.todos.map((todo) => (
      todo.idMask === idMask ? { ...todo, active: false } : todo
    )),
  })
}

export function finalizePreClosureTodo(idMask) {
  emit({
    ...state,
    todos: state.todos.map((todo) => (
      todo.idMask === idMask ? { ...todo, finalized: true, complete: true } : todo
    )),
  })
}
