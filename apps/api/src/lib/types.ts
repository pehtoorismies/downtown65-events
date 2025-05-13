import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'

export interface AppBindings {
  Bindings: {
    DB: D1Database
    LOG_LEVEL: string
    AUTH0_CLIENT_ID: string
    AUTH0_DOMAIN: string
    AUTH0_CLIENT_SECRET: string
  }
  Variables: {
    logger: PinoLogger
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>
