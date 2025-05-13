import * as process from 'node:process'
import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { type ZodError, z } from 'zod'

expand(config())

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'fatal']),
})

export type Env = z.infer<typeof EnvSchema>

let myEnv: Env

try {
  myEnv = EnvSchema.parse(process.env)
} catch (e) {
  const error = e as ZodError
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error('Invalid or missing environment variables')
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.error(error.flatten().fieldErrors)
  process.exit(1)
}

export const env = myEnv
