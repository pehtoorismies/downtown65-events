# Dt65 OPENAPI

## Local development

### Environment variables

Add `WRANGLER_DEV_ENV` to separate local dev environment.

You can use `direnv` to load the environment variables from `.envrc` file.

```bash
echo "export WRANGLER_DEV_ENV=<your_username>" >> .envrc
direnv allow
```

Add secrets to `.dev.vars.<your_username>` file. This file should not be committed to the repository.:

```bash
# .dev.vars.<yout_username>
AUTH0_CLIENT_SECRET=<secret>
```

Create database.

```bash
npx wrangler d1 create dt65
```