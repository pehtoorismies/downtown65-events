import { SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
// const IncomingRequest = Request<unknown, IncomingRequestCfProperties>

describe('Hello World worker', () => {
  // it('responds with Hello World! (unit style)', async () => {
  //   const request = new IncomingRequest('http://hevpnen.com/events')
  //   // Create an empty context to pass to `worker.fetch()`.
  //   const ctx = createExecutionContext()
  //   const response = await worker.fetch(request, env, ctx)
  //   // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
  //   await waitOnExecutionContext(ctx)
  //   expect(await response.json()).toStrictEqual([])
  // })

  it('responds with Hello World! (integration style)', async () => {
    const response = await SELF.fetch('http://test.pehtoorismies.com/events')
    expect(await response.json()).toStrictEqual([])
  })
})
