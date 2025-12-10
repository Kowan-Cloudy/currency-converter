'use client';

import { useState, useEffect } from 'react';
import { currencies } from '@/lib/currency';

interface ConversionHistory {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
  rate: number;
  createdAt: string;
}

export default function ConverterPage() {
  const [amount, setAmount] = useState<string>('1000');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('IDR');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), from, to }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setResult(data.result);
        setRate(data.rate);
        fetchHistory();
      }
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setRate(null);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Background grid */}
      <div className="fixed inset-0 grid-pattern pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Convert
          </h1>
          <p className="text-muted text-lg">
            Real-time exchange rates for 20+ currencies
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Converter Card */}
          <div className="lg:col-span-3 animate-fade-in-up delay-100">
            <div className="card p-6 sm:p-8">
              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input font-mono text-2xl sm:text-3xl font-bold h-16 sm:h-20"
                  placeholder="0.00"
                />
              </div>

              {/* Currency Selectors */}
              <div className="flex items-end gap-3 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted mb-2">
                    From
                  </label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="select font-mono font-semibold h-14"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={swapCurrencies}
                  className="h-14 w-14 rounded-xl border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-200 flex-shrink-0"
                  title="Swap currencies"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted mb-2">
                    To
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="select font-mono font-semibold h-14"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={loading || !amount}
                className="w-full h-14 bg-foreground text-background font-semibold rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Converting...
                  </span>
                ) : (
                  'Convert'
                )}
              </button>

              {/* Result */}
              {result !== null && (
                <div className="mt-6 p-6 rounded-xl bg-card border border-border">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted">Result</span>
                    <span className="text-xs text-muted font-mono">
                      1 {from} = {rate} {to}
                    </span>
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl font-bold">
                    {formatNumber(result)}
                    <span className="text-muted ml-2 text-xl">{to}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick amounts */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['100', '500', '1000', '5000', '10000'].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`px-4 py-2 rounded-full text-sm font-mono transition-all duration-200 ${
                    amount === quickAmount
                      ? 'bg-foreground text-background'
                      : 'border border-border hover:bg-card'
                  }`}
                >
                  {parseInt(quickAmount).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-2 animate-fade-in-up delay-200">
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">History</h2>
                <span className="text-sm text-muted">{history.length} entries</span>
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-muted" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-muted">No conversions yet</p>
                  <p className="text-sm text-muted mt-1">Start converting to see history</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-card border border-border hover:border-muted transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <span className="font-semibold">{item.fromCurrency}</span>
                          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="font-semibold">{item.toCurrency}</span>
                        </div>
                        <span className="text-xs text-muted">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-lg font-bold">
                          {formatNumber(item.amount)}
                        </span>
                        <span className="font-mono text-lg">
                          {formatNumber(item.result)}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-1 font-mono">
                        Rate: {item.rate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
