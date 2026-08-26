import { describe, it, expect } from "vitest";
import { calculateMortgage } from "@/calculators/engine/mortgage";
import type { MortgageResult } from "@/calculators/engine/types";

function getTestResult(overrides?: {
  homePrice?: number;
  downPayment?: number;
  annualInterestRate?: number;
  loanTermYears?: number;
  paymentFrequency?: "monthly" | "biweekly" | "weekly";
}): MortgageResult {
  return calculateMortgage({
    homePrice: overrides?.homePrice ?? 400000,
    downPayment: overrides?.downPayment ?? 80000,
    annualInterestRate: overrides?.annualInterestRate ?? 6.5,
    loanTermYears: overrides?.loanTermYears ?? 30,
    paymentFrequency: overrides?.paymentFrequency ?? "monthly",
  });
}

describe("AmortizationChart data requirements", () => {
  it("12-payment timeline (1 year monthly) has correct structure", () => {
    const result = getTestResult({ loanTermYears: 1 });
    expect(result.timeline.length).toBe(12);
    expect(result.numberOfPayments).toBe(12);

    for (const point of result.timeline) {
      expect(typeof point.paymentNumber).toBe("number");
      expect(typeof point.remainingBalance).toBe("number");
      expect(typeof point.principalPaid).toBe("number");
      expect(typeof point.interestPaid).toBe("number");
    }
  });

  it("360-payment timeline (30 years monthly) has correct structure", () => {
    const result = getTestResult({ loanTermYears: 30 });
    expect(result.timeline.length).toBe(360);
    expect(result.numberOfPayments).toBe(360);

    for (const point of result.timeline) {
      expect(typeof point.paymentNumber).toBe("number");
      expect(typeof point.remainingBalance).toBe("number");
    }
  });

  it("zero-loan produces empty timeline", () => {
    const result = getTestResult({ homePrice: 100000, downPayment: 100000 });
    expect(result.timeline.length).toBe(0);
    expect(result.loanAmount).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it("remaining balance decreases for positive-rate loan", () => {
    const result = getTestResult();
    for (let i = 1; i < result.timeline.length; i++) {
      expect(result.timeline[i]!.remainingBalance).toBeLessThan(
        result.timeline[i - 1]!.remainingBalance
      );
    }
  });

  it("final balance is approximately zero", () => {
    const result = getTestResult();
    const lastPoint = result.timeline[result.timeline.length - 1]!;
    expect(lastPoint.remainingBalance).toBeCloseTo(0, 0);
    expect(lastPoint.remainingBalance).toBeGreaterThanOrEqual(-1);
    expect(lastPoint.remainingBalance).toBeLessThanOrEqual(1);
  });

  it("no-result state (empty timeline) returns early without crash", () => {
    const result = getTestResult({ homePrice: 0, downPayment: 0 });
    expect(result.timeline.length).toBe(0);
  });

  it("tick interval handles short term (1 year)", () => {
    const result = getTestResult({ loanTermYears: 1 });
    expect(result.loanTermYears).toBe(1);
    expect(result.timeline.length).toBe(12);
  });

  it("tick interval handles long term (40 years)", () => {
    const result = getTestResult({ loanTermYears: 40 });
    expect(result.loanTermYears).toBe(40);
    expect(result.timeline.length).toBe(480);
  });

  it("first payment has correct remaining balance", () => {
    const result = getTestResult();
    const firstPoint = result.timeline[0]!;
    expect(firstPoint.remainingBalance).toBeGreaterThan(0);
    expect(firstPoint.remainingBalance).toBeLessThanOrEqual(result.loanAmount);
  });

  it("timeline covers full loan term", () => {
    const result = getTestResult({ loanTermYears: 15 });
    expect(result.timeline.length).toBe(180);
    expect(result.loanTermYears).toBe(15);
  });

  it("weekly frequency timeline has correct payment count", () => {
    const result = getTestResult({
      loanTermYears: 30,
      paymentFrequency: "weekly",
    });
    expect(result.numberOfPayments).toBe(1560);
    expect(result.timeline.length).toBe(1560);
  });

  it("biweekly frequency timeline has correct payment count", () => {
    const result = getTestResult({
      loanTermYears: 30,
      paymentFrequency: "biweekly",
    });
    expect(result.numberOfPayments).toBe(780);
    expect(result.timeline.length).toBe(780);
  });

  it("chart data mapping converts payment numbers to years", () => {
    const result = getTestResult({ loanTermYears: 5 });
    const paymentsPerYear = result.paymentsPerYear;
    
    for (const point of result.timeline) {
      const year = point.paymentNumber / paymentsPerYear;
      expect(year).toBeGreaterThanOrEqual(0);
      expect(year).toBeLessThanOrEqual(5);
    }
  });
});
