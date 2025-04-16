/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cloudflare-test",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const trpc = new sst.cloudflare.Worker("Trpc", {
      url: true,
      handler: "apps/backend/src/index.ts",
    });

    const client = new sst.cloudflare.Worker("Client", {
      url: true,
      link: [trpc],
      handler: "apps/web/src/client.ts",
    });
  },
});
