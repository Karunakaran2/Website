import { validatePositiveDecimalAmount } from './probityFormat'

/**
 * Shared React Hook Form rules for common Indian / org field formats.
 * Map by field name (see {@link getFieldFormatKey}) so the same rules apply everywhere.
 */

export const FIELD_FORMAT = {
  pan: {
    value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    message: 'PAN must be in the format ABCDE1234F.',
  },
  tan: {
    value: /^[A-Z]{4}[0-9]{5}[A-Z]$/,
    message: 'TAN must be in the format ABCD12345E.',
  },
  gstin: {
    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    message: 'GSTIN format is invalid.',
  },
  pincode: {
    value: /^[0-9]{6}$/,
    message: 'Pincode must be a 6-digit number.',
  },
  mobile: {
    value: /^[6-9][0-9]{9}$/,
    message: 'Mobile number must be a 10-digit number starting with 6–9.',
  },
  phone: {
    value: /^[0-9]{10,15}$/,
    message: 'Phone number must contain 10 to 15 digits.',
  },
  email: {
    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    message: 'Email address format is invalid.',
  },
  ifsc: {
    value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: 'IFSC must be in the format XXXX0YYYYYY.',
  },
  accountNumber: {
    value: /^[A-Za-z0-9-]{6,34}$/,
    message: 'Account number must contain 6 to 34 letters, numbers, or hyphens.',
  },
  bankAccountNumber: {
    value: /^[0-9]{8,18}$/,
    message: 'Account number must be 8 to 18 digits.',
  },
  bankName: {
    value: /^[a-zA-Z0-9\s]+$/,
    message: 'Invalid characters in bank name.',
  },
  aadhaar: {
    value: /^[0-9]{12}$/,
    message: 'Aadhaar must be a 12-digit number.',
  },
}

/** @deprecated use FIELD_FORMAT.ifsc.value */
export const IFSC_PATTERN = FIELD_FORMAT.ifsc.value

const UPPERCASE_FORMAT_KEYS = new Set(['pan', 'tan', 'gstin', 'ifsc'])

/** Field name (last segment of path) → format key in {@link FIELD_FORMAT}. */
const NAME_TO_FORMAT = {
  panNo: 'pan',
  panNumber: 'pan',
  tanNumber: 'tan',
  gstin: 'gstin',
  gstNumber: 'gstin',
  gstinNo: 'gstin',
  pincode: 'pincode',
  mobile: 'mobile',
  mobileNo: 'mobile',
  mobileNumber: 'mobile',
  contactNumber: 'mobile',
  phoneNo: 'phone',
  phnNo: 'phone',
  mailId: 'email',
  emailId: 'email',
  email: 'email',
  ifsc: 'ifsc',
  ifscCode: 'ifsc',
  ifscNo: 'ifsc',
  ifscCode: 'ifsc',
  accountNumber: 'accountNumber',
  bankName: 'bankName',
  aadhaar: 'aadhaar',
  aadhar: 'aadhaar',
  aadhaarNumber: 'aadhaar',
  aadharNumber: 'aadhaar',
}

export function getFieldFormatKey(fieldName) {
  if (fieldName == null || fieldName === '') {
    return null
  }
  const base = String(fieldName).split('.').pop()
  return NAME_TO_FORMAT[base] ?? null
}

function normalizeForFormat(value, formatKey) {
  let text = String(value ?? '').trim()
  if (formatKey === 'aadhaar') {
    text = text.replace(/\s+/g, '')
  }
  if (UPPERCASE_FORMAT_KEYS.has(formatKey)) {
    text = text.toUpperCase()
  }
  return text
}

function attachFormatRules(rules, formatKey, { required }) {
  const pattern = FIELD_FORMAT[formatKey]
  if (!pattern) {
    return rules
  }

  if (required) {
    rules.pattern = pattern
  } else {
    const priorValidate = rules.validate
    rules.validate = (value, formValues) => {
      if (typeof priorValidate === 'function') {
        const prior = priorValidate(value, formValues)
        if (prior !== true) {
          return prior
        }
      }
      const normalized = normalizeForFormat(value, formatKey)
      if (!normalized) {
        return true
      }
      return pattern.value.test(normalized) || pattern.message
    }
  }

  if (UPPERCASE_FORMAT_KEYS.has(formatKey)) {
    const priorSetValueAs = rules.setValueAs
    rules.setValueAs = (value) => {
      const next = priorSetValueAs ? priorSetValueAs(value) : value
      return typeof next === 'string' ? next.toUpperCase() : next
    }
  }

  if (formatKey === 'aadhaar') {
    const priorSetValueAs = rules.setValueAs
    rules.setValueAs = (value) => {
      const next = priorSetValueAs ? priorSetValueAs(value) : value
      return typeof next === 'string' ? next.replace(/\s+/g, '') : next
    }
  }

  return rules
}

/**
 * RHF register / rules object for a field name and label.
 * @param {string} fieldName — plain or nested (`gstAddressEntries.0.pincode`)
 */
export function probityFieldRules(
  fieldName,
  {
    required = false,
    label = 'This field',
    fieldType = 'text',
    formatKey: formatKeyOverride = null,
  } = {},
) {
  const rules = {}

  if (required && fieldType !== 'checkbox' && fieldType !== 'amount') {
    rules.required =
      fieldType === 'select' ? `Please select ${label}.` : `Please enter ${label}.`
  }

  if (fieldType === 'amount') {
    rules.validate = (value) => {
      const message = validatePositiveDecimalAmount(value, { required, fieldLabel: label })
      return message || true
    }
  }

  const formatKey = formatKeyOverride ?? getFieldFormatKey(fieldName)
  if (formatKey) {
    attachFormatRules(rules, formatKey, { required })
  }

  if (fieldType === 'text' || fieldType === 'textarea') {
    const maxLength = resolveFieldMaxLength(fieldName, { multiline: fieldType === 'textarea' })
    if (maxLength) {
      rules.maxLength = {
        value: maxLength,
        message: `${label} must not exceed ${maxLength} characters.`,
      }
    }
  }

  return rules
}

/** Shorthand: pattern rule only (Party address rows with explicit required message). */
export function fieldPatternRule(fieldName) {
  const formatKey = getFieldFormatKey(fieldName)
  if (!formatKey) {
    return undefined
  }
  return FIELD_FORMAT[formatKey]
}

/** GSTIN characters at index 2–11 must match PAN when both are present. */
export function validateGstinMatchesPan(panNo, gstinNo) {
  const pan = String(panNo ?? '').trim().toUpperCase()
  const gstin = String(gstinNo ?? '').trim().toUpperCase()
  if (!pan || !gstin || gstin.length < 12) {
    return true
  }
  return gstin.slice(2, 12) === pan
    ? true
    : 'GSTIN does not match the provided PAN.'
}

/** Exact character caps. Native `maxLength` stops further typing. */
export const FIELD_MAX_LENGTH = {
  pan: 10,
  tan: 10,
  gstin: 15,
  pincode: 6,
  mobile: 10,
  phone: 15,
  email: 100,
  ifsc: 11,
  accountNumber: 34,
  bankAccountNumber: 18,
  bankName: 100,
  aadhaar: 12,
}

const NAME_MAX_LENGTH = {
  narration: 500,
  journalNarration: 500,
  remarks: 500,
  remark: 500,
  description: 500,
  notes: 500,
  note: 500,
  comments: 500,
  comment: 500,
  reason: 500,
  address: 255,
  addressLine1: 255,
  addressLine2: 255,
  name: 150,
  partyName: 150,
  code: 50,
  shortName: 50,
  documentNo: 50,
  documentNumber: 50,
  invoiceNo: 50,
  invoiceNumber: 50,
  referenceNo: 50,
  referenceNumber: 50,
  search: 100,
}

const UNLIMITED_INPUT_TYPES = new Set([
  'number',
  'date',
  'datetime-local',
  'time',
  'month',
  'week',
  'color',
  'range',
  'file',
  'checkbox',
  'radio',
  'hidden',
])

export const DEFAULT_TEXT_MAX_LENGTH = 255
export const DEFAULT_TEXTAREA_MAX_LENGTH = 500
export const AMOUNT_INPUT_MAX_LENGTH = 20

/**
 * Character cap for a control. Explicit `maxLength` wins. Dates and numbers are uncapped.
 * Unknown text fields fall back to 255; textareas fall back to 500.
 */
export function resolveFieldMaxLength(fieldName, { type = 'text', multiline = false, explicit } = {}) {
  if (explicit != null && explicit !== '') {
    const parsed = Number(explicit)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }
  if (UNLIMITED_INPUT_TYPES.has(String(type || 'text').toLowerCase())) {
    return undefined
  }
  const formatKey = getFieldFormatKey(fieldName)
  if (formatKey && FIELD_MAX_LENGTH[formatKey]) {
    return FIELD_MAX_LENGTH[formatKey]
  }
  const base = String(fieldName || '').split('.').pop()
  if (base && NAME_MAX_LENGTH[base] != null) {
    return NAME_MAX_LENGTH[base]
  }
  const lower = base.toLowerCase()
  if (
    lower.endsWith('narration')
    || lower.endsWith('remarks')
    || lower.endsWith('description')
    || lower.endsWith('comments')
  ) {
    return 500
  }
  if (lower.endsWith('name')) return 150
  if (lower.endsWith('code') || lower.endsWith('no') || lower.endsWith('number')) return 50
  if (lower.endsWith('email') || lower.endsWith('mailid')) return 100
  return multiline ? DEFAULT_TEXTAREA_MAX_LENGTH : DEFAULT_TEXT_MAX_LENGTH
}

export function fieldUsesUppercaseClass(fieldName) {
  const formatKey = getFieldFormatKey(fieldName)
  return formatKey != null && UPPERCASE_FORMAT_KEYS.has(formatKey)
}

/** Merge shared format rules with explicit RHF rules (explicit wins on conflict). */
export function mergeProbityFieldRules(fieldName, options = {}, extraRules = {}) {
  return { ...probityFieldRules(fieldName, options), ...extraRules }
}

/** Statutory payment: GSTIN vs TAN on `gstOrTanNumber`. */
export function statutoryTaxNumberRules(
  taxType,
  { required = false, requiredMessage, label = 'Tax number' } = {},
) {
  const alias = String(taxType || '').trim().toUpperCase() === 'GST' ? 'gstNumber' : 'tanNumber'
  const rules = probityFieldRules(alias, { required, label })
  if (required && requiredMessage) {
    rules.required = requiredMessage
  }
  return rules
}

/** RHF `rules` for Controller / OrgSelectField / OrgTextField (merges with caller `rules`). */
export function resolveProbityRules(name, { required = false, label, fieldType = 'text', rules } = {}) {
  if (!name) {
    return rules
  }
  const base = probityFieldRules(name, { required, label, fieldType })
  return rules ? { ...base, ...rules } : base
}
