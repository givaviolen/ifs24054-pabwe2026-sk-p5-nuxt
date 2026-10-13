import fs from 'node:fs'
import path from 'node:path'

export default defineNitroPlugin((nitroApp) => {
  let inlinedEntryCss = ''

  nitroApp.hooks.hook('render:html', (html) => {
    try {
      if (!inlinedEntryCss) {
        const candidates = [
          path.resolve(process.cwd(), '.output/public/_nuxt'),
          path.resolve(process.cwd(), 'dist/_nuxt'),
          path.resolve(process.cwd(), 'public/_nuxt'),
        ]

        for (const dir of candidates) {
          if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir)
            const entryCssFile = files.find(f => f.startsWith('entry.') && f.endsWith('.css'))
            if (entryCssFile) {
              inlinedEntryCss = fs.readFileSync(path.join(dir, entryCssFile), 'utf-8')
              break
            }
          }
        }
      }

      if (inlinedEntryCss) {
        html.head = html.head.map((tag) => {
          if (typeof tag === 'string' && tag.includes('entry.') && tag.includes('.css') && tag.includes('rel="stylesheet"')) {
            return `<style>${inlinedEntryCss}</style>`
          }
          return tag
        })
      }
    } catch (e) {
      console.error('Error inlining css:', e)
    }
  })
})
