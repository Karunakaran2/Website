/**
 * Client-side disposal journal line amounts (probity-2.0 parity for edit preview).
 */
const CANONICAL_SLOTS = ['accum', 'gainLoss', 'asset', 'saleScrap']
const ACC_DEP_SUFFIX = 'ACC DEP ACCOUNT'
/** Legacy Cum/Acc Dep Account and new ACC DEP ACCOUNT HOA suffixes. */
const ACC_DEP_SUFFIX_PATTERN = /(?:(?:Cum|Acc) Dep Account|ACC DEP ACCOUNT)$/i
const SCRAP_SUFFIX = 'Scrap Account'
const SALE_SUFFIX = 'Fixed Asset Sale Account'

function isSaleRetirementType(retirementType) {
  const value = String(retirementType ?? '').trim()
  return value === 'Sale' || value === 'S'
}

function inferAccountPrefix(journalLines) {
  for (const line of journalLines ?? []) {
    const label = line?.hoaName
    if (!label || label === '—') {
      continue
    }
    const assetMatch = label.match(/^(.+?)[\s-]+Asset Account$/i)
    if (assetMatch?.[1]) {
      return assetMatch[1].trim()
    }
    const cumMatch = label.match(new RegExp(`^(.+?)[\\s-]+${ACC_DEP_SUFFIX_PATTERN.source}`, 'i'))
    if (cumMatch?.[1]) {
      return cumMatch[1].trim()
    }
    const dash = label.indexOf('-')
    if (dash > 0) {
      return label.slice(0, dash).trim()
    }
  }
  return null
}

function inferCumDepAccountName(journalLines) {
  for (const line of journalLines ?? []) {
    const label = line?.hoaName
    if (!label || label === '—') {
      continue
    }
    const upper = label.toUpperCase()
    if (upper.includes('ACCUM') || upper.includes('CUM DEP') || upper.includes('ACC DEP')) {
      return label
    }
  }
  const prefix = inferAccountPrefix(journalLines)
  return prefix ? `${prefix}-${ACC_DEP_SUFFIX}` : null
}

function inferSaleScrapAccountName(journalLines, retirementType) {
  for (const line of journalLines ?? []) {
    const label = line?.hoaName
    if (!label || label === '—') {
      continue
    }
    const upper = label.toUpperCase()
    if (upper.includes('SCRAP')) {
      return label
    }
    if (upper.includes('FIXED ASSET SALE') || (upper.includes('SALE') && !upper.includes('GAIN'))) {
      return label
    }
  }
  const prefix = inferAccountPrefix(journalLines)
  if (!prefix) {
    return null
  }
  return `${prefix}-${isSaleRetirementType(retirementType) ? SALE_SUFFIX : SCRAP_SUFFIX}`
}

function applyMissingNameInferences(names, journalLines, retirementType) {
  if (names.accum === '—') {
    const inferred = inferCumDepAccountName(journalLines)
    if (inferred) {
      names.accum = inferred
    }
  }
  if (names.saleScrap === '—') {
    const inferred = inferSaleScrapAccountName(journalLines, retirementType)
    if (inferred) {
      names.saleScrap = inferred
    }
  }
  return names
}

function resolveHoaNames(journalLines, retirementType) {
  const names = { accum: '—', gainLoss: '—', asset: '—', saleScrap: '—' }
  if (!journalLines?.length) {
    return names
  }

  if (journalLines.length >= 4) {
    CANONICAL_SLOTS.forEach((slot, index) => {
      const label = journalLines[index]?.hoaName
      if (label && label !== '—') {
        names[slot] = label
      }
    })
    return applyMissingNameInferences(names, journalLines, retirementType)
  }

  for (const line of journalLines) {
    const label = line?.hoaName
    if (!label || label === '—') {
      continue
    }
    const upper = label.toUpperCase()
    if (
      upper.includes('ACCUM')
      || upper.includes('DEPRECIATION')
      || upper.includes('CUM DEP')
      || upper.includes('ACC DEP')
    ) {
      names.accum = label
    } else if (upper.includes('GAIN') || upper.includes('LOSS')) {
      names.gainLoss = label
    } else if (upper.includes('ASSET') && !upper.includes('SALE')) {
      names.asset = label
    } else if (upper.includes('SCRAP') || upper.includes('SALE')) {
      names.saleScrap = label
    }
  }
  return applyMissingNameInferences(names, journalLines, retirementType)
}

export function buildDisposalJournalPreviewLines({
  assetCost = 0,
  bookValue = 0,
  saleValue = 0,
  retirementType = 'Sale',
  journalLines = [],
}) {
  const cost = Number(assetCost) || 0
  const book = Number(bookValue) || 0
  const sale = Number(saleValue) || 0

  const names = resolveHoaNames(journalLines, retirementType)

  const rawAccum = cost - book
  let accumEntry
  if (rawAccum >= 0) {
    accumEntry = { entryType: 'DR', hoaName: names.accum, amount: rawAccum }
  } else {
    accumEntry = { entryType: 'CR', hoaName: names.accum, amount: Math.abs(rawAccum) }
  }

  let gainLossEntry
  if (sale > book) {
    gainLossEntry = { entryType: 'CR', hoaName: names.gainLoss, amount: sale - book }
  } else {
    gainLossEntry = { entryType: 'DR', hoaName: names.gainLoss, amount: book - sale }
  }

  const assetEntry = { entryType: 'CR', hoaName: names.asset, amount: cost }
  const saleScrapEntry = { entryType: 'DR', hoaName: names.saleScrap, amount: sale }

  return [accumEntry, gainLossEntry, assetEntry, saleScrapEntry]
}
