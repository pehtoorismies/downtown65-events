#!/bin/bash

# Name of the D1 database to check
DATABASE_NAME=$1
WRANGLER_ENV=$2

# Check if the database name is provided
if [ -z "$DATABASE_NAME" ]; then
  echo "Usage: $0 <DATABASE_NAME> <WRANGLER_ENV>"
  exit 1
fi

# Check if the database name is provided
if [ -z "$WRANGLER_ENV" ]; then
  echo "Usage: $0 <DATABASE_NAME> <WRANGLER_ENV>"
  exit 1
fi

# Fetch the list of D1 databases
DATABASE_LIST=$(npx wrangler d1 info)

echo "RESOLVED TO $DATABASE_LIST"
#
## Check if the database exists in the list
#if echo "$DATABASE_LIST" | grep -q "$DATABASE_NAME"; then
#  echo "database already exists"
#else
#  echo "create a new D1 database $DATABASE_NAME"
# #  npx wrangler d1 create $DATABASE_NAME
fi