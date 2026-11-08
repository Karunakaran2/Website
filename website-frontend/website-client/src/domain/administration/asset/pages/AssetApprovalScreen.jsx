import { useState } from 'react'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { SelectField } from '@/shared/components/forms'
import {
  ASSET_APPROVAL_WORKFLOW_SUB_TABS,
  DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID,
} from '@/app/shell/constants/dashboard'
import {
  ASSET_APPROVAL_TYPE_DISPOSAL,
  ASSET_APPROVAL_TYPE_INFORMATION,
  ASSET_APPROVAL_TYPE_MAINTENANCE,
  ASSET_APPROVAL_TYPE_OPTIONS,
  DEFAULT_ASSET_APPROVAL_TYPE,
} from '../constants/assetApproval'
import AssetInformationApprovalScreen from './AssetInformationApprovalScreen'
import AssetMaintenanceApprovalScreen from './AssetMaintenanceApprovalScreen'
import AssetDisposalApprovalScreen from './AssetDisposalApprovalScreen'

export default function AssetApprovalScreen() {
  const [approvalType, setApprovalType] = useState(DEFAULT_ASSET_APPROVAL_TYPE)
  const [workflowTab, setWorkflowTab] = useState(DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID)

  return (
    <>
      <div className="mb-4 flex flex-col gap-3">
        <div className="max-w-md">
          <SelectField
            id="asset-approval-type"
            name="assetApprovalType"
            aria-label="Approval type"
            value={approvalType}
            onChange={(event) => {
              setApprovalType(event.target.value)
              setWorkflowTab(DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID)
            }}
          >
            {ASSET_APPROVAL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="flex flex-wrap gap-2">
          {ASSET_APPROVAL_WORKFLOW_SUB_TABS.map((tab) => (
            <GigwButton
              key={tab.id}
              type="button"
              variant={workflowTab === tab.id ? 'primary' : 'secondary'}
              onClick={() => setWorkflowTab(tab.id)}
            >
              {tab.label}
            </GigwButton>
          ))}
        </div>
      </div>

      {approvalType === ASSET_APPROVAL_TYPE_INFORMATION ? (
        <AssetInformationApprovalScreen
          key={`information-${workflowTab}`}
          embedded
          workflowTab={workflowTab}
        />
      ) : approvalType === ASSET_APPROVAL_TYPE_MAINTENANCE ? (
        <AssetMaintenanceApprovalScreen
          key={`maintenance-${workflowTab}`}
          embedded
          workflowTab={workflowTab}
        />
      ) : approvalType === ASSET_APPROVAL_TYPE_DISPOSAL ? (
        <AssetDisposalApprovalScreen
          key={`disposal-${workflowTab}`}
          embedded
          workflowTab={workflowTab}
        />
      ) : (
        <AssetInformationApprovalScreen
          key={`information-${workflowTab}`}
          embedded
          workflowTab={workflowTab}
        />
      )}
    </>
  )
}
