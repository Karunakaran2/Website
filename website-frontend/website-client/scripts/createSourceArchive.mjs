import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'
import {
  contentLooksSensitive,
  isAllowedArchivePath,
  shouldExcludeArchiveEntry,
} from './sourceArchivePolicy.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = path.resolve(scriptDir, '..')

async function walkFiles(dir, baseDir, out) {
  const entries = await fsp.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const abs = path.join(dir, entry.name)
    const rel = path.relative(baseDir, abs).replace(/\\/g, '/')
    if (shouldExcludeArchiveEntry(rel)) continue

    if (entry.isDirectory()) {
      await walkFiles(abs, baseDir, out)
      continue
    }

    if (!isAllowedArchivePath(rel)) continue
    out.push({ abs, rel })
  }
}

async function collectArchiveFiles() {
  const files = []

  for (const name of fs.readdirSync(REPO_ROOT)) {
    const rel = name.replace(/\\/g, '/')
    const abs = path.join(REPO_ROOT, name)
    const stat = fs.statSync(abs)
    if (stat.isDirectory()) {
      if (!['src', 'docs', 'public', 'scripts', 'tailwreck', '.cursor'].includes(name)) continue
      await walkFiles(abs, REPO_ROOT, files)
      continue
    }
    if (isAllowedArchivePath(rel)) {
      files.push({ abs, rel })
    }
  }

  return files.sort((a, b) => a.rel.localeCompare(b.rel))
}

/**
 * @param {string} outputPath absolute path for .zip
 * @returns {Promise<{ fileCount: number, outputPath: string, skippedSensitive: string[] }>}
 */
export async function createSourceArchive(outputPath) {
  const files = await collectArchiveFiles()
  const skippedSensitive = []

  await fsp.mkdir(path.dirname(outputPath), { recursive: true })

  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  const done = new Promise((resolve, reject) => {
    output.on('close', resolve)
    archive.on('error', reject)
    output.on('error', reject)
  })

  archive.pipe(output)

  let fileCount = 0
  for (const { abs, rel } of files) {
    const buf = await fsp.readFile(abs)
    const scanContent =
      !/\.(test|spec)\.(js|jsx|mjs|cjs)$/i.test(rel)
      && /\.(env|pem|key|pfx|p12|credentials)$/i.test(rel)
    if (scanContent) {
      const sample = buf.subarray(0, Math.min(buf.length, 8192)).toString('utf8')
      if (contentLooksSensitive(sample)) {
        skippedSensitive.push(rel)
        continue
      }
    }
    archive.append(buf, { name: `kran-design-system/${rel}` })
    fileCount += 1
  }

  await archive.finalize()
  await done

  return { fileCount, outputPath, skippedSensitive }
}

function parseArgs(argv) {
  const outIdx = argv.indexOf('--out')
  return {
    out: outIdx >= 0 ? argv[outIdx + 1] : null,
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const { out } = parseArgs(process.argv.slice(2))
  const date = new Date().toISOString().slice(0, 10)
  const outputPath =
    out != null
      ? path.resolve(REPO_ROOT, out)
      : path.join(REPO_ROOT, 'public', 'releases', `kran-design-system-source-${date}.zip`)

  const result = await createSourceArchive(outputPath)
  console.log(`Source archive: ${result.outputPath} (${result.fileCount} files)`)
  if (result.skippedSensitive.length) {
    console.warn('Skipped files with suspected secrets:', result.skippedSensitive.join(', '))
  }
}
