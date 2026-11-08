import { baseApi } from '@/shared/api/baseApi'
import { requestFormData, requestJson } from '@/shared/api/client'
import {
  apiErrorToRtkError,
  assetClassItDtoToOption,
  faGroupPayloadToFixedAssetGroupRequest,
  numberingSetupOptionDtoToOption,
} from './faGroupApiMappers'
import {
  buildDepreciationProcessDefaults,
  fetchDepreciationProcessDefaultsFromMaster,
  depreciationBaseViewPath,
  depreciationFormToFilterRequest,
  depreciationFormToProcessRequest,
  filterCategorySuggestions,
  mapDepreciationBaseListItem,
  mapDepreciationBaseViewPayload,
  mapDepreciationLineDetail,
  mapDepreciationPreviewResponse,
  mapDepreciationSortField,
  depreciationLineDetailPath,
  approvedDepreciationLinesByAssetPath,
  mapApprovedDepreciationLinesByAsset,
} from './assetDepreciationApiMappers'
import {
  buildDisposalProcessDefaults,
  disposalFormToFilterRequest,
  disposalFormToProcessRequest,
  disposalViewPath,
  fetchDisposalProcessDefaultsFallback,
  mapDisposalDefaultsResponse,
  mapDisposalListItem,
  disposalEditPath,
  mapDisposalEditResponse,
  mapDisposalPreviewResponse,
  mapDisposalSortField,
  mapDisposalViewToRow,
  mapDisposalWorkflowRow,
  retirementEditFormToUpdateRequest,
} from './assetDisposalApiMappers'
import {
  maintenanceFormToSaveRequest,
  mapMaintenanceAssetOption,
  mapMaintenanceInvoiceOption,
  mapMaintenanceJournalLine,
  mapMaintenanceListItem,
  mapMaintenanceSearchResponse,
  mapMaintenanceSortField,
  mapMaintenanceVendorOption,
  mapMaintenanceWorkflowRow,
} from './assetMaintenanceApiMappers'
import {
  allocatableAssetToOption,
  allocationContextToDetail,
  approvedAssetSearchRowToTableRow,
  assetInformationDtoToRow,
  assetInformationFormToRequest,
  fixedAssetGroupDtoToRow,
  mapAssetInformationSortField,
  mapFaGroupSortField,
  mapOpeningImportSortField,
  openingAssetBaseDtoToImportRow,
  openingAssetDetailDtoToTableRow,
  assetInformationCustodianToOption,
  costCentreToOption,
  hsnCodeToOption,
  seatUserToCustodianOption,
  allocationFormToRequest,
  returnToStoreFormToRequest,
} from './assetDtoMappers'
import {
  filterViewAllRowsByAllocation,
  pageArrayToListResult,
  pathId,
  toPagingRequest,
} from './assetApiUtils'
import { isRowActive } from '@/shared/components/status/statusLabels'

function buildAssetInformationMultipart(formValues) {
  const request = assetInformationFormToRequest(formValues)
  const formData = new FormData()
  formData.append(
    'data',
    new Blob([JSON.stringify(request)], { type: 'application/json' }),
  )
  if (formValues.attachmentFile instanceof File) {
    formData.append('file', formValues.attachmentFile)
  }
  return formData
}

function faGroupPayloadToRequest(payload) {
  return faGroupPayloadToFixedAssetGroupRequest({
    assetType: payload.assetType,
    assetClassItId: payload.assetClassItId,
    assetNumber: payload.assetNumber,
    numberingGroupId: payload.numberingGroupId,
    depreciable: payload.depreciable,
    depreciationRateIt: payload.depreciationRateIt,
    depreciationMethod: payload.depreciationMethod,
  })
}

function mapAllocationHistoryRow(dto) {
  if (!dto) {
    return null
  }
  return {
    allocationDate:
      dto.allocationDate instanceof Date
        ? dto.allocationDate.toISOString().slice(0, 10)
        : String(dto.allocationDate ?? ''),
    action: 'Allocation',
    location: dto.newLocation ?? '',
    custodianName: dto.custodianName ?? '',
    comments: '',
  }
}

async function searchAssetApprovalWorkflowQueryFn({
  approvalType = 'information',
  status,
  search,
  page,
  pageSize,
  sortBy,
  sortDir,
}) {
  const isMaintenance = approvalType === 'maintenance'
  const isDisposal = approvalType === 'disposal'
  const workflowColumns = isMaintenance
    ? ['assetId', 'assetDescription', 'workflowStatus', 'maintenanceDate']
    : isDisposal
      ? ['assetId', 'assetDescription', 'workflowStatus', 'disposalDate']
      : ['assetId', 'assetDescription', 'status', 'capitalisationDate']
  const sortIndex = workflowColumns.indexOf(sortBy)
  const pagingBody = {
    draw: page,
    start: Math.max(0, (page - 1) * pageSize),
    length: pageSize,
    search: { value: search || '', regexp: null },
    order:
      sortIndex >= 0 ? [{ column: sortIndex, dir: sortDir === 'desc' ? 'desc' : 'asc' }] : [],
    columns: workflowColumns.map((data) => ({ data })),
  }
  const result = await requestJson(
    `/api/v1/asset-approval/searchAssetApprovalWorkflow?approvalType=${encodeURIComponent(approvalType)}&tab=${encodeURIComponent(status)}`,
    {
      method: 'POST',
      body: JSON.stringify(pagingBody),
    },
  )
  if (result.error) {
    return result
  }
  const payload = result.data ?? {}
  const rawRows = Array.isArray(payload.data) ? payload.data : []
  const rows = isMaintenance
    ? rawRows.map(mapMaintenanceWorkflowRow).filter(Boolean)
    : isDisposal
      ? rawRows.map(mapDisposalWorkflowRow).filter(Boolean)
      : rawRows
          .filter((row) => row?.idMask)
          .map((row) => ({
            ...row,
            idMask: String(row.idMask),
          }))
  return {
    data: {
      data: rows,
      recordsFiltered: payload.recordsFiltered ?? rows.length,
      recordsTotal: payload.recordsTotal ?? rows.length,
    },
  }
}

/** RTK Query — FA group, asset information, allocation, opening FA call asset-service; other flows stay on mocks until APIs exist. */
export const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssetModuleHealth: builder.query({
      queryFn: async () => ({ data: { ok: true } }),
      providesTags: ['Asset'],
    }),

    searchFaGroup: builder.query({
      async queryFn({ search, page, pageSize, sortBy, sortDir }) {
        const mappedSort = mapFaGroupSortField(sortBy)
        const result = await requestJson('/api/v1/fixed-asset-group/search', {
          method: 'POST',
          body: JSON.stringify(
            toPagingRequest({
              search,
              page,
              pageSize,
              sortBy: mappedSort,
              sortDir,
            }),
          ),
        })
        if (result.error) {
          return result
        }
        const pageResult = pageArrayToListResult(result.data, page, pageSize)
        const mappedRows = (pageResult.rows ?? []).map(fixedAssetGroupDtoToRow)
        return {
          data: {
            ...pageResult,
            rows: mappedRows,
          },
        }
      },
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({ type: 'Asset', id: row.idMask })),
              { type: 'Asset', id: 'FA_GROUP_LIST' },
            ]
          : [{ type: 'Asset', id: 'FA_GROUP_LIST' }],
    }),

    getFixedAssetGroupById: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: 'Missing FA group id' } }
        }
        const result = await requestJson(
          `/api/v1/fixed-asset-group/getFixedAssetGroupById/${pathId(idMask)}`,
        )
        if (result.error) {
          return result
        }
        return { data: fixedAssetGroupDtoToRow(result.data) }
      },
      providesTags: (_result, _error, idMask) => [{ type: 'Asset', id: idMask }],
    }),

    getFixedAssetGroupList: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/fixed-asset-group/getFixedAssetGroupList')
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return {
          data: list
            .map(fixedAssetGroupDtoToRow)
            .filter((row) => row.isActive !== false)
            .map((row) => ({
              idMask: row.idMask,
              label: row.assetType || row.idMask,
              assetType: row.assetType,
            })),
        }
      },
      providesTags: [{ type: 'Asset', id: 'FA_GROUP_LIST' }],
    }),

    getAssetClassItList: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/fixed-asset-group/getAssetClassItList')
        if (result.error?.status === 404) {
          return { data: [] }
        }
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const options = Array.isArray(result.data)
          ? result.data.map(assetClassItDtoToOption).filter(Boolean)
          : []
        return { data: options }
      },
      providesTags: [{ type: 'Asset', id: 'ASSET_CLASS_IT' }],
    }),

    getFaGroupNumberingSetupList: builder.query({
      async queryFn(voucherType) {
        const base = String(voucherType ?? '').trim()
        if (!base) {
          return { data: [] }
        }
        const candidates = [...new Set([base.toUpperCase(), base, base.toLowerCase()])]
        let lastError = null
        for (const candidate of candidates) {
          const result = await requestJson(
            `/api/v1/numbering-setup/getNumberingSetupListByVoucherType/${encodeURIComponent(candidate)}`,
          )
          if (result.error) {
            lastError = result.error
            if (result.error?.status === 404) {
              continue
            }
            continue
          }
          const options = Array.isArray(result.data)
            ? result.data.map(numberingSetupOptionDtoToOption).filter(Boolean)
            : []
          if (options.length > 0) {
            return { data: options }
          }
        }
        return { data: [] }
      },
      providesTags: (_result, _error, voucherType) => [
        { type: 'Asset', id: `FA_GROUP_NUMBERING_${String(voucherType ?? 'none')}` },
      ],
    }),

    saveFaGroup: builder.mutation({
      async queryFn(payload) {
        const body = faGroupPayloadToRequest(payload)
        const idMask = String(payload?.idMask ?? '').trim()
        const result = idMask
          ? await requestJson(
              `/api/v1/fixed-asset-group/updateFixedAssetGroup/${pathId(idMask)}`,
              { method: 'PUT', body: JSON.stringify(body) },
            )
          : await requestJson('/api/v1/fixed-asset-group/saveFixedAssetGroup', {
              method: 'POST',
              body: JSON.stringify(body),
            })
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: fixedAssetGroupDtoToRow(result.data) }
      },
      invalidatesTags: [{ type: 'Asset', id: 'FA_GROUP_LIST' }],
    }),

    toggleFaGroupActive: builder.mutation({
      async queryFn(row) {
        const idMask = row?.idMask
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing FA group id' } } }
        }
        if (!isRowActive(row)) {
          return {
            error: {
              status: 400,
              data: { message: 'Re-activating an FA group is not supported.' },
            },
          }
        }
        const result = await requestJson(
          `/api/v1/fixed-asset-group/removeFixedAssetGroup/${pathId(idMask)}`,
          { method: 'DELETE' },
        )
        if (result.error) {
          return result
        }
        return { data: { idMask, active: 'N', isActive: false } }
      },
      invalidatesTags: (_result, _error, row) => [
        { type: 'Asset', id: row?.idMask },
        { type: 'Asset', id: 'FA_GROUP_LIST' },
      ],
    }),

    removeFaGroup: builder.mutation({
      async queryFn(idMask) {
        const result = await requestJson(
          `/api/v1/fixed-asset-group/removeFixedAssetGroup/${pathId(idMask)}`,
          { method: 'DELETE' },
        )
        if (result.error) {
          return result
        }
        return { data: { idMask } }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'FA_GROUP_LIST' },
      ],
    }),

    searchAssetInformation: builder.query({
      serializeQueryArgs: ({ queryArgs }) => JSON.stringify(queryArgs),
      async queryFn({
        search,
        page,
        pageSize,
        sortBy,
        sortDir,
        approvedOnly = false,
        allocationFilter = 'ALL',
      }) {
        const path = approvedOnly
          ? '/api/v1/asset-information/search-approved'
          : '/api/v1/asset-information/search'
        const mappedSort = mapAssetInformationSortField(sortBy)
        const pagingBody = toPagingRequest({
          search,
          page,
          pageSize,
          sortBy: mappedSort,
          sortDir,
          allocationFilter: approvedOnly ? allocationFilter : undefined,
        })
        const result = await requestJson(path, {
          method: 'POST',
          body: JSON.stringify(pagingBody),
        })
        if (result.error) {
          return result
        }
        const pageResult = pageArrayToListResult(result.data, page, pageSize)
        const mapRow = approvedOnly
          ? (row) => approvedAssetSearchRowToTableRow(row)
          : (row) => assetInformationDtoToRow(row)
        let mappedRows = (pageResult.rows ?? []).map(mapRow).filter(Boolean)
        if (approvedOnly && mappedRows.length > 0) {
          const enriched = []
          for (const row of mappedRows) {
            if (!row?.idMask) {
              continue
            }
            if (String(row.custodianId ?? '').trim() !== '') {
              enriched.push(row)
              continue
            }
            const detail = await requestJson(
              `/api/v1/asset-information/getAssetInformationById/${pathId(row.idMask)}`,
            )
            if (detail.error || !detail.data) {
              enriched.push(row)
              continue
            }
            const detailRow = assetInformationDtoToRow(detail.data)
            const custodianId = detailRow?.custodianId ?? ''
            enriched.push({ ...row, custodianId })
          }
          mappedRows = filterViewAllRowsByAllocation(enriched, allocationFilter)
        }

        const displayTotal =
          approvedOnly && allocationFilter !== 'ALL'
            ? mappedRows.length
            : pageResult.total

        return {
          data: {
            ...pageResult,
            total: displayTotal,
            rows: mappedRows,
          },
        }
      },
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({ type: 'Asset', id: row.idMask })),
              { type: 'Asset', id: 'ASSET_INFO_LIST' },
            ]
          : [{ type: 'Asset', id: 'ASSET_INFO_LIST' }],
    }),

    listAssetInformationCustodians: builder.query({
      async queryFn() {
        let result = await requestJson(
          '/api/v1/asset-information/getActiveSeatUserAllotedList',
        )
        if (
          result.error?.status === 404
          || result.error
          || !Array.isArray(result.data)
          || result.data.length === 0
        ) {
          const fallback = await requestJson(
            '/api/v1/user-allocation/getActiveSeatUserAllotedList',
          )
          if (!fallback.error && Array.isArray(fallback.data) && fallback.data.length > 0) {
            result = fallback
          }
        }
        if (result.error?.status === 404) {
          return { data: [] }
        }
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const list = Array.isArray(result.data) ? result.data : []
        return {
          data: list.map(assetInformationCustodianToOption).filter(Boolean),
        }
      },
      providesTags: [{ type: 'Asset', id: 'ASSET_INFO_CUSTODIANS' }],
    }),

    listCostCentres: builder.query({
      async queryFn() {
        // Probity 2.0: accountingService.getCostCentreList() → master-setup cost-centre API.
        let result = await requestJson('/api/v1/cost-centre/getCostCentreList')
        if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
          const fallback = await requestJson('/api/v1/asset-information/getCostCentreList')
          if (!fallback.error && Array.isArray(fallback.data) && fallback.data.length > 0) {
            result = fallback
          }
        }
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(costCentreToOption).filter(Boolean) }
      },
      providesTags: [{ type: 'Asset', id: 'ASSET_INFO_COST_CENTRES' }],
    }),

    listDistinctAssetLocations: builder.query({
      async queryFn() {
        const result = await requestJson(
          '/api/v1/asset-information/getDistinctAssetLocationList',
        )
        if (result.error?.status === 404) {
          return { data: [] }
        }
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const list = Array.isArray(result.data) ? result.data : []
        return {
          data: list.map((value) => String(value ?? '').trim()).filter(Boolean),
        }
      },
      providesTags: [{ type: 'Asset', id: 'ASSET_INFO_LOCATIONS' }],
    }),

    listHsnCodes: builder.query({
      async queryFn() {
        // Prefer asset-service list (save validates probity.hsn_code); fallback to master-setup.
        let result = await requestJson('/api/v1/asset-information/getHsnCodeList')
        if (result.error || !Array.isArray(result.data) || result.data.length === 0) {
          const fallback = await requestJson('/api/v1/hsn-code/getHsnCodeList')
          if (!fallback.error && Array.isArray(fallback.data) && fallback.data.length > 0) {
            result = fallback
          }
        }
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(hsnCodeToOption).filter(Boolean) }
      },
      providesTags: [{ type: 'Asset', id: 'ASSET_INFO_HSN' }],
    }),

    getAssetInformationById: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: 'Missing asset id' } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/getAssetInformationById/${pathId(idMask)}`,
        )
        if (result.error) {
          return result
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      providesTags: (_result, _error, idMask) => [{ type: 'Asset', id: idMask }],
    }),

    saveAssetInformation: builder.mutation({
      async queryFn(formValues) {
        const idMask = formValues?.idMask
        const formData = buildAssetInformationMultipart(formValues)
        const result = idMask
          ? await requestFormData(
              `/api/v1/asset-information/updateAssetInformation/${pathId(idMask)}`,
              formData,
              { method: 'PUT' },
            )
          : await requestFormData(
              '/api/v1/asset-information/saveAssetInformation',
              formData,
              { method: 'POST' },
            )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: [{ type: 'Asset', id: 'ASSET_INFO_LIST' }],
    }),

    removeAssetInformation: builder.mutation({
      async queryFn() {
        return {
          error: {
            status: 501,
            data: { message: 'Remove asset is not supported by asset-service.' },
          },
        }
      },
    }),

    updateApprovedAssetDescription: builder.mutation({
      async queryFn({ idMask, assetDescription }) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/updateAssetDescription/${pathId(idMask)}`,
          {
            method: 'PUT',
            body: JSON.stringify({ assetDescription }),
          },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: (_result, _error, { idMask }) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
      ],
    }),

    approveAssetInformation: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/approveAssetInformation/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
        { type: 'Asset', id: 'ASSET_INFO_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),

    submitAssetInformation: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/submitAssetInformation/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
        { type: 'Asset', id: 'ASSET_INFO_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),

    forwardAssetInformation: builder.mutation({
      async queryFn({ idMask, toUserIdMask }) {
        if (!idMask || !toUserIdMask) {
          return { error: { status: 400, data: { message: 'Missing forward target' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/updateAssetInformationForward/${pathId(idMask)}`,
          {
            method: 'POST',
            body: JSON.stringify({ toUserIdMask }),
          },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: result.data }
      },
      invalidatesTags: (_result, _error, { idMask }) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
        { type: 'Asset', id: 'ASSET_INFO_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),

    verifyAssetInformation: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/updateAssetInformationVerify/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
        { type: 'Asset', id: 'ASSET_INFO_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),

    getAssetInformationForwardUserList: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        return requestJson(
          `/api/v1/asset-information/getAssetInformationForwardUserList/${pathId(idMask)}`,
        )
      },
    }),

    searchAssetInformationWorkflow: builder.query({
      async queryFn({ status, search, page, pageSize, sortBy, sortDir }) {
        return searchAssetApprovalWorkflowQueryFn({
          approvalType: 'information',
          status,
          search,
          page,
          pageSize,
          sortBy,
          sortDir,
        })
      },
      providesTags: (result, error, arg) => [
        { type: 'Asset', id: 'ASSET_INFO_WORKFLOW' },
        { type: 'Asset', id: `ASSET_INFO_WORKFLOW-${arg.status}` },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
        { type: 'Asset', id: `ASSET_APPROVAL_WORKFLOW-information-${arg.status}` },
      ],
      keepUnusedDataFor: 0,
    }),

    toggleAssetInformationActive: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing asset id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-information/approveAssetInformation/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return result
        }
        return { data: assetInformationDtoToRow(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
      ],
    }),

    listOpeningFixedAssetImports: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/opening-fixed-asset/search', {
          method: 'POST',
          body: JSON.stringify(
            toPagingRequest({
              search: '',
              page: 1,
              pageSize: 100,
              sortBy: mapOpeningImportSortField('fileName'),
              sortDir: 'desc',
            }),
          ),
        })
        if (result.error) {
          return result
        }
        const pageResult = pageArrayToListResult(result.data, 1, 100)
        return {
          data: (pageResult.rows ?? []).map(openingAssetBaseDtoToImportRow),
        }
      },
      providesTags: [{ type: 'Asset', id: 'OPENING_FA_IMPORT' }],
    }),

    uploadOpeningFixedAsset: builder.mutation({
      async queryFn({ file }) {
        if (!(file instanceof File)) {
          return {
            error: { status: 400, data: { message: 'Please choose an Excel file to upload.' } },
          }
        }
        const formData = new FormData()
        formData.append('file', file)
        const result = await requestFormData(
          '/api/v1/opening-fixed-asset/uploadOpeningAssetExcel',
          formData,
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const dto = result.data
        return {
          data: {
            ...openingAssetBaseDtoToImportRow(dto),
            rowCount: dto?.totalAsset ?? 0,
          },
        }
      },
      invalidatesTags: [{ type: 'Asset', id: 'OPENING_FA_IMPORT' }],
    }),

    getOpeningAssetDetailsByBaseId: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { data: [] }
        }
        const result = await requestJson(
          `/api/v1/opening-fixed-asset/getOpeningAssetDetailsByBaseId/${pathId(idMask)}`,
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(openingAssetDetailDtoToTableRow).filter(Boolean) }
      },
      providesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: `OPENING_FA_DETAIL_${idMask}` },
      ],
    }),

    submitOpeningAssetDetails: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return {
            error: { status: 400, data: { message: 'Import batch is required.' } },
          }
        }
        const result = await requestJson(
          `/api/v1/opening-fixed-asset/submitOpeningAssetDetails/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        const message =
          typeof result.data === 'string' ? result.data : 'Asset information saved successfully.'
        return { data: { message } }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: 'OPENING_FA_IMPORT' },
        { type: 'Asset', id: `OPENING_FA_DETAIL_${idMask}` },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
      ],
    }),

    listAssetsForAllocation: builder.query({
      async queryFn() {
        const result = await requestJson(
          '/api/v1/asset-allocation/getAllocatableAssetInformationList',
        )
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(allocatableAssetToOption) }
      },
      providesTags: [{ type: 'Asset', id: 'ALLOCATION_ASSETS' }],
    }),

    listAllocationCustodians: builder.query({
      async queryFn() {
        const result = await requestJson(
          '/api/v1/asset-allocation/getActiveSeatUserAllotedList',
        )
        if (result.error?.status === 404) {
          return { data: [] }
        }
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(seatUserToCustodianOption).filter(Boolean) }
      },
      providesTags: [{ type: 'Asset', id: 'ALLOCATION_CUSTODIANS' }],
    }),

    getAssetAllocationDetail: builder.query({
      async queryFn(assetInformationIdMask) {
        if (!assetInformationIdMask) {
          return { data: null }
        }
        const result = await requestJson(
          `/api/v1/asset-allocation/getAssetAllocationContextByAssetInformationId/${pathId(assetInformationIdMask)}`,
        )
        if (result.error) {
          return result
        }
        return { data: allocationContextToDetail(result.data) }
      },
      providesTags: (_result, _error, assetInformationIdMask) => [
        { type: 'Asset', id: `ALLOCATION_CTX_${assetInformationIdMask}` },
      ],
    }),

    getAssetAllocationHistory: builder.query({
      async queryFn(assetInformationIdMask) {
        if (!assetInformationIdMask) {
          return { data: [] }
        }
        const result = await requestJson(
          `/api/v1/asset-allocation/getAssetAllocationHistoryByAssetInformationId/${pathId(assetInformationIdMask)}`,
        )
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(mapAllocationHistoryRow) }
      },
      providesTags: (_result, _error, assetInformationIdMask) => [
        { type: 'Asset', id: `ALLOCATION_HIST_${assetInformationIdMask}` },
      ],
    }),

    allocateAsset: builder.mutation({
      async queryFn(formValues) {
        const result = await requestJson('/api/v1/asset-allocation/allocateAsset', {
          method: 'POST',
          body: JSON.stringify(allocationFormToRequest(formValues)),
        })
        if (result.error) {
          return result
        }
        const message =
          typeof result.data === 'string' ? result.data : 'Asset allocated successfully.'
        return { data: { message } }
      },
      invalidatesTags: (_result, _error, body) => [
        { type: 'Asset', id: 'ALLOCATION_ASSETS' },
        { type: 'Asset', id: `ALLOCATION_HIST_${body?.assetInformationIdMask}` },
        { type: 'Asset', id: `ALLOCATION_CTX_${body?.assetInformationIdMask}` },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
      ],
    }),

    returnAssetToStore: builder.mutation({
      async queryFn(formValues) {
        const result = await requestJson('/api/v1/asset-allocation/returnAssetToStore', {
          method: 'POST',
          body: JSON.stringify(returnToStoreFormToRequest(formValues)),
        })
        if (result.error) {
          return result
        }
        const message =
          typeof result.data === 'string' ? result.data : 'Asset returned to store.'
        return { data: { message } }
      },
      invalidatesTags: (_result, _error, body) => [
        { type: 'Asset', id: 'ALLOCATION_ASSETS' },
        { type: 'Asset', id: `ALLOCATION_HIST_${body?.assetInformationIdMask}` },
        { type: 'Asset', id: `ALLOCATION_CTX_${body?.assetInformationIdMask}` },
        { type: 'Asset', id: 'ASSET_INFO_LIST' },
      ],
    }),

    getDepreciationProcessDefaults: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/asset-depreciation/getDepreciationProcessDefaults')
        if (result.error) {
          const masterDefaults = await fetchDepreciationProcessDefaultsFromMaster(requestJson)
          if (masterDefaults?.depreciationNo) {
            return { data: masterDefaults }
          }
          return { data: buildDepreciationProcessDefaults() }
        }
        return {
          data: {
            depreciationNo: result.data?.depreciationNo ?? '',
            processUpToStr: result.data?.processUpToStr ?? buildDepreciationProcessDefaults().processUpToStr,
            source: 'asset-service',
          },
        }
      },
      providesTags: [{ type: 'Asset', id: 'DEPRECIATION_DEFAULTS' }],
    }),
    searchDepreciationRuns: builder.query({
      async queryFn({ search, page, pageSize, sortBy, sortDir } = {}) {
        const mappedSort = mapDepreciationSortField(sortBy)
        const result = await requestJson(
          '/api/v1/asset-depreciation/getFixedAssetDepreciationList',
          {
            method: 'POST',
            body: JSON.stringify(
              toPagingRequest({
                search,
                page,
                pageSize,
                sortBy: mappedSort,
                sortDir,
              }),
            ),
          },
        )
        if (result.error) {
          return result
        }
        const list = pageArrayToListResult(result.data, page, pageSize)
        return {
          data: {
            ...list,
            rows: (list.rows ?? [])
              .map((row) => mapDepreciationBaseListItem(row))
              .filter(Boolean),
          },
        }
      },
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({ type: 'Asset', id: row.idMask })),
              { type: 'Asset', id: 'DEPRECIATION_LIST' },
            ]
          : [{ type: 'Asset', id: 'DEPRECIATION_LIST' }],
    }),
    getDepreciationList: builder.mutation({
      async queryFn(formValues) {
        const path = '/api/v1/asset-depreciation/getDepreciationList'
        const result = await requestJson(path, {
          method: 'POST',
          body: JSON.stringify(depreciationFormToFilterRequest(formValues ?? {})),
        })
        if (result.error) {
          return result
        }
        return { data: mapDepreciationPreviewResponse(result.data) }
      },
    }),
    processDepreciationRun: builder.mutation({
      async queryFn({ formValues, preview } = {}) {
        const result = await requestJson('/api/v1/asset-depreciation/processDepreciation', {
          method: 'POST',
          body: JSON.stringify(
            depreciationFormToProcessRequest(formValues ?? {}, preview ?? {}),
          ),
        })
        if (result.error) {
          return result
        }
        const success = result.data === true
        return {
          data: {
            success,
            rowCount: preview?.assetCount ?? preview?.lines?.length ?? 0,
          },
        }
      },
      invalidatesTags: [
        { type: 'Asset', id: 'DEPRECIATION_LIST' },
        { type: 'Asset', id: 'DEPRECIATION_DEFAULTS' },
      ],
    }),
    getDepreciationHistory: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { data: [] }
        }
        const result = await requestJson(depreciationBaseViewPath(idMask))
        if (result.error) {
          return result
        }
        return { data: mapDepreciationBaseViewPayload(result.data) }
      },
    }),
    getApprovedDepreciationLinesByAssetInformation: builder.query({
      async queryFn(assetInformationIdMask) {
        if (!assetInformationIdMask) {
          return { data: [] }
        }
        const result = await requestJson(
          approvedDepreciationLinesByAssetPath(assetInformationIdMask),
        )
        if (result.error) {
          return result
        }
        return { data: mapApprovedDepreciationLinesByAsset(result.data) }
      },
    }),
    getAssetDepreciationLineDetail: builder.query({
      async queryFn(lineIdMask) {
        if (!lineIdMask) {
          return { data: null }
        }
        const result = await requestJson(depreciationLineDetailPath(lineIdMask))
        if (result.error) {
          return result
        }
        const detail = mapDepreciationLineDetail(result.data)
        const journalLines = (detail?.journalLines ?? [])
          .map(mapMaintenanceJournalLine)
          .filter(Boolean)
        return { data: { ...detail, journalLines } }
      },
    }),
    listDepreciationCategorySuggestions: builder.query({
      async queryFn({ category, query } = {}) {
        const cat = category || 'A'
        let items = []

        if (cat === 'S') {
          const classResult = await requestJson('/api/v1/fixed-asset-group/getAssetClassItList')
          if (classResult.error) {
            return classResult
          }
          items = (classResult.data ?? [])
            .map((row) => row.description)
            .filter(Boolean)
        } else if (cat === 'T') {
          const groupResult = await requestJson('/api/v1/fixed-asset-group/search', {
            method: 'POST',
            body: JSON.stringify(
              toPagingRequest({
                search: query || '',
                page: 1,
                pageSize: 100,
                sortBy: 'assetType',
                sortDir: 'asc',
              }),
            ),
          })
          if (groupResult.error) {
            return groupResult
          }
          const types = new Set()
          for (const row of groupResult.data?.data ?? []) {
            const mapped = fixedAssetGroupDtoToRow(row)
            if (mapped?.assetType) {
              types.add(mapped.assetType)
            }
          }
          items = [...types]
        } else if (cat === 'C') {
          let costResult = await requestJson('/api/v1/cost-centre/getCostCentreList')
          if (costResult.error || !Array.isArray(costResult.data) || costResult.data.length === 0) {
            costResult = await requestJson('/api/v1/asset-information/getCostCentreList')
          }
          if (costResult.error) {
            return costResult
          }
          items = (costResult.data ?? [])
            .map((row) => costCentreToOption(row)?.label)
            .filter(Boolean)
        } else if (cat === 'I' || cat === 'L') {
          const assetResult = await requestJson('/api/v1/asset-information/search-approved', {
            method: 'POST',
            body: JSON.stringify(
              toPagingRequest({
                search: query || '',
                page: 1,
                pageSize: 50,
                sortBy: 'assetId',
                sortDir: 'asc',
              }),
            ),
          })
          if (assetResult.error) {
            return assetResult
          }
          for (const row of assetResult.data?.data ?? []) {
            const mapped = approvedAssetSearchRowToTableRow(row)
            if (cat === 'I' && mapped?.assetId) {
              items.push(mapped.assetId)
            }
            if (cat === 'L' && mapped?.location) {
              items.push(mapped.location)
            }
          }
          items = [...new Set(items)]
        }

        return { data: filterCategorySuggestions(items, query) }
      },
    }),
    getDisposalProcessDefaults: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/asset-disposal/getDisposalProcessDefaults')
        if (!result.error) {
          return { data: mapDisposalDefaultsResponse(result.data) }
        }
        const fallback = await fetchDisposalProcessDefaultsFallback(requestJson)
        if (fallback) {
          return { data: fallback }
        }
        return { data: buildDisposalProcessDefaults() }
      },
      providesTags: [{ type: 'Asset', id: 'DISPOSAL_DEFAULTS' }],
    }),
    searchAssetRetirement: builder.query({
      async queryFn({ search, page, pageSize, sortBy, sortDir } = {}) {
        const result = await requestJson('/api/v1/asset-disposal/searchAssetDisposal', {
          method: 'POST',
          body: JSON.stringify(
            toPagingRequest({
              search,
              page,
              pageSize,
              sortBy: mapDisposalSortField(sortBy),
              sortDir,
            }),
          ),
        })
        if (result.error) {
          return result
        }
        const list = pageArrayToListResult(result.data, page, pageSize)
        return {
          data: {
            ...list,
            rows: (list.rows ?? []).map((row) => mapDisposalListItem(row)).filter(Boolean),
          },
        }
      },
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({ type: 'Asset', id: row.idMask })),
              { type: 'Asset', id: 'RETIREMENT_LIST' },
            ]
          : [{ type: 'Asset', id: 'RETIREMENT_LIST' }],
    }),
    getDisposalPreviewList: builder.mutation({
      async queryFn(formValues) {
        const result = await requestJson('/api/v1/asset-disposal/getDisposalPreviewList', {
          method: 'POST',
          body: JSON.stringify(disposalFormToFilterRequest(formValues ?? {})),
        })
        if (result.error) {
          return result
        }
        return { data: mapDisposalPreviewResponse(result.data) }
      },
    }),
    processAssetDisposal: builder.mutation({
      async queryFn({ formValues, previewState } = {}) {
        const result = await requestJson('/api/v1/asset-disposal/processAssetDisposal', {
          method: 'POST',
          body: JSON.stringify(disposalFormToProcessRequest(formValues ?? {}, previewState ?? {})),
        })
        if (result.error) {
          return result
        }
        return {
          data: {
            rowCount: result.data?.rowCount ?? 0,
          },
        }
      },
      invalidatesTags: [{ type: 'Asset', id: 'RETIREMENT_LIST' }],
    }),
    getAssetDisposalView: builder.query({
      async queryFn(idMask) {
        const result = await requestJson(disposalViewPath(idMask))
        if (result.error) {
          return result
        }
        return { data: mapDisposalViewToRow(result.data) }
      },
    }),
    getAssetDisposalForEdit: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'idMask is required' } } }
        }
        const editResult = await requestJson(disposalEditPath(idMask))
        if (!editResult.error) {
          return { data: mapDisposalEditResponse(editResult.data) }
        }
        const viewResult = await requestJson(disposalViewPath(idMask))
        if (viewResult.error) {
          return viewResult
        }
        return { data: mapDisposalEditResponse(viewResult.data) }
      },
    }),
    updateAssetDisposal: builder.mutation({
      async queryFn(formValues) {
        const payload = retirementEditFormToUpdateRequest(formValues ?? {})
        const result = await requestJson('/api/v1/asset-disposal/updateAssetDisposal', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        if (result.error) {
          return result
        }
        return { data: mapDisposalEditResponse(result.data) }
      },
      invalidatesTags: [{ type: 'Asset', id: 'RETIREMENT_LIST' }],
    }),
    approveAssetDisposal: builder.mutation({
      async queryFn(idMask) {
        const result = await requestJson(
          `/api/v1/asset-disposal/approveAssetDisposal/${encodeURIComponent(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return result
        }
        return { data: mapDisposalEditResponse(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'RETIREMENT_LIST' },
        { type: 'Asset', id: 'DISPOSAL_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    forwardAssetDisposal: builder.mutation({
      async queryFn({ idMask, toUserIdMask }) {
        if (!idMask || !toUserIdMask) {
          return { error: { status: 400, data: { message: 'Missing forward target' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-disposal/updateAssetDisposalForward/${pathId(idMask)}`,
          {
            method: 'POST',
            body: JSON.stringify({ toUserIdMask }),
          },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: result.data }
      },
      invalidatesTags: (_result, _error, { idMask }) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'RETIREMENT_LIST' },
        { type: 'Asset', id: 'DISPOSAL_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    verifyAssetDisposal: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing disposal id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-disposal/updateAssetDisposalVerify/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: mapDisposalEditResponse(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'RETIREMENT_LIST' },
        { type: 'Asset', id: 'DISPOSAL_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    getAssetDisposalForwardUserList: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { data: [] }
        }
        return requestJson(
          `/api/v1/asset-disposal/getAssetDisposalForwardUserList/${pathId(idMask)}`,
        )
      },
    }),
    searchAssetDisposalWorkflow: builder.query({
      async queryFn({ status, search, page, pageSize, sortBy, sortDir }) {
        const mappedSortBy =
          sortBy === 'retirementDate' || sortBy === 'disposalDate' ? 'disposalDate' : sortBy
        return searchAssetApprovalWorkflowQueryFn({
          approvalType: 'disposal',
          status,
          search,
          page,
          pageSize,
          sortBy: mappedSortBy,
          sortDir,
        })
      },
      providesTags: (result, error, arg) => [
        { type: 'Asset', id: 'DISPOSAL_WORKFLOW' },
        { type: 'Asset', id: `DISPOSAL_WORKFLOW-${arg.status}` },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
        { type: 'Asset', id: `ASSET_APPROVAL_WORKFLOW-disposal-${arg.status}` },
      ],
      keepUnusedDataFor: 0,
    }),
    deleteAssetDisposal: builder.mutation({
      async queryFn(idMask) {
        const result = await requestJson(
          `/api/v1/asset-disposal/deleteAssetDisposal/${encodeURIComponent(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return result
        }
        return { data: { ok: true } }
      },
      invalidatesTags: [
        { type: 'Asset', id: 'RETIREMENT_LIST' },
        { type: 'Asset', id: 'LIST' },
      ],
    }),
    listAssetsForMaintenance: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/asset-maintenance/listAssetsForMaintenance')
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        let options = list.map(mapMaintenanceAssetOption).filter(Boolean)

        const draftResult = await requestJson('/api/v1/asset-maintenance/searchAssetMaintenance', {
          method: 'POST',
          body: JSON.stringify({
            search: '',
            statusFilter: 'draft',
            page: 1,
            pageSize: 100,
            sortBy: 'maintenanceDate',
            sortDir: 'desc',
          }),
        })
        if (!draftResult.error) {
          const draftRows = mapMaintenanceSearchResponse(draftResult.data, 'draft').rows ?? []
          const blocked = new Set(
            draftRows.map((row) => row.assetInformationIdMask).filter(Boolean),
          )
          options = options.filter((opt) => !blocked.has(opt.idMask))
        }
        return { data: options }
      },
      providesTags: [{ type: 'Asset', id: 'MAINTENANCE_ASSETS' }],
    }),
    listMaintenanceVendors: builder.query({
      async queryFn() {
        const result = await requestJson('/api/v1/asset-maintenance/listMaintenanceVendors')
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(mapMaintenanceVendorOption).filter(Boolean) }
      },
      providesTags: [{ type: 'Asset', id: 'MAINTENANCE_VENDORS' }],
    }),
    listMaintenancePurchaseInvoices: builder.query({
      async queryFn(maintenanceDateStr) {
        if (!maintenanceDateStr) {
          return { data: [] }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/listPurchaseInvoicesByMaintenanceDate?maintenanceDateStr=${encodeURIComponent(maintenanceDateStr)}`,
        )
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(mapMaintenanceInvoiceOption).filter(Boolean) }
      },
    }),
    getSuggestedNextDueDateForAsset: builder.query({
      async queryFn(arg) {
        const assetInformationIdMask =
          typeof arg === 'string' ? arg : arg?.assetInformationIdMask
        const excludeMaintenanceIdMask =
          typeof arg === 'object' && arg != null ? arg.excludeMaintenanceIdMask : undefined
        if (!assetInformationIdMask) {
          return { data: {} }
        }
        let url = `/api/v1/asset-maintenance/getSuggestedNextDueDateForAsset/${encodeURIComponent(assetInformationIdMask)}`
        if (excludeMaintenanceIdMask) {
          url += `?excludeMaintenanceIdMask=${encodeURIComponent(excludeMaintenanceIdMask)}`
        }
        const result = await requestJson(url)
        if (result.error) {
          return result
        }
        return { data: result.data ?? {} }
      },
    }),
    getPurchaseInvoiceJournalLines: builder.query({
      async queryFn(purchaseInvoiceIdMask) {
        if (!purchaseInvoiceIdMask) {
          return { data: [] }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/getPurchaseInvoiceJournalLines/${encodeURIComponent(purchaseInvoiceIdMask)}`,
        )
        if (result.error) {
          return result
        }
        const list = Array.isArray(result.data) ? result.data : []
        return { data: list.map(mapMaintenanceJournalLine).filter(Boolean) }
      },
    }),
    searchAssetMaintenance: builder.query({
      async queryFn(args) {
        const params = args ?? {}
        const result = await requestJson('/api/v1/asset-maintenance/searchAssetMaintenance', {
          method: 'POST',
          body: JSON.stringify({
            search: params.search ?? '',
            statusFilter: params.statusFilter ?? '',
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 10,
            sortBy: mapMaintenanceSortField(params.sortBy),
            sortDir: params.sortDir ?? 'desc',
          }),
        })
        if (result.error) {
          return result
        }
        const statusFilter = params.statusFilter ?? ''
        return { data: mapMaintenanceSearchResponse(result.data, statusFilter) }
      },
      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({ type: 'Asset', id: row.idMask })),
              { type: 'Asset', id: 'MAINTENANCE_LIST' },
            ]
          : [{ type: 'Asset', id: 'MAINTENANCE_LIST' }],
    }),
    getAssetMaintenanceByIdMask: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { data: null }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/getAssetMaintenanceById/${pathId(idMask)}`,
        )
        if (result.error) {
          return result
        }
        return { data: mapMaintenanceListItem(result.data) }
      },
    }),
    saveAssetMaintenance: builder.mutation({
      async queryFn(body) {
        const result = await requestJson('/api/v1/asset-maintenance/saveAssetMaintenance', {
          method: 'POST',
          body: JSON.stringify(maintenanceFormToSaveRequest(body ?? {})),
        })
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: mapMaintenanceListItem(result.data) }
      },
      invalidatesTags: [
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_ASSETS' },
      ],
    }),
    approveAssetMaintenance: builder.mutation({
      async queryFn(idMask) {
        const result = await requestJson(
          `/api/v1/asset-maintenance/approveAssetMaintenance/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return result
        }
        return { data: mapMaintenanceListItem(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_ASSETS' },
        { type: 'Asset', id: 'MAINTENANCE_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    submitAssetMaintenance: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing maintenance id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/submitAssetMaintenance/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: mapMaintenanceListItem(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    forwardAssetMaintenance: builder.mutation({
      async queryFn({ idMask, toUserIdMask }) {
        if (!idMask || !toUserIdMask) {
          return { error: { status: 400, data: { message: 'Missing forward target' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/updateAssetMaintenanceForward/${pathId(idMask)}`,
          {
            method: 'POST',
            body: JSON.stringify({ toUserIdMask }),
          },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: result.data }
      },
      invalidatesTags: (_result, _error, { idMask }) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    verifyAssetMaintenance: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: { message: 'Missing maintenance id' } } }
        }
        const result = await requestJson(
          `/api/v1/asset-maintenance/updateAssetMaintenanceVerify/${pathId(idMask)}`,
          { method: 'POST' },
        )
        if (result.error) {
          return apiErrorToRtkError(result)
        }
        return { data: mapMaintenanceListItem(result.data) }
      },
      invalidatesTags: (_result, _error, idMask) => [
        { type: 'Asset', id: idMask },
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_WORKFLOW' },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
      ],
    }),
    getAssetMaintenanceForwardUserList: builder.query({
      async queryFn(idMask) {
        if (!idMask) {
          return { data: [] }
        }
        return requestJson(
          `/api/v1/asset-maintenance/getAssetMaintenanceForwardUserList/${pathId(idMask)}`,
        )
      },
    }),
    searchAssetMaintenanceWorkflow: builder.query({
      async queryFn({ status, search, page, pageSize, sortBy, sortDir }) {
        return searchAssetApprovalWorkflowQueryFn({
          approvalType: 'maintenance',
          status,
          search,
          page,
          pageSize,
          sortBy,
          sortDir,
        })
      },
      providesTags: (result, error, arg) => [
        { type: 'Asset', id: 'MAINTENANCE_WORKFLOW' },
        { type: 'Asset', id: `MAINTENANCE_WORKFLOW-${arg.status}` },
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
        { type: 'Asset', id: `ASSET_APPROVAL_WORKFLOW-maintenance-${arg.status}` },
      ],
      keepUnusedDataFor: 0,
    }),
    searchAssetApprovalWorkflow: builder.query({
      async queryFn(args) {
        return searchAssetApprovalWorkflowQueryFn(args ?? {})
      },
      providesTags: (result, error, arg) => [
        { type: 'Asset', id: 'ASSET_APPROVAL_WORKFLOW' },
        {
          type: 'Asset',
          id: `ASSET_APPROVAL_WORKFLOW-${arg.approvalType}-${arg.status}`,
        },
      ],
      keepUnusedDataFor: 0,
    }),
    deleteAssetMaintenance: builder.mutation({
      async queryFn(idMask) {
        if (!idMask) {
          return { error: { status: 400, data: 'Maintenance id is required.' } }
        }
        const deleteBody = JSON.stringify({ idMask, deleteDraft: true })
        let result = await requestJson('/api/v1/asset-maintenance/deleteAssetMaintenance', {
          method: 'POST',
          body: JSON.stringify({ idMask }),
        })
        if (result.error?.status === 404) {
          result = await requestJson(
            `/api/v1/asset-maintenance/deleteAssetMaintenance/${pathId(idMask)}`,
            { method: 'POST' },
          )
        }
        if (result.error?.status === 404) {
          result = await requestJson(
            '/api/v1/asset-maintenance/saveAssetMaintenance?deleteDraft=true',
            { method: 'POST', body: deleteBody },
          )
        }
        if (result.error) {
          return result
        }
        return { data: { ok: true } }
      },
      invalidatesTags: [
        { type: 'Asset', id: 'MAINTENANCE_LIST' },
        { type: 'Asset', id: 'MAINTENANCE_ASSETS' },
      ],
    }),

    getSalesCustomerList: builder.query({
      async queryFn() {
        const mockCustomers = [
          { id: 1, idMask: 'cust-1', partyName: 'National Infrastructure Ltd', gstin: '32AABCN1234F1Z5' },
          { id: 2, idMask: 'cust-2', partyName: 'Apex Engineering Corp', gstin: '32AACCA5678B1Z2' },
          { id: 3, idMask: 'cust-3', partyName: 'Kerala State Roadways', gstin: '32AAACG9988D1Z9' },
        ]
        return { data: mockCustomers }
      },
      providesTags: [{ type: 'Asset', id: 'SALES_CUSTOMERS' }],
    }),
  }),
})

export const {
  useGetSalesCustomerListQuery,
  useGetAssetModuleHealthQuery,
  useSearchFaGroupQuery,
  useGetFixedAssetGroupByIdQuery,
  useLazyGetFixedAssetGroupByIdQuery,
  useGetFixedAssetGroupListQuery,
  useGetAssetClassItListQuery,
  useGetFaGroupNumberingSetupListQuery,
  useSaveFaGroupMutation,
  useRemoveFaGroupMutation,
  useToggleFaGroupActiveMutation,
  useSearchAssetInformationQuery,
  useListAssetInformationCustodiansQuery,
  useListCostCentresQuery,
  useListDistinctAssetLocationsQuery,
  useListHsnCodesQuery,
  useGetAssetInformationByIdQuery,
  useLazyGetAssetInformationByIdQuery,
  useSaveAssetInformationMutation,
  useRemoveAssetInformationMutation,
  useApproveAssetInformationMutation,
  useSubmitAssetInformationMutation,
  useForwardAssetInformationMutation,
  useVerifyAssetInformationMutation,
  useGetAssetInformationForwardUserListQuery,
  useSearchAssetInformationWorkflowQuery,
  useSearchAssetApprovalWorkflowQuery,
  useUpdateApprovedAssetDescriptionMutation,
  useToggleAssetInformationActiveMutation,
  useListOpeningFixedAssetImportsQuery,
  useUploadOpeningFixedAssetMutation,
  useGetOpeningAssetDetailsByBaseIdQuery,
  useSubmitOpeningAssetDetailsMutation,
  useGetDepreciationProcessDefaultsQuery,
  useSearchDepreciationRunsQuery,
  useGetDepreciationListMutation,
  useProcessDepreciationRunMutation,
  useGetDepreciationHistoryQuery,
  useGetApprovedDepreciationLinesByAssetInformationQuery,
  useGetAssetDepreciationLineDetailQuery,
  useListDepreciationCategorySuggestionsQuery,
  useLazyListDepreciationCategorySuggestionsQuery,
  useGetDisposalProcessDefaultsQuery,
  useSearchAssetRetirementQuery,
  useGetDisposalPreviewListMutation,
  useProcessAssetDisposalMutation,
  useLazyGetAssetDisposalViewQuery,
  useLazyGetAssetDisposalForEditQuery,
  useUpdateAssetDisposalMutation,
  useApproveAssetDisposalMutation,
  useForwardAssetDisposalMutation,
  useVerifyAssetDisposalMutation,
  useGetAssetDisposalForwardUserListQuery,
  useSearchAssetDisposalWorkflowQuery,
  useDeleteAssetDisposalMutation,
  useListAssetsForAllocationQuery,
  useListAllocationCustodiansQuery,
  useGetAssetAllocationDetailQuery,
  useGetAssetAllocationHistoryQuery,
  useAllocateAssetMutation,
  useReturnAssetToStoreMutation,
  useListAssetsForMaintenanceQuery,
  useListMaintenanceVendorsQuery,
  useListMaintenancePurchaseInvoicesQuery,
  useGetPurchaseInvoiceJournalLinesQuery,
  useSearchAssetMaintenanceQuery,
  useGetAssetMaintenanceByIdMaskQuery,
  useLazyGetAssetMaintenanceByIdMaskQuery,
  useLazyGetSuggestedNextDueDateForAssetQuery,
  useSaveAssetMaintenanceMutation,
  useApproveAssetMaintenanceMutation,
  useSubmitAssetMaintenanceMutation,
  useForwardAssetMaintenanceMutation,
  useVerifyAssetMaintenanceMutation,
  useGetAssetMaintenanceForwardUserListQuery,
  useSearchAssetMaintenanceWorkflowQuery,
  useDeleteAssetMaintenanceMutation,
} = assetApi
