import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { calculatorRegistry } from "@/calculators/registry";
import { getAllGuides } from "@/content/guides/registry";

const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/calculators", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/categories", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/guides", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/methodology", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const calculatorEntries: MetadataRoute.Sitemap = calculatorRegistry.map(
    (calculator) => ({
      url: `${siteConfig.url}/calculators/${calculator.meta.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const guides = getAllGuides();
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${siteConfig.url}/guides/${guide.slug}`,
    lastModified: new Date(guide.lastUpdated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...calculatorEntries, ...guideEntries];
}