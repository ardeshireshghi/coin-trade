const expect = require('chai').expect;
const sinon = require('sinon');
const CoinBaseApiClient = require('../lib/coinBaseClient').default;

// coin base API mock resources
const createMockTransaction = require('./fixtures/createMockTransaction');
const createMockAccount = require('./fixtures/createMockAccount');

describe('checkSell', () => {
  // Unit under test
  const checkSell = require('../lib/main').checkSell;

  it('should not sell when profit is less than 33%', (done) => {
    const investmentAmount = '200.46';
    const returnAmount = '240.45';
    const commit = sinon.stub();
    const mockAccount = createMockAccount(returnAmount, commit);

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

  it('should sell when profit is greater than 33%', (done) => {
    const investmentAmount = '200.46';
    const returnAmount = '270.45';

    const sellSuccessResponse = {
      id: 'xxxx'
    };

    const commit = sinon.stub().yields(null, sellSuccessResponse);
    const mockAccount = createMockAccount(returnAmount, commit);
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
