export const siteConfig = {
  name: "MoneyMetric",
  tagline: "Make Better Money Decisions.",
  description:
    "Simple, accurate financial calculators and money tools for everyday decisions.",
  url: "https://moneymetric.com",
  locale: "en-US",
  defaultCountry: "US" as const,
  organization: {
    name: "MoneyMetric",
    url: "https://moneymetric.com",
  },
  social: {
    twitter: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
