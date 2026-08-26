import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { CalculatorMeta } from "@/calculators/types";

export function generateCalculatorMetadata(
  calculator: CalculatorMeta,
  countryCode?: string
): Metadata {
  const suffix = countryCode ? ` (${countryCode})` : "";
  const title = `${calculator.title}${suffix}`;
  const description = calculator.description;
  const path = `/calculators/${calculator.slug}`;
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    keywords: calculator.keywords,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: path,
    },
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  options?: { noindex?: boolean }
): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    robots: options?.noindex
      ? { index: false, follow: true }
      : undefined,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: siteConfig.locale.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: path,
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  };
}
