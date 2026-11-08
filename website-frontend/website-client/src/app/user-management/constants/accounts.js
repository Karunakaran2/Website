import assamImage from '@/assets/Assam.png'
import bhubaneswarImage from '@/assets/Bhubaneswar.png'
import delhiImage from '@/assets/Delhi.png'
import mumbaiImage from '@/assets/Mumbai.png'
import ranchiImage from '@/assets/Ranchi.png'
import thiruvananthapuramImage from '@/assets/Thiruvananthapuram.png'
import { ACCOUNT_DEFS, DEFAULT_ACCOUNT_ID, getAccountById as getAccountMeta } from './accountsMeta'

const ACCOUNT_IMAGES = {
  thiruvananthapuram: thiruvananthapuramImage,
  assam: assamImage,
  'new-delhi': delhiImage,
  mumbai: mumbaiImage,
  bhubaneswar: bhubaneswarImage,
  ranchi: ranchiImage,
}

export const ACCOUNTS = ACCOUNT_DEFS.map((account) => ({
  ...account,
  image: ACCOUNT_IMAGES[account.id],
}))

export { DEFAULT_ACCOUNT_ID }

export function getAccountById(accountId) {
  const account = getAccountMeta(accountId)
  if (!account) {
    return null
  }
  return ACCOUNTS.find((item) => item.id === account.id) ?? { ...account }
}
