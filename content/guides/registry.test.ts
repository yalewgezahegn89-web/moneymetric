import { describe, it, expect } from "vitest";
import {
  getGuideBySlug,
  getAllGuideSlugs,
  getAllGuides,
} from "./registry";
import { getCalculatorBySlug } from "@/calculators/registry";

describe("Guide registry lookup", () => {
  it("returns guide for compound-interest", () => {
    const guide = getGuideBySlug("how-compound-interest-works");
    expect(guide).toBeDefined();
    expect(guide?.slug).toBe("how-compound-interest-works");
  });

  it("returns guide for mortgage-amortization", () => {
    const guide = getGuideBySlug("how-mortgage-amortization-works");
    expect(guide).toBeDefined();
    expect(guide?.slug).toBe("how-mortgage-amortization-works");
  });

  it("returns undefined for unknown slug", () => {
    expect(getGuideBySlug("nonexistent")).toBeUndefined();
    expect(getGuideBySlug("")).toBeUndefined();
  });
});

describe("Both guides exist", () => {
  const slugs = getAllGuideSlugs();

  it("has at least two guides", () => {
    expect(slugs.length).toBeGreaterThanOrEqual(2);
  });

  it("includes compound interest guide", () => {
    expect(slugs).toContain("how-compound-interest-works");
  });

  it("includes mortgage amortization guide", () => {
    expect(slugs).toContain("how-mortgage-amortization-works");
  });
});

describe("Guide required fields exist", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    describe(`${guide.slug}`, () => {
      it("has title", () => {
        expect(guide.title).toBeTruthy();
      });

      it("has description", () => {
        expect(guide.description).toBeTruthy();
      });

      it("has category", () => {
        expect(guide.category).toBeTruthy();
      });

      it("has relatedCalculatorSlug", () => {
        expect(guide.relatedCalculatorSlug).toBeTruthy();
      });

      it("has intro", () => {
        expect(guide.intro).toBeTruthy();
      });

      it("has sections", () => {
        expect(guide.sections.length).toBeGreaterThan(0);
      });

      it("has sections with headings and paragraphs", () => {
        for (const section of guide.sections) {
          expect(section.heading).toBeTruthy();
          expect(section.paragraphs.length).toBeGreaterThan(0);
        }
      });

      it("has faqs", () => {
        expect(guide.faqs.length).toBeGreaterThan(0);
      });

      it("has faqs with question and answer", () => {
        for (const faq of guide.faqs) {
          expect(faq.question).toBeTruthy();
          expect(faq.answer).toBeTruthy();
        }
      });

      it("has lastUpdated", () => {
        expect(guide.lastUpdated).toBeTruthy();
      });
    });
  }
});

describe("Related calculator slug resolves", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    it(`${guide.slug} links to a registered calculator`, () => {
      const calculator = getCalculatorBySlug(guide.relatedCalculatorSlug);
      expect(calculator).toBeDefined();
    });
  }
});

describe("Guide route resolves", () => {
  const slugs = getAllGuideSlugs();

  it("all guide slugs are URL-safe", () => {
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("compound interest guide has valid route", () => {
    const guide = getGuideBySlug("how-compound-interest-works");
    expect(guide).toBeDefined();
  });

  it("mortgage amortization guide has valid route", () => {
    const guide = getGuideBySlug("how-mortgage-amortization-works");
    expect(guide).toBeDefined();
  });
});

describe("Unknown guide returns notFound behavior", () => {
  it("getGuideBySlug returns undefined for nonexistent guide", () => {
    expect(getGuideBySlug("nonexistent-guide")).toBeUndefined();
    expect(getGuideBySlug("search")).toBeUndefined();
    expect(getGuideBySlug("calculators")).toBeUndefined();
  });
});

describe("Guide metadata", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    it(`${guide.slug} has title and description for metadata`, () => {
      expect(guide.title.length).toBeGreaterThan(0);
      expect(guide.title.length).toBeLessThan(100);
      expect(guide.description.length).toBeGreaterThan(0);
      expect(guide.description.length).toBeLessThan(200);
    });
  }
});

describe("Guide canonical", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    it(`${guide.slug} has a valid slug for canonical URL`, () => {
      expect(guide.slug).toBeTruthy();
      expect(guide.slug).not.toContain(" ");
      expect(guide.slug).not.toContain("?");
    });
  }
});

describe("Guide sitemap inclusion", () => {
  it("all guides would be included in sitemap", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    const guides = getAllGuides();
    for (const guide of guides) {
      expect(urls.some((url) => url.includes(`/guides/${guide.slug}`))).toBe(true);
    }
  });
});

describe("Search remains excluded", () => {
  it("sitemap does not include search route", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/search"))).toBe(false);
  });
});

describe("Calculator → guide links are valid", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    it(`${guide.slug} links to a valid calculator`, () => {
      const calculator = getCalculatorBySlug(guide.relatedCalculatorSlug);
      expect(calculator).toBeDefined();
      expect(calculator?.meta.slug).toBe(guide.relatedCalculatorSlug);
    });
  }
});

describe("Guide → calculator links are valid", () => {
  const guides = getAllGuides();

  for (const guide of guides) {
    it(`${guide.slug} has valid relatedCalculatorSlug`, () => {
      expect(typeof guide.relatedCalculatorSlug).toBe("string");
      expect(guide.relatedCalculatorSlug.length).toBeGreaterThan(0);
    });
  }
});

describe("No orphaned current guides", () => {
  it("all guides are reachable through /guides", () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThan(0);

    for (const guide of guides) {
      expect(guide.slug).toBeTruthy();
      expect(getGuideBySlug(guide.slug)).toBeDefined();
    }
  });

  it("guides listing page would show all guides", () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThan(0);
  });
});

describe("Calculator content has related guide slugs", () => {
  it("compound interest content has related guide", async () => {
    const { getCalculatorSeoContent } = await import("@/content/registry");
    const content = getCalculatorSeoContent("compound-interest");
    expect(content).toBeDefined();
    expect(content?.relatedGuideSlugs).toContain("how-compound-interest-works");
  });

  it("mortgage content has related guide", async () => {
    const { getCalculatorSeoContent } = await import("@/content/registry");
    const content = getCalculatorSeoContent("mortgage");
    expect(content).toBeDefined();
    expect(content?.relatedGuideSlugs).toContain("how-mortgage-amortization-works");
  });
});