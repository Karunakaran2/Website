/**
 * Compares shared UI component files under src/shared/components with
 * workbenchComponentRegistry.js entries. Run: npm run audit:workbench
 */
import { auditSharedComponentCoverage } from '../src/domain/component-workbench/catalogue/auditCatalogCoverage.js'

const report = auditSharedComponentCoverage()

console.log('KRAN Workbench catalog audit')
console.log('—'.repeat(40))
console.log(`Shared .jsx files (excl. tests): ${report.totalJsx}`)
console.log(`Referenced in registry:           ${report.listedCount}`)
console.log(`Not referenced in registry:       ${report.unlistedCount}`)
console.log('')
if (report.unlisted.length) {
  console.log('Unlisted shared JSX (candidates for catalogue / demos):')
  for (const rel of report.unlisted) {
    console.log(`  - ${rel}`)
  }
}

process.exitCode = 0
