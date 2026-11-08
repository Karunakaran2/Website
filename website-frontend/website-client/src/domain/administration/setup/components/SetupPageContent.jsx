import {
  AUDIT_CLOSURE_ID,
  SETUP_APPROVAL_ID,
  SETUP_COMPANY_ID,
  SETUP_COST_UNIT_ID,
  SETUP_DFPR_ID,
  SETUP_CHART_OF_ACCOUNTS_ID,
  SETUP_GROUP_ID,
  SETUP_ITEM_SERVICE_ID,
  SETUP_NUMBERING_ID,
  SETUP_OFFICE_ID,
  SETUP_OWN_TAX_ID,
  SETUP_PARTY_ID,
} from '@/app/shell/constants/dashboard'
import { resolveSetupMaster } from '../constants/masters'
import BankAccountSetupScreen from '../pages/BankAccountSetupScreen'
import CashSetupScreen from '../pages/CashSetupScreen'
import CompanySetupScreen from '../pages/CompanySetupScreen'
import CostUnitScreen from '../pages/CostUnitScreen'
import ChartOfAccountsScreen from '../pages/ChartOfAccountsScreen'
import GroupSetupScreen from '../pages/GroupSetupScreen'
import ItemServiceScreen from '../pages/ItemServiceScreen'
import NumberingSetupScreen from '../pages/NumberingSetupScreen'
import DfprSetupScreen from '../pages/DfprSetupScreen'
import OfficeSetupScreen from '../pages/OfficeSetupScreen'
import OwnTaxInfoScreen from '../pages/OwnTaxInfoScreen'
import PartySetupScreen from '../pages/PartySetupScreen'
import PartySetupCustomPartyLedgerScreen from '../pages/PartySetupCustomPartyLedgerScreen'
import SetupApprovalScreen from '../pages/SetupApprovalScreen'
import LedgerAllocationScreen from '../pages/LedgerAllocationScreen'
import UserAllocationScreen from '../pages/UserAllocationScreen'
import SetupMasterScreen from '../pages/SetupMasterScreen'
import AuditClosureFinancialYearScreen from '../pages/AuditClosureFinancialYearScreen'
import AuditClosureListScreen from '../pages/AuditClosureListScreen'
import PreClosureChecklistScreen from '../pages/PreClosureChecklistScreen'
import { ActionConfirmProvider } from '@/shared/components/confirm'
import { usePrivileges } from '@/shared/hooks/usePrivileges'
import { PROBITY_PRIVILEGES } from '@/shared/privileges/probityPrivileges'

function SetupPageContentBody({ activePrimaryId, activeSecondaryId }) {
  const { canAccess } = usePrivileges()
  const master = resolveSetupMaster(activePrimaryId, activeSecondaryId)

  if (activePrimaryId === SETUP_APPROVAL_ID) {
    return <SetupApprovalScreen inbox={activeSecondaryId || 'received'} />
  }

  if (activePrimaryId === AUDIT_CLOSURE_ID) {
    if (activeSecondaryId === 'yearly-checklist') {
      return <PreClosureChecklistScreen period="yearly" />
    }
    if (activeSecondaryId === 'monthly-checklist') {
      return <PreClosureChecklistScreen period="monthly" />
    }
    if (activeSecondaryId === 'audit-closure-list') {
      return <AuditClosureListScreen />
    }
    return <AuditClosureFinancialYearScreen />
  }

  if (!master) {
    return null
  }

  if (activePrimaryId === SETUP_COMPANY_ID || master.singleRecord) {
    return <CompanySetupScreen master={master} />
  }

  if (activePrimaryId === SETUP_OFFICE_ID) {
    return <OfficeSetupScreen master={master} />
  }

  if (activePrimaryId === SETUP_DFPR_ID) {
    return <DfprSetupScreen master={master} />
  }

  if (activePrimaryId === SETUP_GROUP_ID) {
    return <GroupSetupScreen master={master} />
  }

  if (activePrimaryId === SETUP_CHART_OF_ACCOUNTS_ID) {
    return <ChartOfAccountsScreen master={master} />
  }

  if (activePrimaryId === SETUP_OWN_TAX_ID) {
    return <OwnTaxInfoScreen master={master} />
  }

  if (activePrimaryId === SETUP_COST_UNIT_ID) {
    return <CostUnitScreen master={master} />
  }

  if (activePrimaryId === SETUP_ITEM_SERVICE_ID) {
    return <ItemServiceScreen master={master} />
  }

  if (activePrimaryId === SETUP_NUMBERING_ID) {
    return <NumberingSetupScreen master={master} />
  }

  if (activePrimaryId === SETUP_PARTY_ID && activeSecondaryId === 'custom-party-ledger') {
    return <PartySetupCustomPartyLedgerScreen master={master} />
  }

  if (activePrimaryId === SETUP_PARTY_ID) {
    return <PartySetupScreen master={master} />
  }

  if (master.resource === 'cash-setup') {
    return <CashSetupScreen master={master} />
  }

  if (master.resource === 'bank-account-setup') {
    return <BankAccountSetupScreen master={master} />
  }

  if (master.resource === 'ledger-allocation') {
    return <LedgerAllocationScreen master={master} />
  }

  if (master.resource === 'user-allocation') {
    return <UserAllocationScreen master={master} />
  }

  if (
    master.resource === 'financial-year-setup'
    && !canAccess(PROBITY_PRIVILEGES.FINANCIAL_YEAR_DIV)
  ) {
    return null
  }

  return <SetupMasterScreen master={master} />
}

export default function SetupPageContent(props) {
  return (
    <ActionConfirmProvider>
      <SetupPageContentBody {...props} />
    </ActionConfirmProvider>
  )
}
