import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CURRENCIES = {
  KES: { symbol: 'KSh', code: 'KES', rate: 1, label: 'KES' },
  NGN: { symbol: '₦', code: 'NGN', rate: 10.8, label: 'NGN' },
};

const STORAGE_KEY = 'flash_currency';

// Country to currency mapping for IP detection
const CURRENCY_CONFIG = {
  KE: { currency: 'KES' },
  NG: { currency: 'NGN' },
  default: { currency: 'KES' },
};

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

  // Detect country and set currency if no stored preference
  useEffect(() => {
    const detectAndSetCurrency = async () => {
      // Only detect if no currency is stored
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return; // User has manual preference, don't override
      } catch {}

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const config = CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG.default;
        
        // Only update if detected currency is different and valid
        if (config.currency && CURRENCIES[config.currency]) {
          setCurrencyState(config.currency);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Keep default KES
      }
    };

    detectAndSetCurrency();
  }, []);

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

/*import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CURRENCIES = {
  KES: { symbol: 'KSh', code: 'KES', rate: 1, label: 'KES' },
  NGN: { symbol: '₦', code: 'NGN', rate: 10.8, label: 'NGN' },
};

const STORAGE_KEY = 'flash_currency';

// Country to currency mapping for IP detection
const CURRENCY_CONFIG = {
  KE: { currency: 'KES' },
  NG: { currency: 'NGN' },
  default: { currency: 'KES' },
};

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

  // Detect country and set currency if no stored preference
  useEffect(() => {
    const detectAndSetCurrency = async () => {
      // Only detect if no currency is stored
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return; // User has manual preference, don't override
      } catch {}

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const config = CURRENCY_CONFIG[countryCode] || CURRENCY_CONFIG.default;
        
        // Only update if detected currency is different and valid
        if (config.currency && CURRENCIES[config.currency]) {
          setCurrencyState(config.currency);
        }
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Keep default KES
      }
    };

    detectAndSetCurrency();
  }, []);

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
}*/