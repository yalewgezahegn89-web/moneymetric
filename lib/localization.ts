import type { CountryCode } from "@/config/countries";
import { getCountry } from "@/config/countries";

export function getLocale(countryCode: CountryCode = "US"): string {
  return getCountry(countryCode).locale;
}

export function getDateFormat(countryCode: CountryCode = "US"): string {
  return getCountry(countryCode).dateFormat;
}

export function getCurrencyCode(countryCode: CountryCode = "US"): string {
  return getCountry(countryCode).currency;
}

export function getCurrencySymbol(countryCode: CountryCode = "US"): string {
  return getCountry(countryCode).currencySymbol;
}
