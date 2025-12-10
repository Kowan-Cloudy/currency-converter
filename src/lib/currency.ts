const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'c5c153cfed904ecfa22ac19e';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export const currencies = [
  'USD', 'EUR', 'GBP', 'JPY', 'IDR', 'SGD', 'MYR', 
  'AUD', 'CNY', 'KRW', 'THB', 'INR', 'CAD', 'CHF',
  'HKD', 'NZD', 'PHP', 'TWD', 'VND', 'AED'
];

interface ExchangeRateResponse {
  result: string;
  conversion_rates: Record<string, number>;
}

let cachedRates: Record<string, number> | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now();
  
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedRates;
  }

  try {
    const response = await fetch(`${BASE_URL}/latest/USD`);
    const data: ExchangeRateResponse = await response.json();
    
    if (data.result === 'success') {
      cachedRates = data.conversion_rates;
      cacheTimestamp = now;
      return cachedRates;
    }
    throw new Error('API request failed');
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    // Fallback rates if API fails
    return {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 157.5, IDR: 16250,
      SGD: 1.35, MYR: 4.72, AUD: 1.54, CNY: 7.27, KRW: 1380,
      THB: 36.5, INR: 83.5, CAD: 1.36, CHF: 0.88, HKD: 7.82,
      NZD: 1.67, PHP: 56.5, TWD: 32.1, VND: 24500, AED: 3.67
    };
  }
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ result: number; rate: number }> {
  const rates = await getExchangeRates();
  
  const fromRate = rates[from];
  const toRate = rates[to];
  
  if (!fromRate || !toRate) {
    throw new Error('Invalid currency');
  }
  
  // Convert to USD first, then to target currency
  const inUSD = amount / fromRate;
  const result = inUSD * toRate;
  const rate = toRate / fromRate;
  
  return {
    result: Math.round(result * 100) / 100,
    rate: Math.round(rate * 1000000) / 1000000,
  };
}
