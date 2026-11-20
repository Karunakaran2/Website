/** Matches engagement-service `ContactRequest` (`requestType`: G | B | D | T | E | C). */
export const CONTACT_REQUEST_TYPES = {
  GENERAL: 'G',
  BUSINESS: 'B',
  DEMO: 'D',
  TECHNICAL: 'T',
  EMPLOYMENT: 'E',
  CAREERS: 'C',
}

/**
 * @typedef {Object} ContactSubmitBody
 * @property {string} name
 * @property {string} email
 * @property {string} mobile
 * @property {string} [organization]
 * @property {string} [remarks]
 * @property {string} requestType
 * @property {string} [productName]
 */