import dovenv from 'dotenv';
dovenv.config();

export default {
  apiKey: process.env.COINBASE_API_KEY,
  apiSecret: process.env.COINBASE_API_SECRET,
  profitMargin: parseFloat(process.env.SELL_PROFIT_MARGIN) || 0.33
}
