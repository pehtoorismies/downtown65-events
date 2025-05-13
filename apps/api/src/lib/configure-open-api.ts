import type { AppOpenAPI } from '~/lib/types'

import packageJSON from '../../package.json'

export const configureOpenAPI = (app: AppOpenAPI) => {
  app.openAPIRegistry.registerComponent('securitySchemes', 'ApiKeyAuth', {
    type: 'apiKey',
    in: 'header',
    name: 'x-api-key',
  })

  app.doc('/doc', {
    openapi: '3.1.0',
    info: {
      version: packageJSON.version,
      title: 'Downtown65 API',
    },
  })
}
