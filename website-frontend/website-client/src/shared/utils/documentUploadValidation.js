export const DOCUMENT_UPLOAD_ACCEPT = '.jpg,.jpeg,.png,.pdf,.doc,.docx'

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png']
export const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx']
export const ALLOWED_UPLOAD_EXTENSIONS = [...IMAGE_EXTENSIONS, ...DOCUMENT_EXTENSIONS]

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

export const UPLOAD_VALIDATION_MESSAGES = {
  onlyImages: 'Only JPG, JPEG and PNG images are allowed.',
  imageTooLarge: 'Image file size must not exceed 5 MB.',
  onlyDocuments: 'Only PDF, DOC and DOCX files are allowed.',
  documentTooLarge: 'Document file size must not exceed 10 MB.',
  corrupted: 'The uploaded file is corrupted or invalid.',
  typeMismatch: 'The uploaded file type does not match its content.',
  malicious: 'Invalid or potentially malicious file detected.',
  invalidFilename: 'Invalid filename or double extension detected.',
}

const IMAGE_LIKE_EXTENSIONS = new Set([
  ...IMAGE_EXTENSIONS,
  'gif',
  'bmp',
  'webp',
  'tif',
  'tiff',
  'svg',
])

const DANGEROUS_OR_KNOWN_EXTENSIONS = new Set([
  'exe',
  'php',
  'js',
  'mjs',
  'cjs',
  'sh',
  'bat',
  'cmd',
  'com',
  'scr',
  'jar',
  'html',
  'htm',
  'svg',
  'jsp',
  'asp',
  'aspx',
  'cgi',
  'pl',
  'py',
  'rb',
  'dll',
  'pif',
  'vbs',
  'vbe',
  'wsf',
  'wsh',
  'ps1',
  'msi',
  'apk',
  ...ALLOWED_UPLOAD_EXTENSIONS,
  'gif',
  'xls',
  'xlsx',
  'txt',
  'zip',
  'rar',
  '7z',
])

const ALLOWED = new Set(ALLOWED_UPLOAD_EXTENSIONS)

function basename(fileName) {
  const trimmed = String(fileName || '').trim().replace(/\\/g, '/')
  const slash = trimmed.lastIndexOf('/')
  return slash >= 0 ? trimmed.slice(slash + 1) : trimmed
}

function extensionOf(fileName) {
  const name = basename(fileName)
  const dot = name.lastIndexOf('.')
  if (dot <= 0 || dot === name.length - 1) {
    return ''
  }
  return name.slice(dot + 1).toLowerCase()
}

function hasControlOrPathChars(value) {
  if (!value) return true
  if (value.includes('..') || value.includes('/') || value.includes('\\') || value.includes('\0')) {
    return true
  }
  return [...value].some((char) => char.charCodeAt(0) < 32)
}

function hasWindowsDrivePrefix(value) {
  return /^[A-Za-z]:/.test(value)
}

function hasStackedExtension(name) {
  const tokens = name.toLowerCase().split('.')
  if (tokens.length < 3) {
    return false
  }
  for (let i = 1; i < tokens.length - 1; i += 1) {
    if (DANGEROUS_OR_KNOWN_EXTENSIONS.has(tokens[i])) {
      return true
    }
  }
  const last = tokens[tokens.length - 1]
  return DANGEROUS_OR_KNOWN_EXTENSIONS.has(last) && !ALLOWED.has(last)
}

export function validateDocumentUploadFile(file) {
  if (!file) {
    return UPLOAD_VALIDATION_MESSAGES.corrupted
  }
  const originalName = file.name || ''
  if (!originalName.trim()) {
    return UPLOAD_VALIDATION_MESSAGES.invalidFilename
  }
  if (hasControlOrPathChars(originalName) || hasWindowsDrivePrefix(originalName.trim())) {
    return UPLOAD_VALIDATION_MESSAGES.invalidFilename
  }
  const name = basename(originalName)
  if (!name || hasControlOrPathChars(name) || name.startsWith('.')) {
    return UPLOAD_VALIDATION_MESSAGES.invalidFilename
  }
  if (hasStackedExtension(name)) {
    return UPLOAD_VALIDATION_MESSAGES.invalidFilename
  }
  const extension = extensionOf(name)
  if (!extension) {
    return UPLOAD_VALIDATION_MESSAGES.invalidFilename
  }
  if (!ALLOWED.has(extension)) {
    return IMAGE_LIKE_EXTENSIONS.has(extension)
      ? UPLOAD_VALIDATION_MESSAGES.onlyImages
      : UPLOAD_VALIDATION_MESSAGES.onlyDocuments
  }
  const size = Number(file.size) || 0
  if (size <= 0) {
    return UPLOAD_VALIDATION_MESSAGES.corrupted
  }
  if (IMAGE_EXTENSIONS.includes(extension) && size > MAX_IMAGE_BYTES) {
    return UPLOAD_VALIDATION_MESSAGES.imageTooLarge
  }
  if (DOCUMENT_EXTENSIONS.includes(extension) && size > MAX_DOCUMENT_BYTES) {
    return UPLOAD_VALIDATION_MESSAGES.documentTooLarge
  }
  const declaredType = String(file.type || '')
    .split(';', 1)[0]
    .trim()
    .toLowerCase()
  const expected = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }[extension]
  if (
    declaredType &&
    (declaredType === 'application/octet-stream' || (expected && declaredType !== expected))
  ) {
    return UPLOAD_VALIDATION_MESSAGES.typeMismatch
  }
  return ''
}

export function validateDocumentUploadFiles(files) {
  for (const file of files || []) {
    const message = validateDocumentUploadFile(file)
    if (message) {
      return message
    }
  }
  return ''
}
