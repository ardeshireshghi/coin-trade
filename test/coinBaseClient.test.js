const expect = require('chai').expect;
const CoinBaseApiClient = require('../lib/coinBaseClient').default;

describe('CoinBaseApiClient', () => {
  it('should get account information', (done) => {
    const COINBASE_ETHER_ACCOUNT_NAME = 'ETH Wallet';
    const client = new CoinBaseApiClient();
    client.getAccount(COINBASE_ETHER_ACCOUNT_NAME).then(({balance}) => {
      expect(balance).to.include.key('amount');
      done();
    });
  });

  it('should get sell information', (done) => {
    const COINBASE_ETHER_ACCOUNT_NAME = 'ETH Wallet';
    const client = new CoinBaseApiClient();
    client.getAccount(COINBASE_ETHER_ACCOUNT_NAME)
      .then((account) => {
        account.sell({
          amount: account.balance.amount,
          currency: 'ETH',
          commit: false
        }, (err, tx) => {
          if (err) {
            return done();
          }

          expect(tx).to.include.keys('fees', 'total');
          done();
        });
      });
    });
});
