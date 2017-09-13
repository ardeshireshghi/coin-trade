const sinon = require('sinon');
const createMockTransaction = require('./createMockTransaction');

module.exports = (sellReturnAmount, commitStub) => {
  return {
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
    sell: sinon.stub().yields(null, Object.assign({}, createMockTransaction('sell', sellReturnAmount), {commit: commitStub}))
  };
};
