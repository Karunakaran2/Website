import { assetPages } from '../asset/routes'
import { setupPages } from '../setup/routes'

/**
 * Consolidated Administration Domain Pages:
 * Asset Management and Setup Configuration.
 */
export const administrationPages = {
  ...assetPages,
  ...setupPages,
}

export { assetPages, setupPages }
