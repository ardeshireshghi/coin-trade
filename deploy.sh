#!/bin/bash
. .env
npm run build
serverless deploy --coinBaseApiKey="$COINBASE_API_KEY" --coinBaseSecret="$COINBASE_API_SECRET" --awsProfile=${AWS_PROFILE} --stage=prod -v
