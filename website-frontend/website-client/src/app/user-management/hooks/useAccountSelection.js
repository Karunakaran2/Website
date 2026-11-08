import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedAccountId } from '../redux/selectors'
import { setSelectedAccountId } from '../redux/slice'
import { DEFAULT_ACCOUNT_ID } from '../constants/accounts'

export function useAccountSelection(initialAccountId = DEFAULT_ACCOUNT_ID) {
  const dispatch = useDispatch()
  const selectedAccountId = useSelector(selectSelectedAccountId) ?? initialAccountId

  return {
    selectedAccountId,
    setSelectedAccountId: (accountId) => dispatch(setSelectedAccountId(accountId)),
  }
}
