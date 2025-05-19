#!/usr/bin/node

const file = await import('wranger.jsonc', { with: { type: 'json' } })

console.log(file)
