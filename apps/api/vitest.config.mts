import viteTsconfigPaths from 'vite-tsconfig-paths'

import path from 'node:path'
import {
  defineWorkersProject,
  readD1Migrations,
} from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject(async () => {
  // Read all migrations in the `migrations` directory
  const migrationsPath = path.join(__dirname, 'drizzle')
  const migrations = await readD1Migrations(migrationsPath)

  return {
    plugins: [viteTsconfigPaths()],
    test: {
      deps: {
        optimizer: {
          ssr: {
            enabled: true,
            include: ['auth0'],
          },
        },
      },
      setupFiles: ['./test/apply-migrations.ts'],
      poolOptions: {
        workers: {
          singleWorker: true,
          wrangler: {
            configPath: './wrangler.jsonc',
            environment: 'test',
          },
          miniflare: {
            // Add a test-only binding for migrations, so we can apply them in a
            // setup file
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  }
})
