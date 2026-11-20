/**
 * @typedef {Object} NewsUpsertBody
 * @property {string} title
 * @property {string} [newsDescription]
 * @property {string} [publishDate] ISO-8601 instant
 * @property {string} [imagePath]
 * @property {string} [newsLink]
 * @property {string} [activeStatus]
 */

export const NEWS_ACTIVE_STATUS = {
  YES: 'Y',
  NO: 'N',
}