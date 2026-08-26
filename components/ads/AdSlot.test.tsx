import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { AdSlot } from "./AdSlot";

describe("AdSlot", () => {
  it("returns empty string when disabled (default)", () => {
    const html = renderToString(<AdSlot placement="top" />);
    expect(html).toBe("");
  });

  it("returns empty string when explicitly disabled", () => {
    const html = renderToString(<AdSlot placement="top" enabled={false} />);
    expect(html).toBe("");
  });

  it("renders placeholder when enabled", () => {
    const html = renderToString(<AdSlot placement="top" enabled={true} />);
    expect(html).toContain("Advertisement");
  });

  it("has correct ARIA attributes", () => {
    const html = renderToString(<AdSlot placement="after-result" enabled={true} />);
    expect(html).toContain('role="complementary"');
    expect(html).toContain('aria-label="Advertisement (after-result)"');
  });

  it("accepts custom label", () => {
    const html = renderToString(<AdSlot placement="bottom" enabled={true} label="Sponsored Content" />);
    expect(html).toContain('aria-label="Sponsored Content"');
  });

  it("has data-ad-placement attribute", () => {
    const html = renderToString(<AdSlot placement="sidebar" enabled={true} />);
    expect(html).toContain('data-ad-placement="sidebar"');
  });

  it("applies custom className", () => {
    const html = renderToString(<AdSlot placement="top" enabled={true} className="my-custom-class" />);
    expect(html).toContain("my-custom-class");
  });

  it("has ad-slot class", () => {
    const html = renderToString(<AdSlot placement="top" enabled={true} />);
    expect(html).toContain("ad-slot");
  });

  it("has position-specific class", () => {
    const html = renderToString(<AdSlot placement="after-result" enabled={true} />);
    expect(html).toContain("ad-slot--after-result");
  });
});