const expect = require('chai').expect;
const sinon = require('sinon');

const checkSell = require('../lib/main').checkSell;
const CoinBaseApiClient = require('../lib/coinBaseClient').default;
const createMockTransaction = require('./fixtures/createMockTransaction');
const createCoinBaseTransportClient = require('../lib/coinBaseClient').createCoinBaseTransportClient;

describe('checkSell', () => {
  it('should not sell when profit is less than 50%', (done) => {
    const investmentAmount = '200.46';
    const returnAmount = '240.45';
    const commit = sinon.stub();
    const mockAccount = {
      id: "4cea968a-d8ab-538f-a0a9-xxxxxxxxx",
      name: 'ETH Wallet',
      primary: false,
      type: 'wallet',
      currency: 'ETH',
      balance: {
        amount: "0.96155712",
        currency: "ETH"
      },
      resource: 'account',
      sell: sinon.stub().yields(null, Object.assign({}, createMockTransaction('sell', returnAmount), {commit}))
    };

    const client = new CoinBaseApiClient();

    sinon.stub(client, 'getAccount').resolves(mockAccount);

    sinon.stub(client, 'getTransactions').resolves({
      account: mockAccount,
      transactions: [createMockTransaction('buy', investmentAmount)]
    });

    checkSell(client).then(() => {
      expect(commit.called).to.be.false;
      done();
    });
  });

  it('should sell when profit is greater than 50%', (done) => {
    const investmentAmount = '200.46';
    const returnAmount = '310.45';

    const sellSuccessResponse = {
      id: 'xxxx'
    };

    const commit = sinon.stub().yields(null, sellSuccessResponse);

    const mockAccount = {
      id: "4cea968a-d8ab-538f-a0a9-xxxxxxxxx",
      name: 'ETH Wallet',
      primary: false,
      type: 'wallet',
      currency: 'ETH',
      balance: {
        amount: "0.96155712",
        currency: "ETH"
      },
      resource: 'account',
      sell: sinon.stub().yields(null, Object.assign({}, createMockTransaction('sell', returnAmount), {commit}))
    };

    const client = new CoinBaseApiClient();

    sinon.stub(client, 'getAccount').resolves(mockAccount);

    sinon.stub(client, 'getTransactions').resolves({
      account: mockAccount,
      transactions: [createMockTransaction('buy', investmentAmount)]
    });

    checkSell(client).then(() => {
      expect(commit.called).to.be.true;
      done();
    });
  });
});
