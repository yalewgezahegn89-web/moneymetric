import { describe, it, expect } from "vitest";
import {
  calculatorRegistry,
  getCalculatorBySlug,
  getCalculatorsByCategory,
  getAllCalculatorSlugs,
  getAllCategories,
} from "./registry";

describe("calculatorRegistry", () => {
  it("contains at least one calculator", () => {
    expect(calculatorRegistry.length).toBeGreaterThanOrEqual(1);
  });

  it("each calculator has a unique slug", () => {
    const slugs = calculatorRegistry.map((c) => c.meta.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(slugs.length);
  });
});

describe("getCalculatorBySlug", () => {
  it("returns compound-interest calculator", () => {
    const calc = getCalculatorBySlug("compound-interest");
    expect(calc).toBeDefined();
    expect(calc?.meta.title).toBe("Compound Interest Calculator");
    expect(calc?.meta.slug).toBe("compound-interest");
  });

  it("returns mortgage calculator", () => {
    const calc = getCalculatorBySlug("mortgage");
    expect(calc).toBeDefined();
    expect(calc?.meta.title).toBe("Mortgage Calculator");
    expect(calc?.meta.slug).toBe("mortgage");
  });

  it("returns undefined for unknown slug", () => {
    const calc = getCalculatorBySlug("nonexistent-calculator");
    expect(calc).toBeUndefined();
  });
});

describe("getCalculatorsByCategory", () => {
  it("returns calculators in Savings category", () => {
    const calcs = getCalculatorsByCategory("Savings");
    expect(calcs.length).toBeGreaterThanOrEqual(1);
    expect(calcs.every((c) => c.meta.category === "Savings")).toBe(true);
  });

  it("returns calculators in Loans category", () => {
    const calcs = getCalculatorsByCategory("Loans");
    expect(calcs.length).toBeGreaterThanOrEqual(1);
    expect(calcs.every((c) => c.meta.category === "Loans")).toBe(true);
  });

  it("returns empty array for unknown category", () => {
    const calcs = getCalculatorsByCategory("NonexistentCategory");
    expect(calcs).toHaveLength(0);
  });
});

describe("getAllCalculatorSlugs", () => {
  it("includes compound-interest", () => {
    const slugs = getAllCalculatorSlugs();
    expect(slugs).toContain("compound-interest");
  });

  it("includes mortgage", () => {
    const slugs = getAllCalculatorSlugs();
    expect(slugs).toContain("mortgage");
  });
});

describe("getAllCategories", () => {
  it("includes Savings", () => {
    const categories = getAllCategories();
    expect(categories).toContain("Savings");
  });

  it("includes Loans", () => {
    const categories = getAllCategories();
    expect(categories).toContain("Loans");
  });
});

describe("compound-interest calculator definition", () => {
  const calc = getCalculatorBySlug("compound-interest")!;

  it("has required metadata fields", () => {
    expect(calc.meta.title).toBeTruthy();
    expect(calc.meta.description).toBeTruthy();
    expect(calc.meta.slug).toBeTruthy();
    expect(calc.meta.category).toBeTruthy();
    expect(Array.isArray(calc.meta.keywords)).toBe(true);
  });

  it("has inputs array", () => {
    expect(Array.isArray(calc.inputs)).toBe(true);
    expect(calc.inputs.length).toBe(6);
  });

  it("has supported countries", () => {
    expect(Array.isArray(calc.supportedCountries)).toBe(true);
    expect(calc.supportedCountries).toContain("US");
  });

  it("has a calculate function", () => {
    expect(typeof calc.calculate).toBe("function");
  });

  it("calculate returns correct structure", () => {
    const results = calc.calculate({
      initialInvestment: 10000,
      regularContribution: 500,
      contributionFrequency: "monthly",
      annualInterestRate: 7,
      compoundingFrequency: "monthly",
      investmentYears: 10,
    }, "US");

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    for (const r of results) {
      expect(typeof r.label).toBe("string");
      expect(typeof r.value).toBe("number");
      expect(r.field).toBeDefined();
      expect(typeof r.field.name).toBe("string");
    }
  });

  it("calculate produces positive future value for positive inputs", () => {
    const results = calc.calculate({
      initialInvestment: 10000,
      regularContribution: 500,
      contributionFrequency: "monthly",
      annualInterestRate: 7,
      compoundingFrequency: "monthly",
      investmentYears: 10,
    }, "US");

    const futureValue = results.find((r) => r.label === "Future Value");
    expect(futureValue).toBeDefined();
    expect(futureValue!.value).toBeGreaterThan(10000);
  });
});

describe("mortgage calculator definition", () => {
  const calc = getCalculatorBySlug("mortgage")!;

  it("has required metadata fields", () => {
    expect(calc.meta.title).toBeTruthy();
    expect(calc.meta.description).toBeTruthy();
    expect(calc.meta.slug).toBe("mortgage");
    expect(calc.meta.category).toBe("Loans");
    expect(Array.isArray(calc.meta.keywords)).toBe(true);
  });

  it("has 5 inputs", () => {
    expect(Array.isArray(calc.inputs)).toBe(true);
    expect(calc.inputs.length).toBe(5);
  });

  it("has supported countries", () => {
    expect(Array.isArray(calc.supportedCountries)).toBe(true);
    expect(calc.supportedCountries).toContain("US");
  });

  it("has a calculate function", () => {
    expect(typeof calc.calculate).toBe("function");
  });

  it("calculate returns correct structure for reference scenario", () => {
    const results = calc.calculate({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "monthly",
    }, "US");

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(5);

    for (const r of results) {
      expect(typeof r.label).toBe("string");
      expect(typeof r.value).toBe("number");
      expect(r.field).toBeDefined();
      expect(typeof r.field.name).toBe("string");
    }
  });

  it("calculate produces correct reference payment", () => {
    const results = calc.calculate({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "monthly",
    }, "US");

    const payment = results.find((r) => r.field.name === "regularPayment");
    expect(payment).toBeDefined();
    expect(payment!.value).toBeCloseTo(2022.62, 0);
  });

  it("calculate produces zero-loan result when down payment equals home price", () => {
    const results = calc.calculate({
      homePrice: 400000,
      downPayment: 400000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "monthly",
    }, "US");

    const payment = results.find((r) => r.field.name === "regularPayment");
    expect(payment).toBeDefined();
    expect(payment!.value).toBe(0);
  });

  it("calculate produces correct frequency labels", () => {
    const monthly = calc.calculate({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "monthly",
    }, "US");
    const monthlyPayment = monthly.find((r) => r.field.name === "regularPayment");
    expect(monthlyPayment!.field.suffix).toContain("month");

    const biweekly = calc.calculate({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "biweekly",
    }, "US");
    const biweeklyPayment = biweekly.find((r) => r.field.name === "regularPayment");
    expect(biweeklyPayment!.field.suffix).toContain("biweekly");

    const weekly = calc.calculate({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      loanTermYears: 30,
      paymentFrequency: "weekly",
    }, "US");
    const weeklyPayment = weekly.find((r) => r.field.name === "regularPayment");
    expect(weeklyPayment!.field.suffix).toContain("week");
  });
});
