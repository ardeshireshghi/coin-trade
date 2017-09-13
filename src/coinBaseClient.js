import { Client as CoinBaseClient } from 'coinbase';
import config from './config';
import Promise from 'bluebird';

const { apiKey, apiSecret } = config;

export const createCoinBaseTransportClient = () => {
  return new CoinBaseClient({
    apiKey,
    apiSecret
  });
};

const coinCurrencyToAcronym = {
  bitcoin: 'BTC',
  ethereum: 'ETH'
};

const getPrice = (client, {tradeType, currencyPair}) => {
  const methods = {
    buy: 'getBuyPrice',
    sell: 'getSellPrice'
  };

  return new Promise((resolve, reject) => {
    client[methods[tradeType]]({
      currencyPair
    }, (err, price) => {
      if (err) {
        return reject(err);
      }

      resolve(price.data);
    });
  });
};

const getAccount = Promise.promisify((client, accountName, cb) => {
  client.getAccounts({}, (err, accounts) => {
    if (err) {
      return cb(err);
    }

    cb(null, accounts.find(({name}) => name === accountName));
  });
});

const getTransactions = Promise.promisify((account, cb) => {
  account.getTransactions({}, (err, transactions) => {
    if (!err) {
      cb(null, {account, transactions});
    }
  });
});

const getCoinBuyPriceToGBP = (client, coinCurrencyName) => getPrice(client, {
  tradeType: 'buy',
  currencyPair: `${coinCurrencyToAcronym[coinCurrencyName]}-GBP`
});

const getCoinSellPriceToGBP = (client, coinCurrencyName) => getPrice(client, {
  tradeType: 'sell',
  currencyPair: `${coinCurrencyToAcronym[coinCurrencyName]}-GBP`
});

export default class CoinBaseApiClient {
  constructor(client = createCoinBaseTransportClient()) {
    this._client = client;
  }

  getTransactions(account) {
    return getTransactions(account);
  }

  getAccount(accountName) {
    return getAccount(this._client, accountName);
  }
}
