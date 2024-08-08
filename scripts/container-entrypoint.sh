#!/bin/bash

# Define the file path
FILE_PATH="prisma/schema.prisma"
FILE_PATH_S="prisma/migrations/migration_lock.toml"

# Check if the file exists
if [[ -f "$FILE_PATH" ]]; then
  # Use sed to replace the provider value
  sed -i.bak 's/provider  = "postgresql"/provider  = "cockroachdb"/' "$FILE_PATH"

  # Remove the backup file created by sed
  rm "${FILE_PATH}.bak"

  echo "Provider value has been updated in $FILE_PATH"
else
  echo "File $FILE_PATH does not exist."
fi
# Check if the file exists
if [[ -f "$FILE_PATH_S" ]]; then
  # Use sed to replace the provider value
  sed -i.bak 's/provider = "postgresql"/provider  = "cockroachdb"/' "$FILE_PATH_S"

  # Remove the backup file created by sed
  rm "${FILE_PATH_S}.bak"

  echo "Provider value has been updated in $FILE_PATH_S"
else
  echo "File $FILE_PATH_S does not exist."
fi

set -euxo pipefail

npx prisma migrate deploy
npm run start
