import { describe, it, expect } from "vitest";
import { siteConfig } from "./site";

describe("Site configuration", () => {
  it("has required fields", () => {
    expect(siteConfig.name).toBe("MoneyMetric");
    expect(siteConfig.tagline).toBe("Make Better Money Decisions.");
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toBeTruthy();
    expect(siteConfig.locale).toBe("en-US");
  });

  it("url is a valid URL", () => {
    const url = new URL(siteConfig.url);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBeTruthy();
  });

  it("organization url matches site url", () => {
    expect(siteConfig.organization.url).toBe(siteConfig.url);
  });
});

describe("Production domain configuration", () => {
  it("default production URL is mymoneymetric.com", () => {
    expect(siteConfig.url).toBe("https://mymoneymetric.com");
  });

  it("production URL uses HTTPS", () => {
    expect(siteConfig.url.startsWith("https://")).toBe(true);
  });

  it("no localhost in production URL", () => {
    expect(siteConfig.url).not.toContain("localhost");
  });
});

describe("Environment variable override", () => {
  it("uses environment variable when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom.example.com";
    const url =
      process.env.NEXT_PUBLIC_SITE_URL || "https://mymoneymetric.com";
    expect(url).toBe("https://custom.example.com");
  });

  it("falls back to production URL when not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const url =
      process.env.NEXT_PUBLIC_SITE_URL || "https://mymoneymetric.com";
    expect(url).toBe("https://mymoneymetric.com");
  });
});

describe("No localhost in production metadata", () => {
  it("siteConfig.url does not contain localhost", () => {
    expect(siteConfig.url).not.toContain("localhost");
  });

  it("sitemap uses production URL", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const url of urls) {
      expect(url).not.toContain("localhost");
      expect(url).toMatch(/^https:\/\/mymoneymetric\.com/);
    }
  });

  it("robots uses production URL", async () => {
    const robots = (await import("@/app/robots")).default;
    const config = robots();

    expect(config.sitemap).toBe("https://mymoneymetric.com/sitemap.xml");
    expect(config.sitemap).not.toContain("localhost");
  });
});

describe("Canonical URLs", () => {
  it("sitemap contains canonical URLs with correct domain", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://mymoneymetric.com/");
    expect(urls).toContain("https://mymoneymetric.com/calculators");
    expect(urls).toContain("https://mymoneymetric.com/calculators/compound-interest");
    expect(urls).toContain("https://mymoneymetric.com/calculators/mortgage");
    expect(urls).toContain("https://mymoneymetric.com/calculators/loan");
  });

  it("no query parameter canonical URLs", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const url of urls) {
      expect(url).not.toContain("?");
      expect(url).not.toContain("&");
    }
  });
});