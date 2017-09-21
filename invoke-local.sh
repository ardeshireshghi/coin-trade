#!/bin/bash
. .env
npm run build
serverless invoke local --coinBaseApiKey=${COINBASE_API_KEY} --coinBaseSecret=${COINBASE_API_SECRET} --sellProfitMargin=${SELL_PROFIT_MARGIN} --awsProfile=${AWS_PROFILE} --stage=prod  --function sell
