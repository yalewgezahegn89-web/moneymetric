import { describe, it, expect } from "vitest";
import {
  defaultMonetizationConfig,
  calculatorSafePlacements,
  contentSafePlacements,
  calculatorUnsafePlacements,
  isCalculatorSafePlacement,
  isContentSafePlacement,
} from "./monetization";

describe("monetization config", () => {
  it("ads are disabled by default", () => {
    expect(defaultMonetizationConfig.adsEnabled).toBe(false);
  });

  it("has all required placements", () => {
    const placements = Object.keys(defaultMonetizationConfig.placements);
    expect(placements).toContain("top");
    expect(placements).toContain("after-result");
    expect(placements).toContain("content-middle");
    expect(placements).toContain("sidebar");
    expect(placements).toContain("bottom");
  });

  it("sidebar is disabled on mobile", () => {
    expect(defaultMonetizationConfig.placements.sidebar.responsive.mobile).toBe(false);
  });

  it("sidebar is enabled on tablet and desktop", () => {
    expect(defaultMonetizationConfig.placements.sidebar.responsive.tablet).toBe(true);
    expect(defaultMonetizationConfig.placements.sidebar.responsive.desktop).toBe(true);
  });
});

describe("placement types", () => {
  it("calculator safe placements are valid", () => {
    for (const placement of calculatorSafePlacements) {
      expect(typeof placement).toBe("string");
    }
  });

  it("content safe placements are valid", () => {
    for (const placement of contentSafePlacements) {
      expect(typeof placement).toBe("string");
    }
  });

  it("calculator unsafe placements are valid", () => {
    for (const placement of calculatorUnsafePlacements) {
      expect(typeof placement).toBe("string");
    }
  });
});

describe("isCalculatorSafePlacement", () => {
  it("returns true for after-result", () => {
    expect(isCalculatorSafePlacement("after-result")).toBe(true);
  });

  it("returns true for bottom", () => {
    expect(isCalculatorSafePlacement("bottom")).toBe(true);
  });

  it("returns false for top", () => {
    expect(isCalculatorSafePlacement("top")).toBe(false);
  });

  it("returns false for content-middle", () => {
    expect(isCalculatorSafePlacement("content-middle")).toBe(false);
  });

  it("returns false for sidebar", () => {
    expect(isCalculatorSafePlacement("sidebar")).toBe(false);
  });
});

describe("isContentSafePlacement", () => {
  it("returns true for content-middle", () => {
    expect(isContentSafePlacement("content-middle")).toBe(true);
  });

  it("returns true for bottom", () => {
    expect(isContentSafePlacement("bottom")).toBe(true);
  });

  it("returns true for sidebar", () => {
    expect(isContentSafePlacement("sidebar")).toBe(true);
  });

  it("returns false for top", () => {
    expect(isContentSafePlacement("top")).toBe(false);
  });

  it("returns false for after-result", () => {
    expect(isContentSafePlacement("after-result")).toBe(false);
  });
});

describe("calculator unsafe placements", () => {
  it("top is marked as calculator unsafe", () => {
    expect(calculatorUnsafePlacements).toContain("top");
  });

  it("does not include after-result", () => {
    expect(calculatorUnsafePlacements).not.toContain("after-result");
  });

  it("does not include bottom", () => {
    expect(calculatorUnsafePlacements).not.toContain("bottom");
  });
});