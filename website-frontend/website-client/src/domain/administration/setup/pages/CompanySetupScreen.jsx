import { useState } from 'react'
import FormModal from '@/shared/components/modals/FormModal'
import SetupEditPageHeaderActions from '../components/SetupEditPageHeaderActions'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import {
  useGetCompanySetupQuery,
  useSaveSetupMutation,
  useUpdateSetupMutation,
} from '../services/setupApi'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { setupFormModalTitle } from '../utils/setupFormModalTitle'
import { resolveSetupPublicId, setupMutationIdFields } from '../utils/setupRowId'

function extractFieldErrors(error) {
  const payload = error?.payload
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  return {}
}

function toOptionalNumber(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export default function CompanySetupScreen({ master }) {
  const [editing, setEditing] = useState(false)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [draftValues, setDraftValues] = useState(null)

  const { data: company, isLoading, error, refetch } = useGetCompanySetupQuery()
  const [saveSetup] = useSaveSetupMutation()
  const [updateSetup] = useUpdateSetupMutation()

  const existingCompany = company?.id != null ? company : null
  const isView = Boolean(existingCompany) && !editing
  const formModalOpen = editing || !existingCompany

  const startEdit = () => {
    setEditing(true)
    setFormError('')
    setFieldErrors({})
  }

  const cancelEdit = () => {
    setEditing(false)
    setFormError('')
    setFieldErrors({})
    setDraftValues(null)
  }

  const handleSave = async (values) => {
    setDraftValues(values)
    const body = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value === '' ? null : value]),
    )
    delete body.isDeleted
    delete body.deleted
    body.pinCode = toOptionalNumber(body.pinCode)
    if (typeof body.corporateIdentificationNumber === 'string') {
      body.corporateIdentificationNumber = body.corporateIdentificationNumber.toUpperCase()
    }
    if (typeof body.tanNumber === 'string') {
      body.tanNumber = body.tanNumber.toUpperCase()
    }
    if (typeof body.panNumber === 'string') {
      body.panNumber = body.panNumber.toUpperCase()
    }
    if (!body.nonProfitableOrganizationStatus) {
      body.nonProfitableOrganizationStatus = 'Y'
    }

    const companyPublicId = resolveSetupPublicId(existingCompany, master)
    const result = existingCompany
      ? await updateSetup({
          resource: master.resource,
          entityName: master.entityName,
          id: companyPublicId,
          body: {
            ...body,
            ...setupMutationIdFields(existingCompany, companyPublicId),
          },
        })
      : await saveSetup({
          resource: master.resource,
          entityName: master.entityName,
          body,
        })

    if (result.error) {
      const nextFieldErrors = extractFieldErrors(result.error)
      setFieldErrors(nextFieldErrors)
      setFormError(Object.keys(nextFieldErrors).length
        ? 'Please correct the highlighted fields.'
        : (result.error.data || 'Unable to save company details'))
      return false
    }

    setFormError('')
    setFieldErrors({})
    setDraftValues(null)
    setEditing(false)
    refetch()
    return true
  }

  return (
    <>
      <SetupEditPageHeaderActions visible={!isLoading && isView} onEdit={startEdit} />

      {error?.data ? (
        <p className={`mb-4 ${MODULE_FORM_ERROR_BANNER_CLASS}`} role="alert">
          {error.data}
        </p>
      ) : null}

      {isLoading ? (
        <SetupEditFormSkeleton
          sections={[{ fields: 12, cols: 3 }, { fields: 6, cols: 3 }]}
          showFooter={false}
        />
      ) : (
        <>
          {isView ? (
            <SetupForm
              key="company-view"
              master={master}
              initialValues={existingCompany}
              fieldErrors={{}}
              formError=""
              onSubmit={handleSave}
              readOnly
              hideCancel
              showSubmit={false}
            />
          ) : null}

          <FormModal
            open={formModalOpen}
            onClose={existingCompany ? cancelEdit : undefined}
            title={setupFormModalTitle(master, editing ? 'edit' : null)}
            size="5xl"
            showFooter={false}
            bodyMaxHeightClass="max-h-[min(78vh,840px)]"
          >
            {formModalOpen ? (
              <SetupForm
                key={editing ? 'company-edit' : 'company-create'}
                master={master}
                initialValues={draftValues || existingCompany}
                fieldErrors={fieldErrors}
                formError={formError}
                onSubmit={handleSave}
                onCancel={existingCompany ? cancelEdit : undefined}
                hideCancel={!existingCompany}
                submitLabel={existingCompany ? 'Update' : 'Save'}
              />
            ) : null}
          </FormModal>
        </>
      )}
    </>
  )
}
