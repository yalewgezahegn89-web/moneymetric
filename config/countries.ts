export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  thousandSeparator: string;
  decimalSeparator: string;
  dateFormat: string;
}

export type CountryCode = "US" | "CA" | "GB" | "AU";

export const countries: Record<CountryCode, Country> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    thousandSeparator: ",",
    decimalSeparator: ".",
    dateFormat: "MM/DD/YYYY",
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "$",
    locale: "en-CA",
    thousandSeparator: ",",
    decimalSeparator: ".",
    dateFormat: "MM/DD/YYYY",
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "\u00A3",
    locale: "en-GB",
    thousandSeparator: ",",
    decimalSeparator: ".",
    dateFormat: "DD/MM/YYYY",
  },
  AU: {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "$",
    locale: "en-AU",
    thousandSeparator: ",",
    decimalSeparator: ".",
    dateFormat: "DD/MM/YYYY",
  },
};

export const countryList: Country[] = Object.values(countries);

export function getCountry(code: CountryCode): Country {
  return countries[code];
}

export function getCountryByCurrency(currency: string): Country | undefined {
  return countryList.find((c) => c.currency === currency);
}
