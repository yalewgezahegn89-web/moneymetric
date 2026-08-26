import { describe, it, expect } from "vitest";
import {
  generateCalculatorMetadata,
  generatePageMetadata,
  generateBreadcrumbSchema,
} from "./seo";
import { calculatorRegistry } from "@/calculators/registry";
import { siteConfig } from "@/config/site";

describe("SEO utilities", () => {
  describe("generateCalculatorMetadata", () => {
    it("generates correct metadata for calculator", () => {
      const calculator = calculatorRegistry[0];
      if (!calculator) return;

      const metadata = generateCalculatorMetadata(calculator.meta);

      expect(metadata.title).toBe(calculator.meta.title);
      expect(metadata.description).toBe(calculator.meta.description);
      expect(metadata.keywords).toEqual(calculator.meta.keywords);
      expect(metadata.alternates?.canonical).toBe(
        `/calculators/${calculator.meta.slug}`
      );
    });

    it("includes Open Graph metadata", () => {
      const calculator = calculatorRegistry[0];
      if (!calculator) return;

      const metadata = generateCalculatorMetadata(calculator.meta);

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.siteName).toBe(siteConfig.name);
    });

    it("includes Twitter metadata", () => {
      const calculator = calculatorRegistry[0];
      if (!calculator) return;

      const metadata = generateCalculatorMetadata(calculator.meta);

      expect(metadata.twitter).toBeDefined();
    });

    it("generates metadata for all registered calculators", () => {
      for (const calculator of calculatorRegistry) {
        const metadata = generateCalculatorMetadata(calculator.meta);

        expect(metadata.title).toBe(calculator.meta.title);
        expect(metadata.description).toBe(calculator.meta.description);
        expect(metadata.alternates?.canonical).toBe(
          `/calculators/${calculator.meta.slug}`
        );
      }
    });
  });

  describe("generatePageMetadata", () => {
    it("generates correct metadata for page", () => {
      const metadata = generatePageMetadata(
        "Test Page",
        "Test description",
        "/test"
      );

      expect(metadata.title).toBe("Test Page");
      expect(metadata.description).toBe("Test description");
      expect(metadata.alternates?.canonical).toBe("/test");
    });

    it("includes Open Graph metadata", () => {
      const metadata = generatePageMetadata(
        "Test Page",
        "Test description",
        "/test"
      );

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe("Test Page | MoneyMetric");
      expect(metadata.openGraph?.siteName).toBe(siteConfig.name);
    });

    it("sets noindex when specified", () => {
      const metadata = generatePageMetadata(
        "Search",
        "Search description",
        "/search",
        { noindex: true }
      );

      expect(metadata.robots).toEqual({ index: false, follow: true });
    });

    it("does not set robots by default", () => {
      const metadata = generatePageMetadata(
        "Test Page",
        "Test description",
        "/test"
      );

      expect(metadata.robots).toBeUndefined();
    });
  });

  describe("generateBreadcrumbSchema", () => {
    it("generates valid BreadcrumbList schema", () => {
      const items = [
        { name: "Home", path: "/" },
        { name: "Calculators", path: "/calculators" },
        { name: "Test Calculator", path: "/calculators/test" },
      ];

      const schema = generateBreadcrumbSchema(items);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(3);
    });

    it("assigns correct positions", () => {
      const items = [
        { name: "Home", path: "/" },
        { name: "Calculators", path: "/calculators" },
      ];

      const schema = generateBreadcrumbSchema(items);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
    });

    it("builds correct item URLs", () => {
      const items = [{ name: "Home", path: "/" }];

      const schema = generateBreadcrumbSchema(items);

      expect(schema.itemListElement[0].item).toBe(`${siteConfig.url}/`);
    });
  });
});

describe("Calculator registry", () => {
  it("has calculators registered", () => {
    expect(calculatorRegistry.length).toBeGreaterThan(0);
  });

  it("all calculators have required meta fields", () => {
    for (const calculator of calculatorRegistry) {
      expect(calculator.meta.title).toBeTruthy();
      expect(calculator.meta.description).toBeTruthy();
      expect(calculator.meta.slug).toBeTruthy();
      expect(calculator.meta.category).toBeTruthy();
    }
  });

  it("all calculator slugs are URL-safe", () => {
    for (const calculator of calculatorRegistry) {
      expect(calculator.meta.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe("Site config", () => {
  it("has required SEO fields", () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
    expect(siteConfig.locale).toBeTruthy();
  });

  it("has valid URL format", () => {
    expect(siteConfig.url).toMatch(/^https?:\/\//);
  });
});