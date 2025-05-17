#!/usr/bin/node

import fs from 'node:fs'

const d = await import('../wrangler.json', {
  with: { type: 'json' },
})

if (!process.argv[2]) {
  // biome-ignore lint/suspicious/noConsole: For this file only
  console.log('usage: node create-wrangler.js <pull-request>')
  process.exit(1)
}

const pr = process.argv[2]

//
// wranglerJSON.name
//
// // const wrangler = JSON.parse(wranglerJSON)
//
// const returnedTarget = Object.assign({ env: { } }, d.default)

d.default.env[pr] = {
  routes: [
    {
      pattern: `api-${pr}.pehtoorismies.com`,
      custom_domain: true,
    },
  ],
  vars: {
    LOG_LEVEL: 'info',
    AUTH0_CLIENT_ID: 'JaoAht7ggce7f5R8DCBGUyjUJeMQEDtz',
    AUTH0_DOMAIN: 'dev-dt65.eu.auth0.com',
  },
}

fs.writeFileSync('test.json', JSON.stringify(d.default))

//
// // const r = spawn.sync('ls')
//
// console.log(r.stdout.toString())
//
// console.log('**********/')
// console.log(d.default)
// console.log('/**********')
