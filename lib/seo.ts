import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { CalculatorMeta } from "@/calculators/types";

export function generateCalculatorMetadata(
  calculator: CalculatorMeta,
  countryCode?: string
): Metadata {
  const suffix = countryCode ? ` (${countryCode})` : "";
  const title = `${calculator.title}${suffix} | ${siteConfig.name}`;
  const description = calculator.description;
  const url = `${siteConfig.url}/calculators/${calculator.slug}`;

  return {
    title,
    description,
    keywords: calculator.keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
