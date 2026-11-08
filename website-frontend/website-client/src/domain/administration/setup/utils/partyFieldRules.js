import { mergeProbityFieldRules, probityFieldRules } from '@/shared/utils'
import { validateGstinMatchesPan } from '@/shared/utils/fieldValidationRules'

function trim(value) {
  return String(value ?? '').trim()
}

function startsWithLetterOrDigit(value) {
  const text = trim(value)
  if (!text) {
    return true
  }
  return /^[a-zA-Z0-9]/.test(text)
}

function startsWithLetter(value) {
  const text = trim(value)
  if (!text) {
    return true
  }
  return /^[a-zA-Z]/.test(text)
}

const PARTY_ADDRESS_FIELD_RULES = {
  firstLocation: {
    validate: (value) => (
      startsWithLetterOrDigit(value) || 'Location cannot start with a special character.'
    ),
  },
  secondLocation: {
    validate: (value) => (
      startsWithLetterOrDigit(value) || 'Location cannot start with a special character.'
    ),
  },
  city: {
    validate: (value) => (startsWithLetter(value) || 'City name must start with a letter.'),
  },
  state: {
    validate: (value) => (startsWithLetter(value) || 'State name must start with a letter.'),
  },
  authorizedPersonName: {
    validate: (value) => (
      startsWithLetter(value) || 'Authorized person name must start with a letter.'
    ),
  },
  authorizedPersonDesignation: {
    validate: (value) => (
      startsWithLetter(value) || 'Authorized person designation must start with a letter.'
    ),
  },
}

export function partyAddressFieldRules(fieldName, { required = false, label = 'This field' } = {}) {
  const extra = PARTY_ADDRESS_FIELD_RULES[fieldName]
  if (!extra) {
    return probityFieldRules(fieldName, { required, label })
  }
  return mergeProbityFieldRules(fieldName, { required, label }, extra)
}

export function partyAddressGstinRules(partyPanNo) {
  const base = probityFieldRules('gstinNo', { label: 'GSTIN' })
  return {
    ...base,
    validate: (value) => {
      if (typeof base.validate === 'function') {
        const formatResult = base.validate(value)
        if (formatResult !== true) {
          return formatResult
        }
      }
      const gstinPanError = validateGstinMatchesPan(partyPanNo, value)
      return gstinPanError === true ? true : gstinPanError
    },
  }
}

export function partyBankAutocomplete(fieldName) {
  if (fieldName === 'accountNumber') {
    return 'off'
  }
  return 'off'
}

/** Extra attributes so browsers/password managers do not autofill party bank account number. */
export function partyBankAccountNumberInputProps() {
  return {
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: false,
    'data-1p-ignore': 'true',
    'data-bwignore': 'true',
    'data-lpignore': 'true',
    'data-form-type': 'other',
  }
}

function trimValue(value) {
  return value == null ? '' : String(value).trim()
}

export function partyBankNameRules({ required = false } = {}) {
  return mergeProbityFieldRules(
    'bankName',
    { required, label: 'Bank name' },
    {
      validate: (value) => {
        const text = trimValue(value)
        if (!text) {
          return required ? 'Please enter bank name.' : true
        }
        return /^[a-zA-Z]/.test(text) || 'Bank name must start with a letter.'
      },
    },
  )
}

/** When any bank field is filled, all bank fields must be valid (avoids autofill-only partial rows). */
export function validatePartyBankRows(bankAccountEntries, setError) {
  if (!Array.isArray(bankAccountEntries)) {
    return true
  }
  let valid = true
  bankAccountEntries.forEach((entry, index) => {
    const bankName = trimValue(entry?.bankName)
    const accountNumber = trimValue(entry?.accountNumber).replace(/\D/g, '')
    const accountName = trimValue(entry?.accountName)
    const ifscCode = trimValue(entry?.ifscCode).toUpperCase()
    const started = bankName || accountNumber || accountName || ifscCode
    if (!started) {
      return
    }
    if (!bankName) {
      setError(`bankAccountEntries.${index}.bankName`, {
        type: 'required',
        message: 'Please enter bank name.',
      })
      valid = false
    } else if (!/^[a-zA-Z]/.test(bankName)) {
      setError(`bankAccountEntries.${index}.bankName`, {
        type: 'pattern',
        message: 'Bank name must start with a letter.',
      })
      valid = false
    }
    if (!accountNumber) {
      setError(`bankAccountEntries.${index}.accountNumber`, {
        type: 'required',
        message: 'Please enter account number.',
      })
      valid = false
    } else if (!/^[0-9]{8,18}$/.test(accountNumber)) {
      setError(`bankAccountEntries.${index}.accountNumber`, {
        type: 'pattern',
        message: 'Account number must be 8 to 18 digits.',
      })
      valid = false
    }
    if (!accountName) {
      setError(`bankAccountEntries.${index}.accountName`, {
        type: 'required',
        message: 'Please enter account name.',
      })
      valid = false
    }
    if (!ifscCode) {
      setError(`bankAccountEntries.${index}.ifscCode`, {
        type: 'required',
        message: 'Please enter IFSC code.',
      })
      valid = false
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setError(`bankAccountEntries.${index}.ifscCode`, {
        type: 'pattern',
        message: 'IFSC must be in the format XXXX0YYYYYY.',
      })
      valid = false
    }
  })
  return valid
}
