import { describe, it, expect } from "vitest";
import { calculateCompoundInterest } from "@/calculators/engine/compound-interest";
import type { TimelinePoint } from "@/calculators/engine/types";

function getTestTimeline(): TimelinePoint[] {
  const result = calculateCompoundInterest({
    initialInvestment: 10000,
    regularContribution: 500,
    contributionFrequency: "monthly",
    annualInterestRate: 7,
    compoundingFrequency: "monthly",
    investmentYears: 5,
  });
  return result.timeline;
}

describe("GrowthChart data requirements", () => {
  it("receives timeline with correct structure", () => {
    const timeline = getTestTimeline();
    expect(timeline.length).toBeGreaterThan(0);

    for (const point of timeline) {
      expect(typeof point.timeInYears).toBe("number");
      expect(typeof point.balance).toBe("number");
      expect(typeof point.cumulativeContributions).toBe("number");
      expect(typeof point.cumulativeInterest).toBe("number");
    }
  });

  it("timeline has increasing balance over time", () => {
    const timeline = getTestTimeline();
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i]!.balance).toBeGreaterThanOrEqual(
        timeline[i - 1]!.balance
      );
    }
  });

  it("timeline has non-decreasing contributions", () => {
    const timeline = getTestTimeline();
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i]!.cumulativeContributions).toBeGreaterThanOrEqual(
        timeline[i - 1]!.cumulativeContributions
      );
    }
  });

  it("timeline has non-decreasing interest", () => {
    const timeline = getTestTimeline();
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i]!.cumulativeInterest).toBeGreaterThanOrEqual(
        timeline[i - 1]!.cumulativeInterest
      );
    }
  });

  it("first point is at time 0 with initial investment only", () => {
    const timeline = getTestTimeline();
    expect(timeline[0]!.timeInYears).toBe(0);
    expect(timeline[0]!.balance).toBe(10000);
    expect(timeline[0]!.cumulativeContributions).toBe(0);
    expect(timeline[0]!.cumulativeInterest).toBe(0);
  });

  it("last point has correct total contributions", () => {
    const timeline = getTestTimeline();
    const last = timeline[timeline.length - 1]!;
    // 5 years * 12 months * 500 = 30000
    expect(last.cumulativeContributions).toBeCloseTo(30000, 0);
  });

  it("short timeline (1 year) works", () => {
    const result = calculateCompoundInterest({
      initialInvestment: 1000,
      regularContribution: 100,
      contributionFrequency: "monthly",
      annualInterestRate: 5,
      compoundingFrequency: "monthly",
      investmentYears: 1,
    });
    expect(result.timeline.length).toBeGreaterThan(0);
    expect(result.timeline[result.timeline.length - 1]!.balance).toBeGreaterThan(1000);
  });

  it("long timeline (30 years) works", () => {
    const result = calculateCompoundInterest({
      initialInvestment: 50000,
      regularContribution: 1000,
      contributionFrequency: "monthly",
      annualInterestRate: 8,
      compoundingFrequency: "monthly",
      investmentYears: 30,
    });
    expect(result.timeline.length).toBeGreaterThan(0);
    expect(result.timeline[result.timeline.length - 1]!.balance).toBeGreaterThan(50000);
  });

  it("zero interest produces linear growth", () => {
    const result = calculateCompoundInterest({
      initialInvestment: 10000,
      regularContribution: 500,
      contributionFrequency: "monthly",
      annualInterestRate: 0,
      compoundingFrequency: "monthly",
      investmentYears: 2,
    });
    const last = result.timeline[result.timeline.length - 1]!;
    // 10000 + 500 * 24 = 22000
    expect(last.balance).toBeCloseTo(22000, 0);
    expect(last.cumulativeInterest).toBe(0);
  });
});
