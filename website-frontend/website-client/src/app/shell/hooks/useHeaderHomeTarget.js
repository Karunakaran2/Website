import { ROUTES } from '@/shared/constants'

/**
 * Header Home / logo target:
 * Always returns ROUTES.HOME (/home) as the central module landing.
 */
export function useHeaderHomeTarget() {
  return ROUTES.HOME
}
