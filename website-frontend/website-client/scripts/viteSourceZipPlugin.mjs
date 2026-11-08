import fs from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createSourceArchive } from './createSourceArchive.mjs'

const ROUTE = '/api/portal/source-zip'

export function viteSourceZipPlugin() {
  return {
    name: 'kran-source-zip',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith(ROUTE)) {
          next()
          return
        }

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        const date = new Date().toISOString().slice(0, 10)
        const filename = `kran-design-system-source-${date}.zip`
        let tempPath = ''

        try {
          tempPath = path.join(os.tmpdir(), `kran-ds-${Date.now()}.zip`)
          await createSourceArchive(tempPath)

          if (req.method === 'HEAD') {
            const stat = await fsp.stat(tempPath)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/zip')
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
            res.setHeader('Content-Length', String(stat.size))
            res.end()
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/zip')
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
          fs.createReadStream(tempPath)
            .on('error', () => {
              res.statusCode = 500
              res.end('Archive read failed')
            })
            .pipe(res)
            .on('close', () => {
              fsp.unlink(tempPath).catch(() => {})
            })
        } catch {
          if (tempPath) await fsp.unlink(tempPath).catch(() => {})
          res.statusCode = 500
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Could not prepare source archive.')
        }
      })
    },
  }
}
