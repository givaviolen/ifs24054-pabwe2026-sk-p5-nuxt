import { config } from 'dotenv'
config()
const port = process.env.APP_PORT || '3000'
process.env.NITRO_PORT = port
process.env.PORT = port
await import('./.output/server/index.mjs')
