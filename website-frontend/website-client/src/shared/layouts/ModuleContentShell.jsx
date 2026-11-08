import { Card, CardBody } from '@/shared/lib/tailwreck'
import {
  MODULE_CARD_CLASS,
  MODULE_MAIN_INNER_CLASS,
  MODULE_PAGE_BODY_CLASS,
} from '@/shared/constants/moduleContentStyles'

/**
 * Org UI page shell — card grows with content; <main> scrolls (see MODULE_MAIN_CLASS).
 */
export function ModuleContentShell({
  children,
  bodyClassName = MODULE_PAGE_BODY_CLASS,
  header = null,
}) {
  return (
    <div className={MODULE_MAIN_INNER_CLASS}>
      <Card theme="no-preset" shadow="none" className={MODULE_CARD_CLASS}>
        {header}
        <CardBody theme="no-preset" className={bodyClassName}>
          {children}
        </CardBody>
      </Card>
    </div>
  )
}

export default ModuleContentShell
