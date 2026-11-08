const STORAGE_KEY = 'kran_demo_workforce_cases_v1'

export const INITIAL_CASES = [
  {
    id: 'CASE-1001',
    title: 'Workstation request — Finance wing',
    category: 'Facilities',
    priority: 'Medium',
    status: 'Pending review',
    assignee: 'Unassigned',
    requester: 'Meera Krishnan',
    dueDate: '28-10-2026',
  },
  {
    id: 'CASE-1002',
    title: 'Grievance — leave balance discrepancy',
    category: 'HR',
    priority: 'High',
    status: 'In progress',
    assignee: 'Rajesh Nair',
    requester: 'Ananya Sharma',
    dueDate: '25-10-2026',
  },
  {
    id: 'CASE-1003',
    title: 'VPN access for vendor audit',
    category: 'IT Security',
    priority: 'High',
    status: 'Pending review',
    assignee: 'Unassigned',
    requester: 'Rajesh Nair',
    dueDate: '26-10-2026',
  },
  {
    id: 'CASE-1004',
    title: 'Payroll correction — October cycle',
    category: 'Payroll',
    priority: 'Critical',
    status: 'Escalated',
    assignee: 'Siddharth Varma',
    requester: 'Ananya Sharma',
    dueDate: '24-10-2026',
  },
]

class WorkforceCaseService {
  getAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {
      // ignore
    }
    return [...INITIAL_CASES]
  }

  saveAll(cases) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
    } catch {
      // ignore
    }
    return this.getAll()
  }

  updateStatus(id, status) {
    const next = this.getAll().map((c) => (c.id === id ? { ...c, status } : c))
    return this.saveAll(next)
  }
}

export const workforceCaseService = new WorkforceCaseService()
