import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const getEnv = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  driver: 'd1-http',
  dialect: 'sqlite',
  dbCredentials: {
    accountId: getEnv('CLOUDFLARE_DEFAULT_ACCOUNT_ID'),
    token: getEnv('CLOUDFLARE_API_TOKEN'),
    databaseId: '7edc7ece-3cc2-464f-b50d-5f31de26618d',
  },
})
