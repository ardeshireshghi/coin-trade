import Promise from 'bluebird';
import config from './config';

const COINBASE_ETHER_ACCOUNT_NAME = 'ETH Wallet';
const profitRatioToSellAt = config.profitMargin;

const handleApiError = (err) => {
  console.error('Coinbase API Error:', err);
};

const getLastBuyTransaction = (transactions) => {
  const buyTransactionsOrdered = transactions.filter(t => t.type === 'buy').sort((a, b) => {
    if (new Date(a.created_at) < new Date(b.created_at)) {
      return 1;
    }

    if (new Date(a.created_at) > new Date(b.created_at)) {
      return -1;
    }

    return 0;
  });

  return buyTransactionsOrdered.length ? buyTransactionsOrdered[0] : null;
};

export const checkSell = (apiClient) => {
  const client = apiClient;

  return client.getAccount(COINBASE_ETHER_ACCOUNT_NAME)
    .then(client.getTransactions)
    .then(({account, transactions}) => {
        const { balance } = account;
        const lastBuy = getLastBuyTransaction(transactions);

        // Check if last buy amount is identical to current balance
        if (lastBuy && lastBuy.amount.amount === balance.amount) {
          const lastBuyAmountGBP = parseFloat(lastBuy.native_amount.amount);

          console.log('Last ETHER buy amount (GBP): %s', lastBuyAmountGBP);

          return new Promise((resolve, reject) => {
            account.sell({
              amount: balance.amount,
              currency: 'ETH',
              commit: false
            }, (err, tx) => {
              const { fees, total } = tx;
              const salesAmountGBP = parseFloat(total.amount);
              const allFeesGBP = fees.reduce((acc, item) => acc + parseFloat(item.amount.amount), 0);
              const salesAmountMinusFees = salesAmountGBP;
              const profitLossRatio =  salesAmountMinusFees / lastBuyAmountGBP;
              const profitMet = (profitLossRatio - 1 >= profitRatioToSellAt);

              if (profitLossRatio > 1) {
                console.log('Current profit percent(%)', Math.abs(profitLossRatio - 1) * 100);
              } else {
                console.log('Current loss percent(%)', Math.abs(profitLossRatio - 1) * 100);
              }

              if (profitMet) {
                console.log('SELLING Ether balance of %s with price £%s', balance.amount, salesAmountMinusFees);

                tx.commit((err, resp) => {
                  console.log('Ether Sell Transaction made', resp);
                  resolve();
                });
              } else {
                console.log('KEEPING Ether balance of %s with price £%s', balance.amount, salesAmountMinusFees);
                resolve();
              }
            });
          });
        }
    })
    .catch(handleApiError);
}
