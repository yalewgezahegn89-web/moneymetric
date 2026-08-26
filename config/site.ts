const PRODUCTION_URL = "https://mymoneymetric.com";

export const siteConfig = {
  name: "MoneyMetric",
  tagline: "Make Better Money Decisions.",
  description:
    "Simple, accurate financial calculators and money tools for everyday decisions.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL,
  locale: "en-US",
  defaultCountry: "US" as const,
  organization: {
    name: "MoneyMetric",
    url:
      process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL,
  },
  social: {
    twitter: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
