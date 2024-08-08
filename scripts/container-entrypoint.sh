#!/bin/bash

# Define the file path
FILE_PATH="prisma/schema.prisma"

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

set -euxo pipefail

npx prisma migrate deploy
npm run start
