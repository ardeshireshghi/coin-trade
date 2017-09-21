#!/bin/bash
. .env
npm install
npm run build
serverless deploy --coinBaseApiKey="$COINBASE_API_KEY" --coinBaseSecret="$COINBASE_API_SECRET" --sellProfitMargin=${SELL_PROFIT_MARGIN} --awsProfile=${AWS_PROFILE} --stage=prod -v
