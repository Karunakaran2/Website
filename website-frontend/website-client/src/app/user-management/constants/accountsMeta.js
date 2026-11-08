/** Account ids/names only — keep images out of this module so dashboard login checks stay light. */

export const ACCOUNT_DEFS = [
  {
    id: 'thiruvananthapuram',
    name: 'Kran - Thiruvananthapuram',
    role: 'Accounts Director',
  },
  {
    id: 'assam',
    name: 'Kran - Assam',
    role: 'Accounts Director',
  },
  {
    id: 'new-delhi',
    name: 'Kran - New Delhi',
    role: 'Accounts Director',
  },
  {
    id: 'mumbai',
    name: 'Kran - Mumbai',
    role: 'Accounts Director',
  },
  {
    id: 'bhubaneswar',
    name: 'Kran - Bhubaneswar',
    role: 'Accounts Director',
  },
  {
    id: 'ranchi',
    name: 'Kran - Ranchi',
    role: 'Accounts Director',
  },
]

export const DEFAULT_ACCOUNT_ID = ACCOUNT_DEFS[0].id

export function getAccountById(accountId) {
  return ACCOUNT_DEFS.find((account) => account.id === accountId) ?? null
}
