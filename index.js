'use strict';

const CoinBaseApiClient = require('./lib/coinBaseClient').default;
const checkSell = require('./lib/main').checkSell;

exports.handler = (event, context) => {
  checkSell(new CoinBaseApiClient());
};
