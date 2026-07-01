import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CURRENCIES = {
  KES: { symbol: 'KSh', code: 'KES', rate: 1, label: 'KES' },
  NGN: { symbol: '₦', code: 'NGN', rate: 10.8, label: 'NGN' },
};

const STORAGE_KEY = 'flash_currency';

const CurrencyContext = createContext({
  currency: 'KES',
  symbol: 'KSh',
  code: 'KES',
  setCurrency: () => {},
  convertPrice: () => 0,
  options: CURRENCIES,
});

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'KES';
    } catch {
      return 'KES';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  const value = useMemo(() => {
    const cfg = CURRENCIES[currency] || CURRENCIES.KES;
    return {
      currency,
      symbol: cfg.symbol,
      code: cfg.code,
      setCurrency: setCurrencyState,
      convertPrice: (kesPrice) => Math.round((Number(kesPrice) || 0) * cfg.rate),
      options: CURRENCIES,
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
