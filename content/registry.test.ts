import { describe, it, expect } from "vitest";
import { getCalculatorSeoContent } from "./registry";
import { calculatorRegistry } from "@/calculators/registry";

describe("Calculator SEO content registry", () => {
  it("returns content for compound-interest", () => {
    const content = getCalculatorSeoContent("compound-interest");
    expect(content).toBeDefined();
    expect(content?.slug).toBe("compound-interest");
  });

  it("returns content for mortgage", () => {
    const content = getCalculatorSeoContent("mortgage");
    expect(content).toBeDefined();
    expect(content?.slug).toBe("mortgage");
  });

  it("returns undefined for unknown slug", () => {
    const content = getCalculatorSeoContent("nonexistent-calculator");
    expect(content).toBeUndefined();
  });

  it("all required fields are present for compound-interest", () => {
    const content = getCalculatorSeoContent("compound-interest");
    expect(content).toBeDefined();
    if (!content) return;

    expect(content.intro).toBeTruthy();
    expect(content.howItWorks).toBeTruthy();
    expect(content.formula).toBeTruthy();
    expect(content.example).toBeTruthy();
    expect(content.interpretation).toBeTruthy();
    expect(content.assumptions).toBeTruthy();
    expect(Array.isArray(content.faqs)).toBe(true);
    expect(content.faqs.length).toBeGreaterThan(0);
    expect(Array.isArray(content.relatedCalculatorSlugs)).toBe(true);
  });

  it("all required fields are present for mortgage", () => {
    const content = getCalculatorSeoContent("mortgage");
    expect(content).toBeDefined();
    if (!content) return;

    expect(content.intro).toBeTruthy();
    expect(content.howItWorks).toBeTruthy();
    expect(content.formula).toBeTruthy();
    expect(content.example).toBeTruthy();
    expect(content.interpretation).toBeTruthy();
    expect(content.assumptions).toBeTruthy();
    expect(Array.isArray(content.faqs)).toBe(true);
    expect(content.faqs.length).toBeGreaterThan(0);
    expect(Array.isArray(content.relatedCalculatorSlugs)).toBe(true);
  });

  it("FAQ structure is valid for all content", () => {
    const slugs = ["compound-interest", "mortgage"];
    for (const slug of slugs) {
      const content = getCalculatorSeoContent(slug);
      expect(content).toBeDefined();
      if (!content) return;

      for (const faq of content.faqs) {
        expect(faq.question).toBeTruthy();
        expect(typeof faq.question).toBe("string");
        expect(faq.answer).toBeTruthy();
        expect(typeof faq.answer).toBe("string");
      }
    }
  });

  it("related calculator slugs only resolve to registered calculators", () => {
    const slugs = ["compound-interest", "mortgage"];
    const registeredSlugs = calculatorRegistry.map((c) => c.meta.slug);

    for (const slug of slugs) {
      const content = getCalculatorSeoContent(slug);
      expect(content).toBeDefined();
      if (!content) return;

      for (const relatedSlug of content.relatedCalculatorSlugs) {
        expect(registeredSlugs).toContain(relatedSlug);
      }
    }
  });

  it("content exists for all registered calculators", () => {
    for (const calculator of calculatorRegistry) {
      const content = getCalculatorSeoContent(calculator.meta.slug);
      expect(content).toBeDefined();
    }
  });

  it("no financial guarantee claims in content", () => {
    const slugs = ["compound-interest", "mortgage"];
    const guaranteePatterns = [
      /guaranteed returns/i,
      /will definitely/i,
      /promise returns/i,
      /certain to grow/i,
      /certain to increase/i,
    ];

    for (const slug of slugs) {
      const content = getCalculatorSeoContent(slug);
      expect(content).toBeDefined();
      if (!content) return;

      const allText = [
        content.intro,
        content.howItWorks,
        content.formula,
        content.example,
        content.interpretation,
        content.assumptions,
        ...content.faqs.map((f) => f.answer),
      ].join(" ");

      for (const pattern of guaranteePatterns) {
        expect(allText).not.toMatch(pattern);
      }
    }
  });
});