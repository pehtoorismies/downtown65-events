import { WorkerEntrypoint } from 'cloudflare:workers'
import { Scalar } from '@scalar/hono-api-reference'
import { configureOpenAPI } from '~/lib/configure-open-api'
import { createApp } from '~/lib/create-app'
import { eventRoutes } from '~/routes/events/events.index'
import { migrationRoutes } from '~/routes/migration/migration.index'
const app = createApp()

const routes = [eventRoutes, migrationRoutes]

configureOpenAPI(app)

for (const route of routes) {
  app.route('/', route)
}

app.get(
  '/scalar',
  Scalar({
    url: '/doc',
    theme: 'kepler',
    layout: 'classic',
    defaultHttpClient: {
      targetKey: 'js',
      clientKey: 'fetch',
    },
    authentication: {
      preferredSecurityScheme: 'ApiKeyAuth',
    },
  }),
)

// HACK for unit testing
export default class extends WorkerEntrypoint {
  fetch(request: Request) {
    // @ts-ignore
    return app.fetch(request, this.env, this.ctx)
  }
}

// export default app
