import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CURRENCIES = {
KES: { symbol: 'KSH', code: 'KES', rate: 1, label: 'KES' },
  NGN: { symbol: '₦', code: 'NGN', rate: 11.63, label: 'NGN' },
  GHS: { symbol: 'GH₵', code: 'GHS', rate: 0.11, label: 'GHS' },
  ZAR: { symbol: 'R', code: 'ZAR', rate: 0.14, label: 'ZAR' },
  UGX: { symbol: 'USh', code: 'UGX', rate: 28.5, label: 'UGX' },
  TZS: { symbol: 'TSh', code: 'TZS', rate: 20.2, label: 'TZS' },
  RWF: { symbol: 'FRw', code: 'RWF', rate: 10.1, label: 'RWF' },
  ZMW: { symbol: 'ZK', code: 'ZMW', rate: 0.21, label: 'ZMW' },
  MWK: { symbol: 'MK', code: 'MWK', rate: 13.2, label: 'MWK' },
  XOF: { symbol: 'CFA', code: 'XOF', rate: 4.6, label: 'XOF' }, // Covers BF, CI, SN
  XAF: { symbol: 'FCFA', code: 'XAF', rate: 4.6, label: 'XAF' },
  USD: { symbol: '$', code: 'USD', rate: 0.0076, label: 'USD' },
  GBP: { symbol: '£', code: 'GBP', rate: 0.006, label: 'GBP' },
  EUR: { symbol: '€', code: 'EUR', rate: 0.007, label: 'EUR' }
};

const STORAGE_KEY = 'flash_currency';

// Country to currency mapping for IP detection
const CURRENCY_CONFIG = {
  KE: { currency: 'KES' },
  NG: { currency: 'NGN' },
  GH: { currency: 'GHS' },
  ZA: { currency: 'ZAR' },
  UG: { currency: 'UGX' },
  TZ: { currency: 'TZS' },
  RW: { currency: 'RWF' },
  ZM: { currency: 'ZMW' },
  MW: { currency: 'MWK' },
  BF: { currency: 'XOF' },
  CI: { currency: 'XOF' },
  SN: { currency: 'XOF' },
  CM: { currency: 'XAF' },
  US: { currency: 'USD' },
  GB: { currency: 'GBP' },
  EU: { currency: 'EUR' },
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
  const [locality, setLocality] = useState(null);

  // Detect country and set currency if no stored preference
  useEffect(() => {
    const detectAndSetCurrency = async () => {
      // Only detect if no currency is stored
      /*try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return; // User has manual preference, don't override
      } catch {}*/

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setLocality(data);
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
      locality,
      code: cfg.code,
      setCurrency: setCurrencyState,
      convertPrice: (kesPrice) => Math.round((Number(kesPrice) || 0) * cfg.rate),
      options: CURRENCIES,
    };
  }, [currency, locality]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}