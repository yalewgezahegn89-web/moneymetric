export interface CurrencyConfig {
  code: string;
  symbol: string;
  decimals: number;
  name: string;
}

const currencies: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", decimals: 2, name: "US Dollar" },
  CAD: { code: "CAD", symbol: "$", decimals: 2, name: "Canadian Dollar" },
  GBP: { code: "GBP", symbol: "\u00A3", decimals: 2, name: "British Pound" },
  AUD: { code: "AUD", symbol: "$", decimals: 2, name: "Australian Dollar" },
};

export function getCurrencyConfig(code: string): CurrencyConfig | undefined {
  return currencies[code];
}

export function convertCurrency(amount: number): number {
  // Placeholder: exchange rate conversion will be implemented later
  return amount;
}
