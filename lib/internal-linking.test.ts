import { describe, it, expect } from "vitest";
import {
  calculatorRegistry,
  getCalculatorBySlug,
  getCalculatorsByCategory,
  getAllCalculatorSlugs,
  getAllCategories,
} from "@/calculators/registry";
import { getCalculatorSeoContent } from "@/content/registry";
import { generateBreadcrumbSchema } from "./seo";

describe("Published calculator discoverability", () => {
  const publishedSlugs = getAllCalculatorSlugs();

  it("has at least one published calculator", () => {
    expect(publishedSlugs.length).toBeGreaterThan(0);
  });

  it("compound-interest is discoverable", () => {
    expect(publishedSlugs).toContain("compound-interest");
  });

  it("mortgage is discoverable", () => {
    expect(publishedSlugs).toContain("mortgage");
  });

  it("all published calculators can be retrieved by slug", () => {
    for (const slug of publishedSlugs) {
      const calculator = getCalculatorBySlug(slug);
      expect(calculator).toBeDefined();
      expect(calculator?.meta.slug).toBe(slug);
    }
  });
});

describe("Related calculators only resolve to registered calculators", () => {
  it("all related calculator slugs in compound-interest content are registered", () => {
    const content = getCalculatorSeoContent("compound-interest");
    expect(content).toBeDefined();
    if (!content) return;

    const registeredSlugs = getAllCalculatorSlugs();
    for (const relatedSlug of content.relatedCalculatorSlugs) {
      expect(registeredSlugs).toContain(relatedSlug);
    }
  });

  it("all related calculator slugs in mortgage content are registered", () => {
    const content = getCalculatorSeoContent("mortgage");
    expect(content).toBeDefined();
    if (!content) return;

    const registeredSlugs = getAllCalculatorSlugs();
    for (const relatedSlug of content.relatedCalculatorSlugs) {
      expect(registeredSlugs).toContain(relatedSlug);
    }
  });

  it("no calculator content references nonexistent slugs", () => {
    const registeredSlugs = getAllCalculatorSlugs();
    for (const slug of registeredSlugs) {
      const content = getCalculatorSeoContent(slug);
      if (!content) continue;

      for (const relatedSlug of content.relatedCalculatorSlugs) {
        const relatedCalculator = getCalculatorBySlug(relatedSlug);
        expect(relatedCalculator).toBeDefined();
      }
    }
  });
});

describe("Category links resolve correctly", () => {
  const categories = getAllCategories();

  it("has at least one category", () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  it("all categories have calculators", () => {
    for (const category of categories) {
      const categoryCalculators = getCalculatorsByCategory(category);
      expect(categoryCalculators.length).toBeGreaterThan(0);
    }
  });

  it("Savings category exists with compound-interest", () => {
    const savingsCalculators = getCalculatorsByCategory("Savings");
    expect(savingsCalculators.length).toBeGreaterThan(0);
    expect(savingsCalculators.some((c) => c.meta.slug === "compound-interest")).toBe(true);
  });

  it("Loans category exists with mortgage", () => {
    const loanCalculators = getCalculatorsByCategory("Loans");
    expect(loanCalculators.length).toBeGreaterThan(0);
    expect(loanCalculators.some((c) => c.meta.slug === "mortgage")).toBe(true);
  });
});

describe("No broken internal links in current route set", () => {
  const validRoutes = [
    "/",
    "/calculators",
    "/categories",
    "/guides",
    "/calculators/compound-interest",
    "/calculators/mortgage",
    "/calculators/loan",
  ];

  it("all calculator slugs generate valid routes", () => {
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      expect(validRoutes).toContain(`/calculators/${slug}`);
    }
  });

  it("breadcrumb items point to valid routes", () => {
    const calculator = getCalculatorBySlug("compound-interest");
    expect(calculator).toBeDefined();
    if (!calculator) return;

    const breadcrumbItems = [
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators" },
      { name: calculator.meta.title, path: `/calculators/${calculator.meta.slug}` },
    ];

    for (const item of breadcrumbItems) {
      expect(validRoutes).toContain(item.path);
    }
  });

  it("related calculator links point to valid routes", () => {
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      const content = getCalculatorSeoContent(slug);
      if (!content) continue;

      for (const relatedSlug of content.relatedCalculatorSlugs) {
        expect(validRoutes).toContain(`/calculators/${relatedSlug}`);
      }
    }
  });
});

describe("Search noindex", () => {
  it("search page has noindex metadata", async () => {
    const { generatePageMetadata } = await import("./seo");
    const metadata = generatePageMetadata(
      "Search",
      "Search MoneyMetric calculators and guides.",
      "/search",
      { noindex: true }
    );
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });
});

describe("Sitemap excludes search", () => {
  it("sitemap does not include search route", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    
    expect(urls.some((url) => url.includes("/search"))).toBe(false);
  });

  it("sitemap includes all published calculators", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      expect(urls.some((url) => url.includes(`/calculators/${slug}`))).toBe(true);
    }
  });

  it("sitemap includes main pages", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    
    expect(urls.some((url) => url.endsWith("moneymetric.com/"))).toBe(true);
    expect(urls.some((url) => url.includes("/calculators"))).toBe(true);
    expect(urls.some((url) => url.includes("/categories"))).toBe(true);
  });
});

describe("Breadcrumbs resolve correctly", () => {
  it("generateBreadcrumbSchema produces valid structure", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators" },
      { name: "Compound Interest Calculator", path: "/calculators/compound-interest" },
    ];

    const schema = generateBreadcrumbSchema(items);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
    expect(schema.itemListElement[2].position).toBe(3);
  });

  it("breadcrumb paths are valid routes", () => {
    const calculator = getCalculatorBySlug("mortgage");
    expect(calculator).toBeDefined();
    if (!calculator) return;

    const breadcrumbItems = [
      { name: "Home", path: "/" },
      { name: "Calculators", path: "/calculators" },
      { name: calculator.meta.title, path: `/calculators/${calculator.meta.slug}` },
    ];

    const schema = generateBreadcrumbSchema(breadcrumbItems);

    for (const item of schema.itemListElement) {
      expect(item.item).toMatch(/^https:\/\/moneymetric\.com\//);
    }
  });
});

describe("Invalid slugs remain notFound()", () => {
  it("getCalculatorBySlug returns undefined for invalid slug", () => {
    expect(getCalculatorBySlug("nonexistent")).toBeUndefined();
    expect(getCalculatorBySlug("")).toBeUndefined();
    expect(getCalculatorBySlug("search")).toBeUndefined();
  });

  it("getCalculatorSeoContent returns undefined for invalid slug", () => {
    expect(getCalculatorSeoContent("nonexistent")).toBeUndefined();
    expect(getCalculatorSeoContent("")).toBeUndefined();
  });
});

describe("No accidental query-parameter internal links", () => {
  it("calculator slugs do not contain query parameters", () => {
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      expect(slug).not.toContain("?");
      expect(slug).not.toContain("&");
      expect(slug).not.toContain("=");
    }
  });

  it("related calculator slugs do not contain query parameters", () => {
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      const content = getCalculatorSeoContent(slug);
      if (!content) continue;

      for (const relatedSlug of content.relatedCalculatorSlugs) {
        expect(relatedSlug).not.toContain("?");
        expect(relatedSlug).not.toContain("&");
        expect(relatedSlug).not.toContain("=");
      }
    }
  });
});

describe("Important calculator pages are reachable through internal navigation", () => {
  it("compound-interest is in the registry", () => {
    const calculator = getCalculatorBySlug("compound-interest");
    expect(calculator).toBeDefined();
  });

  it("mortgage is in the registry", () => {
    const calculator = getCalculatorBySlug("mortgage");
    expect(calculator).toBeDefined();
  });

  it("all calculators have valid category assignments", () => {
    const slugs = getAllCalculatorSlugs();
    for (const slug of slugs) {
      const calculator = getCalculatorBySlug(slug);
      expect(calculator?.meta.category).toBeTruthy();
    }
  });

  it("homepage would show all calculators (registry not empty)", () => {
    expect(calculatorRegistry.length).toBeGreaterThan(0);
  });

  it("calculators page would show all calculators (registry not empty)", () => {
    expect(calculatorRegistry.length).toBeGreaterThan(0);
  });
});