import * as cloudflare from '@pulumi/cloudflare'
import { local } from '@pulumi/command'
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()
const accountId = config.require('accountId')
const domain = config.require('domain')
// const apiToken = config.requireSecret('apiToken')

// const cloudflareProvider = new cloudflare.Provider('cloudflare', {
//   apiToken: apiToken,
// })

const zone = cloudflare.Zone.get(
  'pehtoorismies',
  '5b81e8fcda11ea423cf888df89f22240',
)

const honoApp = `
import app from ../apps/api/build/app.js

export default app
`

// const workerScriptContent = `
// export default {
//   async fetch(request, env, ctx) {
//     return new Response('Hello World!');
//   },
// };
// `

const appBuild = new local.Command(
  'buildAPI',
  {
    dir: '../apps/api',
    create: 'npx wrangler deploy --dry-run --outdir build',
    // triggers: [hashDirectory(`${d1Dir}migrations`)],
  },
  // { dependsOn: [myD1Database] },
)

const d1Database = new cloudflare.D1Database('example_d1_database', {
  accountId,
  name: 'example-database',
  primaryLocationHint: 'eeur',
})

const workersScript = new cloudflare.WorkersScript(
  'my-worker-script',
  {
    content: honoApp,
    scriptName: 'example-worker-script',
    compatibilityDate: '2025-05-18', // Use the current date or the date you want to ensure compatibility with
    accountId: accountId, // Replace with your Cloudflare account ID
    compatibilityFlags: ['nodejs_compat'],
    observability: {
      enabled: true,
      headSamplingRate: 0.1,
    },
    mainModule: './handler.ts', // The entry point of your Worker script
    bindings: [
      {
        name: 'DB', // The name used to reference the database in the Worker script
        type: 'd1', // Specifies the binding type
        id: d1Database.id,
      },
    ],
  },
  { dependsOn: [appBuild, d1Database] },
)

const workersScriptSubdomainResource = new cloudflare.WorkersScriptSubdomain(
  'workersScriptSubdomainResource',
  {
    accountId: accountId,
    enabled: true,
    scriptName: workersScript.scriptName,
    previewsEnabled: true,
  },
)

// const exampleWorkersRoute = new cloudflare.WorkersRoute(
//   'example_workers_route',
//   {
//     zoneId: '5b81e8fcda11ea423cf888df89f22240',
//     pattern: 'pehtoorismies.com/*',
//     script: workerScript.scriptName,
//   },
// )

export const workerScriptUrl = pulumi.interpolate`https://dev.workers.dev/${workersScript.scriptName}`
