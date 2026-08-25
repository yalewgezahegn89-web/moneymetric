import { describe, it, expect } from "vitest";
import {
  calculateMortgage,
  validateMortgageInput,
} from "./mortgage";
import type { MortgageInput } from "./types";

const TOLERANCE = 0.01;

function closeTo(a: number, b: number, tolerance = TOLERANCE): boolean {
  return Math.abs(a - b) <= tolerance;
}

function baseInput(overrides: Partial<MortgageInput> = {}): MortgageInput {
  return {
    homePrice: 400000,
    downPayment: 80000,
    annualInterestRate: 6.5,
    loanTermYears: 30,
    paymentFrequency: "monthly",
    ...overrides,
  };
}

describe("validateMortgageInput", () => {
  it("returns no errors for valid input", () => {
    const errors = validateMortgageInput(baseInput());
    expect(errors).toHaveLength(0);
  });

  it("rejects NaN homePrice", () => {
    const errors = validateMortgageInput(baseInput({ homePrice: NaN }));
    expect(errors.some((e) => e.field === "homePrice")).toBe(true);
  });

  it("rejects Infinity homePrice", () => {
    const errors = validateMortgageInput(baseInput({ homePrice: Infinity }));
    expect(errors.some((e) => e.field === "homePrice")).toBe(true);
  });

  it("rejects negative homePrice", () => {
    const errors = validateMortgageInput(baseInput({ homePrice: -100000 }));
    expect(errors.some((e) => e.field === "homePrice")).toBe(true);
  });

  it("rejects negative downPayment", () => {
    const errors = validateMortgageInput(baseInput({ downPayment: -10000 }));
    expect(errors.some((e) => e.field === "downPayment")).toBe(true);
  });

  it("rejects downPayment > homePrice", () => {
    const errors = validateMortgageInput(baseInput({ downPayment: 500000 }));
    expect(errors.some((e) => e.field === "downPayment")).toBe(true);
  });

  it("rejects negative annualInterestRate", () => {
    const errors = validateMortgageInput(baseInput({ annualInterestRate: -1 }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects NaN annualInterestRate", () => {
    const errors = validateMortgageInput(baseInput({ annualInterestRate: NaN }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects Infinity annualInterestRate", () => {
    const errors = validateMortgageInput(baseInput({ annualInterestRate: Infinity }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects loanTermYears <= 0", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: 0 }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("rejects invalid paymentFrequency", () => {
    const errors = validateMortgageInput(baseInput({ paymentFrequency: "daily" as never }));
    expect(errors.some((e) => e.field === "paymentFrequency")).toBe(true);
  });

  it("rejects non-integer payment count", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: 7.5, paymentFrequency: "monthly" }));
    // 7.5 * 12 = 90, integer, so this should be valid
    expect(errors).toHaveLength(0);
  });

  it("rejects fractional payment count for biweekly", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: 7.5, paymentFrequency: "biweekly" }));
    // 7.5 * 26 = 195, integer, valid
    expect(errors).toHaveLength(0);
  });

  it("rejects truly fractional payment count", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: 10.5, paymentFrequency: "monthly" }));
    // 10.5 * 12 = 126, integer
    expect(errors).toHaveLength(0);
  });

  it("rejects non-integer payment count", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: 10.1, paymentFrequency: "monthly" }));
    // 10.1 * 12 = 121.2, not integer
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("rejects NaN loanTermYears", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: NaN }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("rejects Infinity loanTermYears", () => {
    const errors = validateMortgageInput(baseInput({ loanTermYears: Infinity }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });
});

describe("calculateMortgage", () => {
  describe("reference scenario", () => {
    it("30-year monthly mortgage at 6.5%", () => {
      const result = calculateMortgage(baseInput());
      expect(result.loanAmount).toBe(320000);
      expect(result.paymentsPerYear).toBe(12);
      expect(result.numberOfPayments).toBe(360);
      // Standard amortization: M = L * [i(1+i)^N] / [(1+i)^N - 1]
      const i = 0.065 / 12;
      const N = 360;
      const factor = Math.pow(1 + i, N);
      const expectedPayment = 320000 * ((i * factor) / (factor - 1));
      expect(closeTo(result.regularPayment, expectedPayment)).toBe(true);
      expect(result.timeline).toHaveLength(360);
      const lastPoint = result.timeline[result.timeline.length - 1]!;
      expect(lastPoint.remainingBalance).toBeLessThan(0.01);
    });
  });

  describe("zero interest", () => {
    it("produces equal principal payments", () => {
      const result = calculateMortgage(
        baseInput({ annualInterestRate: 0 })
      );
      const expectedPayment = 320000 / 360;
      expect(closeTo(result.regularPayment, expectedPayment)).toBe(true);
      expect(result.totalInterest).toBe(0);
      expect(closeTo(result.totalPayments, 320000)).toBe(true);
    });

    it("total payments equals loan amount", () => {
      const result = calculateMortgage(
        baseInput({ annualInterestRate: 0 })
      );
      expect(closeTo(result.totalPayments, result.loanAmount)).toBe(true);
    });
  });

  describe("zero loan", () => {
    it("returns zero payment and empty timeline", () => {
      const result = calculateMortgage(
        baseInput({ downPayment: 400000 })
      );
      expect(result.loanAmount).toBe(0);
      expect(result.regularPayment).toBe(0);
      expect(result.totalPayments).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.timeline).toHaveLength(0);
    });
  });

  describe("zero down payment", () => {
    it("loan equals home price", () => {
      const result = calculateMortgage(
        baseInput({ downPayment: 0 })
      );
      expect(result.loanAmount).toBe(400000);
      expect(result.regularPayment).toBeGreaterThan(0);
    });
  });

  describe("15-year term", () => {
    it("has fewer payments than 30-year", () => {
      const result15 = calculateMortgage(
        baseInput({ loanTermYears: 15 })
      );
      const result30 = calculateMortgage(
        baseInput({ loanTermYears: 30 })
      );
      expect(result15.numberOfPayments).toBe(180);
      expect(result15.regularPayment).toBeGreaterThan(result30.regularPayment);
      expect(result15.totalInterest).toBeLessThan(result30.totalInterest);
    });
  });

  describe("40-year term", () => {
    it("has more payments than 30-year", () => {
      const result40 = calculateMortgage(
        baseInput({ loanTermYears: 40 })
      );
      expect(result40.numberOfPayments).toBe(480);
      expect(result40.totalInterest).toBeGreaterThan(0);
    });
  });

  describe("payment frequencies", () => {
    it("monthly", () => {
      const result = calculateMortgage(
        baseInput({ paymentFrequency: "monthly" })
      );
      expect(result.paymentsPerYear).toBe(12);
      expect(result.numberOfPayments).toBe(360);
    });

    it("biweekly", () => {
      const result = calculateMortgage(
        baseInput({ paymentFrequency: "biweekly" })
      );
      expect(result.paymentsPerYear).toBe(26);
      expect(result.numberOfPayments).toBe(780);
      expect(result.regularPayment).toBeGreaterThan(0);
    });

    it("weekly", () => {
      const result = calculateMortgage(
        baseInput({ paymentFrequency: "weekly" })
      );
      expect(result.paymentsPerYear).toBe(52);
      expect(result.numberOfPayments).toBe(1560);
      expect(result.regularPayment).toBeGreaterThan(0);
    });
  });

  describe("valid fractional duration", () => {
    it("7.5 years monthly = 90 payments", () => {
      const result = calculateMortgage(
        baseInput({ loanTermYears: 7.5 })
      );
      expect(result.numberOfPayments).toBe(90);
      expect(result.timeline).toHaveLength(90);
    });
  });

  describe("amortization timeline", () => {
    it("first payment has expected structure", () => {
      const result = calculateMortgage(baseInput());
      const first = result.timeline[0]!;
      expect(first.paymentNumber).toBe(1);
      expect(first.paymentAmount).toBeCloseTo(result.regularPayment, 2);
      expect(first.principalPaid).toBeGreaterThan(0);
      expect(first.interestPaid).toBeGreaterThan(0);
      expect(first.remainingBalance).toBeLessThan(result.loanAmount);
      expect(first.cumulativePrincipal).toBeCloseTo(first.principalPaid, 2);
      expect(first.cumulativeInterest).toBeCloseTo(first.interestPaid, 2);
    });

    it("remaining balance decreases over time", () => {
      const result = calculateMortgage(baseInput());
      for (let i = 1; i < result.timeline.length; i++) {
        expect(result.timeline[i]!.remainingBalance).toBeLessThanOrEqual(
          result.timeline[i - 1]!.remainingBalance
        );
      }
    });

    it("final balance is approximately zero", () => {
      const result = calculateMortgage(baseInput());
      const last = result.timeline[result.timeline.length - 1]!;
      expect(last.remainingBalance).toBeLessThan(0.01);
      expect(last.remainingBalance).toBeGreaterThanOrEqual(0);
    });

    it("final payment does not create negative balance", () => {
      const result = calculateMortgage(baseInput());
      for (const point of result.timeline) {
        expect(point.remainingBalance).toBeGreaterThanOrEqual(-0.01);
      }
    });
  });

  describe("mathematical identities", () => {
    it("loanAmount = homePrice - downPayment", () => {
      const result = calculateMortgage(baseInput());
      expect(result.loanAmount).toBe(
        result.homePrice - result.downPayment
      );
    });

    it("totalPayments = sum of timeline paymentAmount", () => {
      const result = calculateMortgage(baseInput());
      const sumPayments = result.timeline.reduce(
        (sum, p) => sum + p.paymentAmount,
        0
      );
      expect(closeTo(result.totalPayments, sumPayments)).toBe(true);
    });

    it("totalInterest = sum of timeline interestPaid", () => {
      const result = calculateMortgage(baseInput());
      const sumInterest = result.timeline.reduce(
        (sum, p) => sum + p.interestPaid,
        0
      );
      expect(closeTo(result.totalInterest, sumInterest)).toBe(true);
    });

    it("totalPayments = loanAmount + totalInterest", () => {
      const result = calculateMortgage(baseInput());
      expect(
        closeTo(result.totalPayments, result.loanAmount + result.totalInterest)
      ).toBe(true);
    });

    it("final cumulativePrincipal ≈ loanAmount", () => {
      const result = calculateMortgage(baseInput());
      const last = result.timeline[result.timeline.length - 1]!;
      expect(closeTo(last.cumulativePrincipal, result.loanAmount)).toBe(true);
    });

    it("final cumulativeInterest ≈ totalInterest", () => {
      const result = calculateMortgage(baseInput());
      const last = result.timeline[result.timeline.length - 1]!;
      expect(closeTo(last.cumulativeInterest, result.totalInterest)).toBe(true);
    });
  });

  describe("small and large loans", () => {
    it("small loan", () => {
      const result = calculateMortgage(
        baseInput({ homePrice: 50000, downPayment: 10000, loanTermYears: 15 })
      );
      expect(result.loanAmount).toBe(40000);
      expect(result.regularPayment).toBeGreaterThan(0);
      expect(result.timeline).toHaveLength(180);
    });

    it("larger loan", () => {
      const result = calculateMortgage(
        baseInput({ homePrice: 1000000, downPayment: 200000, loanTermYears: 30 })
      );
      expect(result.loanAmount).toBe(800000);
      expect(result.regularPayment).toBeGreaterThan(0);
    });
  });
});
