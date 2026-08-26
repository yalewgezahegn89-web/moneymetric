import { describe, it, expect } from "vitest";
import { validateLoanInput, calculateLoan } from "./loan";
import type { LoanInput } from "./types";

const TOLERANCE = 0.01;

function closeTo(a: number, b: number, tolerance = TOLERANCE): boolean {
  return Math.abs(a - b) <= tolerance;
}

function baseInput(overrides: Partial<LoanInput> = {}): LoanInput {
  return {
    loanAmount: 20000,
    annualInterestRate: 8,
    loanTermYears: 5,
    paymentFrequency: "monthly",
    ...overrides,
  };
}

describe("validateLoanInput", () => {
  it("returns no errors for valid input", () => {
    const errors = validateLoanInput(baseInput());
    expect(errors.length).toBe(0);
  });

  it("rejects NaN loan amount", () => {
    const errors = validateLoanInput(baseInput({ loanAmount: NaN }));
    expect(errors.some((e) => e.field === "loanAmount")).toBe(true);
  });

  it("rejects Infinity loan amount", () => {
    const errors = validateLoanInput(baseInput({ loanAmount: Infinity }));
    expect(errors.some((e) => e.field === "loanAmount")).toBe(true);
  });

  it("rejects negative loan amount", () => {
    const errors = validateLoanInput(baseInput({ loanAmount: -1000 }));
    expect(errors.some((e) => e.field === "loanAmount")).toBe(true);
  });

  it("rejects NaN interest rate", () => {
    const errors = validateLoanInput(baseInput({ annualInterestRate: NaN }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects Infinity interest rate", () => {
    const errors = validateLoanInput(baseInput({ annualInterestRate: Infinity }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects negative interest rate", () => {
    const errors = validateLoanInput(baseInput({ annualInterestRate: -5 }));
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects zero loan term", () => {
    const errors = validateLoanInput(baseInput({ loanTermYears: 0 }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("rejects negative loan term", () => {
    const errors = validateLoanInput(baseInput({ loanTermYears: -5 }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("rejects invalid payment frequency", () => {
    const errors = validateLoanInput(
      baseInput({ paymentFrequency: "daily" as never })
    );
    expect(errors.some((e) => e.field === "paymentFrequency")).toBe(true);
  });

  it("rejects non-integer payment count", () => {
    // 5.25 years * 12 = 63 payments (integer) - should be accepted
    // 5.33 years * 12 = 63.96 payments (non-integer) - should be rejected
    const errors = validateLoanInput(baseInput({ loanTermYears: 5.33 }));
    expect(errors.some((e) => e.field === "loanTermYears")).toBe(true);
  });

  it("accepts valid fractional duration with integer payment count", () => {
    // 5.5 years * 12 = 66 payments (integer)
    const errors = validateLoanInput(baseInput({ loanTermYears: 5.5 }));
    expect(errors.length).toBe(0);
  });
});

describe("calculateLoan", () => {
  describe("reference scenario", () => {
    it("calculates correct payment for 5-year monthly loan", () => {
      // Reference: $20,000 at 8% for 5 years, monthly
      // Independently verified: M = 20000 * [0.006667 * (1.006667)^60] / [(1.006667)^60 - 1]
      // Expected payment: approximately $405.53
      const expectedPayment = 405.53;

      const result = calculateLoan(baseInput());

      expect(closeTo(result.regularPayment, expectedPayment)).toBe(true);
      expect(result.loanAmount).toBe(20000);
      expect(result.numberOfPayments).toBe(60);
      expect(result.paymentsPerYear).toBe(12);
      expect(result.paymentFrequency).toBe("monthly");
    });
  });

  describe("zero interest", () => {
    it("calculates correct payment for zero interest rate", () => {
      const result = calculateLoan(baseInput({ annualInterestRate: 0 }));

      // $20,000 / 60 payments = $333.33
      expect(closeTo(result.regularPayment, 333.33)).toBe(true);
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayments).toBeCloseTo(20000, 0);
    });

    it("timeline has zero interest for each payment", () => {
      const result = calculateLoan(baseInput({ annualInterestRate: 0 }));

      for (const point of result.timeline) {
        expect(point.interestPaid).toBe(0);
      }
    });
  });

  describe("zero loan", () => {
    it("returns zero values for zero loan amount", () => {
      const result = calculateLoan(baseInput({ loanAmount: 0 }));

      expect(result.loanAmount).toBe(0);
      expect(result.regularPayment).toBe(0);
      expect(result.totalPayments).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.timeline).toHaveLength(0);
    });
  });

  describe("payment frequencies", () => {
    it("calculates monthly payments", () => {
      const result = calculateLoan(baseInput({ paymentFrequency: "monthly" }));

      expect(result.paymentsPerYear).toBe(12);
      expect(result.numberOfPayments).toBe(60);
      expect(result.timeline).toHaveLength(60);
    });

    it("calculates biweekly payments", () => {
      const result = calculateLoan(baseInput({ paymentFrequency: "biweekly" }));

      expect(result.paymentsPerYear).toBe(26);
      expect(result.numberOfPayments).toBe(130);
      expect(result.timeline).toHaveLength(130);
    });

    it("calculates weekly payments", () => {
      const result = calculateLoan(baseInput({ paymentFrequency: "weekly" }));

      expect(result.paymentsPerYear).toBe(52);
      expect(result.numberOfPayments).toBe(260);
      expect(result.timeline).toHaveLength(260);
    });
  });

  describe("different terms", () => {
    it("calculates 1-year loan", () => {
      const result = calculateLoan(baseInput({ loanTermYears: 1 }));

      expect(result.numberOfPayments).toBe(12);
      expect(result.timeline).toHaveLength(12);
    });

    it("calculates 40-year loan", () => {
      const result = calculateLoan(baseInput({ loanTermYears: 40 }));

      expect(result.numberOfPayments).toBe(480);
      expect(result.timeline).toHaveLength(480);
    });
  });

  describe("edge cases", () => {
    it("handles valid fractional duration", () => {
      // 5.5 years * 12 = 66 payments
      const result = calculateLoan(baseInput({ loanTermYears: 5.5 }));

      expect(result.numberOfPayments).toBe(66);
      expect(result.timeline).toHaveLength(66);
    });
  });

  describe("final payment", () => {
    it("final balance is approximately zero", () => {
      const result = calculateLoan(baseInput());
      const lastPoint = result.timeline[result.timeline.length - 1];

      expect(lastPoint).toBeDefined();
      expect(lastPoint!.remainingBalance).toBeLessThan(0.01);
      expect(lastPoint!.remainingBalance).toBeGreaterThanOrEqual(0);
    });

    it("final payment does not produce negative balance", () => {
      const result = calculateLoan(baseInput());
      const lastPoint = result.timeline[result.timeline.length - 1];

      expect(lastPoint).toBeDefined();
      expect(lastPoint!.remainingBalance).toBeGreaterThanOrEqual(0);
    });

    it("remaining balance decreases monotonically", () => {
      const result = calculateLoan(baseInput());

      for (let i = 1; i < result.timeline.length; i++) {
        expect(result.timeline[i]!.remainingBalance).toBeLessThanOrEqual(
          result.timeline[i - 1]!.remainingBalance
        );
      }
    });
  });

  describe("mathematical identities", () => {
    it("total payments equals sum of timeline payments", () => {
      const result = calculateLoan(baseInput());

      let sumPayments = 0;
      for (const point of result.timeline) {
        sumPayments += point.paymentAmount;
      }

      expect(closeTo(result.totalPayments, sumPayments)).toBe(true);
    });

    it("total interest equals sum of timeline interest", () => {
      const result = calculateLoan(baseInput());

      let sumInterest = 0;
      for (const point of result.timeline) {
        sumInterest += point.interestPaid;
      }

      expect(closeTo(result.totalInterest, sumInterest)).toBe(true);
    });

    it("total payments equals loan amount plus total interest", () => {
      const result = calculateLoan(baseInput());

      expect(
        closeTo(result.totalPayments, result.loanAmount + result.totalInterest)
      ).toBe(true);
    });

    it("final cumulative principal equals loan amount", () => {
      const result = calculateLoan(baseInput());
      const lastPoint = result.timeline[result.timeline.length - 1];

      expect(lastPoint).toBeDefined();
      expect(closeTo(lastPoint!.cumulativePrincipal, result.loanAmount)).toBe(
        true
      );
    });

    it("final cumulative interest equals total interest", () => {
      const result = calculateLoan(baseInput());
      const lastPoint = result.timeline[result.timeline.length - 1];

      expect(lastPoint).toBeDefined();
      expect(closeTo(lastPoint!.cumulativeInterest, result.totalInterest)).toBe(
        true
      );
    });

    it("zero interest: total payments equals loan amount", () => {
      const result = calculateLoan(baseInput({ annualInterestRate: 0 }));

      expect(closeTo(result.totalPayments, result.loanAmount)).toBe(true);
    });

    it("zero interest: total interest is zero", () => {
      const result = calculateLoan(baseInput({ annualInterestRate: 0 }));

      expect(result.totalInterest).toBe(0);
    });
  });

  describe("result structure", () => {
    it("returns all required fields", () => {
      const result = calculateLoan(baseInput());

      expect(typeof result.loanAmount).toBe("number");
      expect(typeof result.regularPayment).toBe("number");
      expect(typeof result.paymentFrequency).toBe("string");
      expect(typeof result.paymentsPerYear).toBe("number");
      expect(typeof result.numberOfPayments).toBe("number");
      expect(typeof result.totalPayments).toBe("number");
      expect(typeof result.totalInterest).toBe("number");
      expect(typeof result.annualInterestRate).toBe("number");
      expect(typeof result.loanTermYears).toBe("number");
      expect(Array.isArray(result.timeline)).toBe(true);
    });

    it("timeline has correct structure", () => {
      const result = calculateLoan(baseInput());

      for (const point of result.timeline) {
        expect(typeof point.paymentNumber).toBe("number");
        expect(typeof point.paymentAmount).toBe("number");
        expect(typeof point.principalPaid).toBe("number");
        expect(typeof point.interestPaid).toBe("number");
        expect(typeof point.remainingBalance).toBe("number");
        expect(typeof point.cumulativePrincipal).toBe("number");
        expect(typeof point.cumulativeInterest).toBe("number");
      }
    });
  });
});