"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  locale: string;
}

const CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", flag: "🇮🇳", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar", locale: "en-US" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", name: "British Pound", locale: "en-GB" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro", locale: "de-DE" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪", name: "UAE Dirham", locale: "ar-AE" },
  { code: "SGD", symbol: "S$", flag: "🇸🇬", name: "Singapore Dollar", locale: "en-SG" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "CA$", flag: "🇨🇦", name: "Canadian Dollar", locale: "en-CA" },
];

// Map timezones to currency codes
const TIMEZONE_CURRENCY_MAP: Record<string, string> = {
  "Asia/Kolkata": "INR",
  "Asia/Calcutta": "INR",
  "America/New_York": "USD",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Los_Angeles": "USD",
  "Europe/London": "GBP",
  "Europe/Berlin": "EUR",
  "Europe/Paris": "EUR",
  "Asia/Dubai": "AED",
  "Asia/Singapore": "SGD",
  "Australia/Sydney": "AUD",
  "America/Toronto": "CAD",
  "America/Vancouver": "CAD",
};

// Rough exchange rates from USD (for demo purposes)
const EXCHANGE_RATES: Record<string, number> = {
  INR: 83.5,
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  AED: 3.67,
  SGD: 1.35,
  AUD: 1.53,
  CAD: 1.36,
};

function detectCurrencyFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_CURRENCY_MAP[tz] ?? "USD";
  } catch {
    return "USD";
  }
}

interface CurrencyContextValue {
  currency: CurrencyConfig;
  currencies: CurrencyConfig[];
  setCurrencyCode: (code: string) => void;
  formatPrice: (usdAmount: number) => string;
  convertFromUSD: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: CURRENCIES[0],
  currencies: CURRENCIES,
  setCurrencyCode: () => {},
  formatPrice: (n) => `$${n}`,
  convertFromUSD: (n) => n,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<string>("USD");

  useEffect(() => {
    const stored = localStorage.getItem("sb-currency");
    const detected = stored ?? detectCurrencyFromTimezone();
    setCurrencyCodeState(detected);
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    setCurrencyCodeState(code);
    localStorage.setItem("sb-currency", code);
  }, []);

  const currency = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[1];

  const convertFromUSD = useCallback(
    (usdAmount: number) => Math.round(usdAmount * (EXCHANGE_RATES[currencyCode] ?? 1)),
    [currencyCode]
  );

  const formatPrice = useCallback(
    (usdAmount: number) => {
      const converted = convertFromUSD(usdAmount);
      try {
        return new Intl.NumberFormat(currency.locale, {
          style: "currency",
          currency: currencyCode,
          maximumFractionDigits: 0,
        }).format(converted);
      } catch {
        return `${currency.symbol}${converted.toLocaleString()}`;
      }
    },
    [currency, currencyCode, convertFromUSD]
  );

  return (
    <CurrencyContext.Provider value={{ currency, currencies: CURRENCIES, setCurrencyCode, formatPrice, convertFromUSD }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
export { CURRENCIES };
