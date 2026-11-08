import { describe, expect, it } from 'vitest'
import {
  DOCUMENT_UPLOAD_ACCEPT,
  UPLOAD_VALIDATION_MESSAGES,
  validateDocumentUploadFile,
  validateDocumentUploadFiles,
} from './documentUploadValidation'

function file(name, size = 10, type = '') {
  return { name, size, type }
}

describe('documentUploadValidation', () => {
  it('exports the document accept list', () => {
    expect(DOCUMENT_UPLOAD_ACCEPT).toBe('.jpg,.jpeg,.png,.pdf,.doc,.docx')
  })

  it('accepts allowed types within size limits', () => {
    expect(validateDocumentUploadFile(file('a.jpg', 100, 'image/jpeg'))).toBe('')
    expect(validateDocumentUploadFile(file('a.jpeg', 100, 'image/jpeg'))).toBe('')
    expect(validateDocumentUploadFile(file('a.png', 100, 'image/png'))).toBe('')
    expect(validateDocumentUploadFile(file('a.pdf', 100, 'application/pdf'))).toBe('')
    expect(validateDocumentUploadFile(file('a.doc', 100, 'application/msword'))).toBe('')
    expect(
      validateDocumentUploadFile(
        file(
          'a.docx',
          100,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ),
      ),
    ).toBe('')
  })

  it('rejects oversize, empty, path, double extension, and unsupported types', () => {
    expect(validateDocumentUploadFile(file('a.jpg', 5 * 1024 * 1024 + 1, 'image/jpeg'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.imageTooLarge,
    )
    expect(validateDocumentUploadFile(file('a.pdf', 10 * 1024 * 1024 + 1, 'application/pdf'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.documentTooLarge,
    )
    expect(validateDocumentUploadFile(file('a.pdf', 0, 'application/pdf'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.corrupted,
    )
    expect(validateDocumentUploadFile(file('../../file.pdf', 10, 'application/pdf'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.invalidFilename,
    )
    expect(validateDocumentUploadFile(file('document.pdf.exe', 10, 'application/pdf'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.invalidFilename,
    )
    expect(validateDocumentUploadFile(file('malware.exe.pdf', 10, 'application/pdf'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.invalidFilename,
    )
    expect(validateDocumentUploadFile(file('notes.exe', 10))).toBe(
      UPLOAD_VALIDATION_MESSAGES.onlyDocuments,
    )
    expect(validateDocumentUploadFile(file('pic.gif', 10, 'image/gif'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.onlyImages,
    )
    expect(validateDocumentUploadFile(file('a.pdf', 10, 'image/png'))).toBe(
      UPLOAD_VALIDATION_MESSAGES.typeMismatch,
    )
  })

  it('validates a file list', () => {
    expect(validateDocumentUploadFiles([file('ok.pdf', 10, 'application/pdf')])).toBe('')
    expect(validateDocumentUploadFiles([file('bad.exe', 10)])).toBe(
      UPLOAD_VALIDATION_MESSAGES.onlyDocuments,
    )
  })
})
