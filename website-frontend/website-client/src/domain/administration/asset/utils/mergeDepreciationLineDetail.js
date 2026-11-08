/** Prefer first non-empty string (API detail overrides history line context). */
function coalesceString(...values) {
  for (const value of values) {
    if (value != null && value !== '') {
      return value
    }
  }
  return ''
}

/**
 * Merge line-detail API payload with history row + run summary so metadata still shows
 * when detail endpoint is behind base view (e.g. stale asset-service).
 */
export function mergeDepreciationLineDetail(apiDetail, lineContext, runSummary) {
  if (!apiDetail && !lineContext) {
    return null
  }
  const merged = {
    ...(lineContext ?? {}),
    ...(apiDetail ?? {}),
  }
  return {
    ...merged,
    depreciationNumber: coalesceString(
      apiDetail?.depreciationNumber,
      lineContext?.depreciationNumber,
    ),
    financialYear: coalesceString(apiDetail?.financialYear, lineContext?.financialYear),
    depreciationMethod: coalesceString(
      apiDetail?.depreciationMethod,
      lineContext?.depreciationMethod,
    ),
    depreciationMethodLabel: coalesceString(
      apiDetail?.depreciationMethodLabel,
      lineContext?.depreciationMethodLabel,
    ),
    depreciationRateIt:
      apiDetail?.depreciationRateIt ?? lineContext?.depreciationRateIt ?? null,
    depreciationStartDate: coalesceString(
      apiDetail?.depreciationStartDate,
      lineContext?.depreciationStartDate,
    ),
    depreciationDate: coalesceString(
      apiDetail?.depreciationDate,
      lineContext?.depreciationDate,
      runSummary?.depreciationDate,
    ),
    processUpto: coalesceString(
      apiDetail?.processUpto,
      lineContext?.processUpto,
      runSummary?.processUpTo,
    ),
    approvedOn: coalesceString(apiDetail?.approvedOn, lineContext?.approvedOn),
    approvedByName: coalesceString(
      apiDetail?.approvedByName,
      lineContext?.approvedByName,
    ),
    putToUseDate: coalesceString(apiDetail?.putToUseDate, lineContext?.putToUseDate),
    assetAge: coalesceString(apiDetail?.assetAge, lineContext?.assetAge),
    depreciatedValue:
      apiDetail?.depreciatedValue ?? lineContext?.amount ?? merged.amount ?? null,
    journalLines: apiDetail?.journalLines ?? [],
  }
}
