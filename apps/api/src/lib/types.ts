import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

interface Binding {
  DB: D1Database
}
interface Secret {
  AUTH0_CLIENT_SECRET: string
}

/**
 * Env: automatically created by "wrangler types"
 * Binding: add your own bindings here
 * Secret: add your own secrets here
 */
export interface AppBindings {
  Bindings: Env & Binding & Secret
  Variables: {
    logger: PinoLogger
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>
