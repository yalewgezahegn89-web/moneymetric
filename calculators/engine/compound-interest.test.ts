import { describe, it, expect } from "vitest";
import {
  calculateCompoundInterest,
  validateCompoundInterestInput,
} from "./compound-interest";
import type { CompoundInterestInput } from "./types";

const TOLERANCE = 0.01;

function closeTo(a: number, b: number, tolerance = TOLERANCE): boolean {
  return Math.abs(a - b) <= tolerance;
}

function baseInput(overrides: Partial<CompoundInterestInput> = {}): CompoundInterestInput {
  return {
    initialInvestment: 10000,
    regularContribution: 500,
    contributionFrequency: "monthly",
    annualInterestRate: 7,
    compoundingFrequency: "monthly",
    investmentYears: 10,
    ...overrides,
  };
}

describe("validateCompoundInterestInput", () => {
  it("returns no errors for valid input", () => {
    const errors = validateCompoundInterestInput(baseInput());
    expect(errors).toHaveLength(0);
  });

  it("rejects NaN initialInvestment", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ initialInvestment: NaN })
    );
    expect(errors.some((e) => e.field === "initialInvestment")).toBe(true);
  });

  it("rejects Infinity initialInvestment", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ initialInvestment: Infinity })
    );
    expect(errors.some((e) => e.field === "initialInvestment")).toBe(true);
  });

  it("rejects negative initialInvestment", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ initialInvestment: -1000 })
    );
    expect(errors.some((e) => e.field === "initialInvestment")).toBe(true);
  });

  it("rejects negative regularContribution", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ regularContribution: -100 })
    );
    expect(errors.some((e) => e.field === "regularContribution")).toBe(true);
  });

  it("rejects negative annualInterestRate", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ annualInterestRate: -5 })
    );
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects investmentYears <= 0", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ investmentYears: 0 })
    );
    expect(errors.some((e) => e.field === "investmentYears")).toBe(true);
  });

  it("rejects unsupported contributionFrequency", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ contributionFrequency: "weekly" as never })
    );
    expect(errors.some((e) => e.field === "contributionFrequency")).toBe(true);
  });

  it("rejects unsupported compoundingFrequency", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ compoundingFrequency: "continuous" as never })
    );
    expect(errors.some((e) => e.field === "compoundingFrequency")).toBe(true);
  });

  it("rejects NaN annualInterestRate", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ annualInterestRate: NaN })
    );
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects Infinity annualInterestRate", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ annualInterestRate: Infinity })
    );
    expect(errors.some((e) => e.field === "annualInterestRate")).toBe(true);
  });

  it("rejects NaN investmentYears", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ investmentYears: NaN })
    );
    expect(errors.some((e) => e.field === "investmentYears")).toBe(true);
  });

  it("rejects Infinity investmentYears", () => {
    const errors = validateCompoundInterestInput(
      baseInput({ investmentYears: Infinity })
    );
    expect(errors.some((e) => e.field === "investmentYears")).toBe(true);
  });
});

describe("calculateCompoundInterest", () => {
  describe("zero interest", () => {
    it("returns initial investment only when no contributions", () => {
      const result = calculateCompoundInterest(
        baseInput({ regularContribution: 0, annualInterestRate: 0 })
      );
      expect(result.futureValue).toBe(10000);
      expect(result.totalInterest).toBe(0);
      expect(result.totalContributions).toBe(0);
    });

    it("returns initial + contributions when 0% interest", () => {
      const result = calculateCompoundInterest(
        baseInput({ annualInterestRate: 0 })
      );
      // 10000 + 500 * 12 * 10 = 70000
      expect(closeTo(result.futureValue, 70000)).toBe(true);
      expect(result.totalInterest).toBe(0);
      expect(closeTo(result.totalContributions, 60000)).toBe(true);
    });

    it("returns contributions only when initial = 0 and 0% interest", () => {
      const result = calculateCompoundInterest(
        baseInput({
          initialInvestment: 0,
          regularContribution: 500,
          annualInterestRate: 0,
        })
      );
      // 500 * 12 * 10 = 60000
      expect(closeTo(result.futureValue, 60000)).toBe(true);
      expect(result.totalInterest).toBe(0);
    });

    it("returns 0 when both initial and contribution are 0", () => {
      const result = calculateCompoundInterest(
        baseInput({
          initialInvestment: 0,
          regularContribution: 0,
          annualInterestRate: 0,
        })
      );
      expect(result.futureValue).toBe(0);
      expect(result.totalInterest).toBe(0);
      expect(result.totalContributions).toBe(0);
    });
  });

  describe("initial investment only", () => {
    it("calculates compound interest on initial investment without contributions", () => {
      const result = calculateCompoundInterest(
        baseInput({ regularContribution: 0 })
      );
      // A = 10000 * (1 + 0.07/12)^(12*10)
      const expected = 10000 * Math.pow(1 + 0.07 / 12, 120);
      expect(closeTo(result.futureValue, expected)).toBe(true);
      expect(result.totalContributions).toBe(0);
    });
  });

  describe("contributions only", () => {
    it("calculates contributions with zero initial investment", () => {
      const result = calculateCompoundInterest(
        baseInput({ initialInvestment: 0 })
      );
      // Should be > 0 since contributions earn interest
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalContributions).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });
  });

  describe("same frequency: monthly contribution + monthly compounding", () => {
    it("matches expected annuity calculation", () => {
      const result = calculateCompoundInterest(baseInput());
      // Future value of annuity with monthly compounding
      // FV = PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
      const r = 0.07;
      const n = 12;
      const t = 10;
      const pmt = 500;
      const annuityFV =
        pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n));
      const initialFV = 10000 * Math.pow(1 + r / n, n * t);
      const expected = initialFV + annuityFV;
      expect(closeTo(result.futureValue, expected)).toBe(true);
    });
  });

  describe("mixed frequencies", () => {
    it("handles quarterly contribution + monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ contributionFrequency: "quarterly" })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalContributions).toBeGreaterThan(0);
    });

    it("handles annual contribution + monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ contributionFrequency: "annually" })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it("handles monthly contribution + daily compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "daily" })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it("handles monthly contribution + quarterly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "quarterly" })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it("handles quarterly contribution + monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({
          contributionFrequency: "quarterly",
          compoundingFrequency: "monthly",
        })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
    });
  });

  describe("different compounding frequencies", () => {
    it("more frequent compounding yields higher value", () => {
      const annual = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "annually", regularContribution: 0 })
      );
      const semiAnnual = calculateCompoundInterest(
        baseInput({
          compoundingFrequency: "semi-annually",
          regularContribution: 0,
        })
      );
      const quarterly = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "quarterly", regularContribution: 0 })
      );
      const monthly = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "monthly", regularContribution: 0 })
      );
      const daily = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "daily", regularContribution: 0 })
      );

      expect(annual.futureValue).toBeLessThan(semiAnnual.futureValue);
      expect(semiAnnual.futureValue).toBeLessThan(quarterly.futureValue);
      expect(quarterly.futureValue).toBeLessThan(monthly.futureValue);
      expect(monthly.futureValue).toBeLessThan(daily.futureValue);
    });
  });

  describe("identities", () => {
    it("totalPrincipal = initialInvestment + totalContributions", () => {
      const result = calculateCompoundInterest(baseInput());
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });

    it("totalInterest = futureValue - totalPrincipal", () => {
      const result = calculateCompoundInterest(baseInput());
      expect(closeTo(result.totalInterest, result.futureValue - result.totalPrincipal)).toBe(true);
    });
  });

  describe("one-year investment", () => {
    it("calculates correctly for exactly one year", () => {
      const result = calculateCompoundInterest(
        baseInput({ investmentYears: 1 })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("handles large values", () => {
      const result = calculateCompoundInterest(
        baseInput({
          initialInvestment: 1_000_000,
          regularContribution: 10_000,
          annualInterestRate: 10,
          investmentYears: 30,
        })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(Number.isFinite(result.futureValue)).toBe(true);
    });

    it("handles zero initial investment with contributions", () => {
      const result = calculateCompoundInterest(
        baseInput({ initialInvestment: 0 })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalContributions).toBeGreaterThan(0);
    });

    it("handles zero contribution with initial investment", () => {
      const result = calculateCompoundInterest(
        baseInput({ regularContribution: 0 })
      );
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalContributions).toBe(0);
    });
  });

  describe("assumptions", () => {
    it("sets contributionTiming to end-of-period", () => {
      const result = calculateCompoundInterest(baseInput());
      expect(result.assumptions.contributionTiming).toBe("end-of-period");
    });
  });

  describe("timeline", () => {
    it("starts with period 0 at time 0", () => {
      const result = calculateCompoundInterest(baseInput());
      expect(result.timeline[0]?.period).toBe(0);
      expect(result.timeline[0]?.timeInYears).toBe(0);
    });

    it("ends at or before the investment period", () => {
      const result = calculateCompoundInterest(baseInput());
      const lastPoint = result.timeline[result.timeline.length - 1];
      expect(lastPoint?.timeInYears).toBeLessThanOrEqual(
        baseInput().investmentYears
      );
    });

    it("has increasing balances over time with positive interest", () => {
      const result = calculateCompoundInterest(baseInput());
      for (let i = 1; i < result.timeline.length; i++) {
        expect(result.timeline[i]!.balance).toBeGreaterThanOrEqual(
          result.timeline[i - 1]!.balance
        );
      }
    });
  });

  describe("effective annual rate", () => {
    it("annual compounding returns nominal rate", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "annually" })
      );
      expect(closeTo(result.effectiveAnnualRate, 7)).toBe(true);
    });

    it("semi-annual compounding produces EAR > nominal", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "semi-annually" })
      );
      const expected = (Math.pow(1 + 0.07 / 2, 2) - 1) * 100;
      expect(closeTo(result.effectiveAnnualRate, expected)).toBe(true);
      expect(result.effectiveAnnualRate).toBeGreaterThan(7);
    });

    it("quarterly compounding produces EAR > nominal", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "quarterly" })
      );
      const expected = (Math.pow(1 + 0.07 / 4, 4) - 1) * 100;
      expect(closeTo(result.effectiveAnnualRate, expected)).toBe(true);
      expect(result.effectiveAnnualRate).toBeGreaterThan(7);
    });

    it("monthly compounding produces EAR > nominal", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "monthly" })
      );
      const expected = (Math.pow(1 + 0.07 / 12, 12) - 1) * 100;
      expect(closeTo(result.effectiveAnnualRate, expected)).toBe(true);
      expect(result.effectiveAnnualRate).toBeGreaterThan(7);
    });

    it("daily compounding produces EAR > nominal", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "daily" })
      );
      const expected = (Math.pow(1 + 0.07 / 365, 365) - 1) * 100;
      expect(closeTo(result.effectiveAnnualRate, expected)).toBe(true);
      expect(result.effectiveAnnualRate).toBeGreaterThan(7);
    });

    it("zero rate produces zero EAR", () => {
      const result = calculateCompoundInterest(
        baseInput({ annualInterestRate: 0 })
      );
      expect(result.effectiveAnnualRate).toBe(0);
    });
  });

  describe("mixed frequencies with independently calculated values", () => {
    it("monthly contribution + daily compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "daily" })
      );
      // Verify basic properties
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.totalContributions).toBeGreaterThan(0);
      // Total principal identity
      expect(
        closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)
      ).toBe(true);
    });

    it("monthly contribution + annual compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ compoundingFrequency: "annually" })
      );
      // Manually: contributions at t=1/12,2/12,...,120/12
      // Annual compounding at t=1,2,...,10
      // Each contribution earns compound interest until end
      expect(result.futureValue).toBeGreaterThan(0);
      expect(result.totalContributions).toBeGreaterThan(0);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });

    it("quarterly contribution + monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({
          contributionFrequency: "quarterly",
          compoundingFrequency: "monthly",
        })
      );
      // 40 quarterly contributions over10 years
      expect(result.totalContributions).toBeCloseTo(40 * 500, 0);
      expect(result.futureValue).toBeGreaterThan(0);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });

    it("annual contribution + daily compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({
          contributionFrequency: "annually",
          compoundingFrequency: "daily",
        })
      );
      // 10 annual contributions
      expect(result.totalContributions).toBeCloseTo(10 * 500, 0);
      expect(result.futureValue).toBeGreaterThan(0);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });
  });

  describe("fractional investment duration", () => {
    it("2.5 years with monthly contributions and monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({ investmentYears: 2.5 })
      );
      // 30 monthly contributions
      expect(result.totalContributions).toBeCloseTo(30 * 500, 0);
      // Last timeline point should be at t=2.5
      const lastPoint = result.timeline[result.timeline.length - 1];
      expect(lastPoint?.timeInYears).toBeCloseTo(2.5, 10);
      // No growth applied beyond 2.5 years
      expect(lastPoint?.timeInYears).toBeLessThanOrEqual(2.5 + 1e-10);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });

    it("1.75 years with quarterly contributions and monthly compounding", () => {
      const result = calculateCompoundInterest(
        baseInput({
          investmentYears: 1.75,
          contributionFrequency: "quarterly",
          compoundingFrequency: "monthly",
        })
      );
      // 7 quarterly contributions (at t=0.25,0.5,...,1.75)
      expect(result.totalContributions).toBeCloseTo(7 * 500, 0);
      const lastPoint = result.timeline[result.timeline.length - 1];
      expect(lastPoint?.timeInYears).toBeCloseTo(1.75, 10);
      expect(closeTo(result.totalPrincipal, result.totalContributions + result.initialInvestment)).toBe(true);
    });

    it("0.5 years with monthly contributions", () => {
      const result = calculateCompoundInterest(
        baseInput({ investmentYears: 0.5 })
      );
      // 6 monthly contributions
      expect(result.totalContributions).toBeCloseTo(6 * 500, 0);
      const lastPoint = result.timeline[result.timeline.length - 1];
      expect(lastPoint?.timeInYears).toBeCloseTo(0.5, 10);
    });
  });

  describe("contribution timing", () => {
    it("contributions occur at exact end-of-period times for monthly", () => {
      const result = calculateCompoundInterest(
        baseInput({ investmentYears: 1 })
      );
      // Find all contribution events (where cumulativeContributions increases)
      const contributionTimes: number[] = [];
      for (let i = 1; i < result.timeline.length; i++) {
        const prev = result.timeline[i - 1]!;
        const curr = result.timeline[i]!;
        if (curr.cumulativeContributions > prev.cumulativeContributions) {
          contributionTimes.push(curr.timeInYears);
        }
      }
      // Should have12 contributions at exactly 1/12,2/12,...,12/12
      expect(contributionTimes).toHaveLength(12);
      for (let i = 0; i <12; i++) {
        expect(contributionTimes[i]).toBeCloseTo((i + 1) / 12, 10);
      }
    });

    it("contributions occur at exact end-of-period times for quarterly", () => {
      const result = calculateCompoundInterest(
        baseInput({
          contributionFrequency: "quarterly",
          investmentYears: 2,
        })
      );
      const contributionTimes: number[] = [];
      for (let i = 1; i < result.timeline.length; i++) {
        const prev = result.timeline[i - 1]!;
        const curr = result.timeline[i]!;
        if (curr.cumulativeContributions > prev.cumulativeContributions) {
          contributionTimes.push(curr.timeInYears);
        }
      }
      // 8 quarterly contributions at 0.25,0.5,...,2.0
      expect(contributionTimes).toHaveLength(8);
      for (let i = 0; i < 8; i++) {
        expect(contributionTimes[i]).toBeCloseTo((i + 1) * 0.25, 10);
      }
    });
  });
});
