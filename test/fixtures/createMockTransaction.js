module.exports = (type = 'sell', amount) => {
  const transaction = {
    id: '4ece8d91-7b1c-5ad4-85c6-464fee65a1f6',
    status: 'created',
    payment_method: {
      id: '1740081c-4ca2-50ae-a310-eca1a0c67155',
      resource: 'payment_method',
      resource_path: '/v2/payment-methods/1740081c-4ca2-50ae-a310-eca1a0c67155'
    },
    transaction: null,
    user_reference: 'MVEWFYY3',
    created_at: '2017-09-13T14:10:37Z',
    updated_at: '2017-09-13T14:10:37Z',
    type,
    resource: type,
    fees: [
      {
        type: 'coinbase',
        amount: {
          amount: '2.99',
          currency: 'GBP'
        }
      },
      {
        type: 'bank',
        amount: {
          amount: '0.00',
          currency: 'GBP'
        }
      }
    ],
    amount: {
      amount: '0.96155712',
      currency: 'ETH'
    },
    subtotal: {
      amount: '193.02',
      currency: 'GBP'
    },
    committed: false,
    instant: true
  };

  if (type === 'sell') {
    return Object.assign({}, transaction, {
      total: {
        amount,
        currency: 'GBP'
      }
    });
  } else if (type === 'buy') {
    return Object.assign({}, transaction, {
      native_amount: {
        amount,
        currency: 'GBP'
      }
    });
  }
};
