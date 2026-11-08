import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const assetsDir = path.resolve(process.cwd(), 'dist', 'assets')

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`
}

async function listFiles(dir) {
  const names = await readdir(dir)
  const rows = await Promise.all(
    names.map(async (name) => {
      const full = path.join(dir, name)
      const info = await stat(full)
      return { name, size: info.size }
    }),
  )
  return rows.sort((a, b) => b.size - a.size)
}

const files = await listFiles(assetsDir)
const total = files.reduce((sum, file) => sum + file.size, 0)

console.log(`dist/assets (${files.length} files, ${formatKb(total)} total)\n`)
for (const file of files.slice(0, 15)) {
  console.log(`${formatKb(file.size).padStart(10)}  ${file.name}`)
}
