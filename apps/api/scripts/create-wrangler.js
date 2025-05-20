#!/usr/bin/node

const file = await import('../apps/api/wrangler.jsonc', {
  with: { type: 'json' },
})

console.log('**********/')
console.log(file)
console.log('/**********')
