import type { Country, CountryCode } from "@/config/countries";
import { getCountry } from "@/config/countries";

export function formatCurrency(
  value: number,
  countryCode: CountryCode = "US"
): string {
  const country = getCountry(countryCode);
  const formatted = formatNumber(value, countryCode, 2);
  return `${country.currencySymbol}${formatted}`;
}

export function formatNumber(
  value: number,
  countryCode: CountryCode = "US",
  decimals = 2
): string {
  const country = getCountry(countryCode);
  const parts = value.toFixed(decimals).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, country.thousandSeparator);
  if (parts.length === 1) return intPart;
  return `${intPart}${country.decimalSeparator}${parts[1]}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function parseCurrencyInput(
  value: string,
  country: Country
): number {
  const cleaned = value
    .replace(new RegExp(`\\${country.currencySymbol}`, "g"), "")
    .replace(new RegExp(`\\${country.thousandSeparator}`, "g"), "")
    .replace(new RegExp(`\\${country.decimalSeparator}`), ".")
    .trim();
  return parseFloat(cleaned) || 0;
}
