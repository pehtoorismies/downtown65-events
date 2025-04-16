import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { Router } from '@downtown65-app/backend'
import { Resource } from 'sst'

export default {
  async fetch() {
    const client = createTRPCClient<Router>({
      links: [
        httpBatchLink({
          url: 'http://localhost/',
          fetch(request) {
            return Resource.Trpc.fetch(request)
          },
        }),
      ],
    })
    return new Response(
      await client.greet.query({
        name: 'Patrick Star',
      }),
    )
  },
}
