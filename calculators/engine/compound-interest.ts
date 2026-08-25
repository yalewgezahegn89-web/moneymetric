import type {
  CompoundInterestInput,
  CompoundInterestResult,
  CompoundInterestValidationError,
  TimelinePoint,
} from "./types";
import {
  CONTRIBUTION_PERIODS_PER_YEAR,
  COMPOUNDING_PERIODS_PER_YEAR,
} from "./types";

export function validateCompoundInterestInput(
  input: CompoundInterestInput
): CompoundInterestValidationError[] {
  const errors: CompoundInterestValidationError[] = [];

  if (
    typeof input.initialInvestment !== "number" ||
    Number.isNaN(input.initialInvestment) ||
    !Number.isFinite(input.initialInvestment)
  ) {
    errors.push({
      field: "initialInvestment",
      message: "Initial investment must be a finite number.",
    });
  } else if (input.initialInvestment < 0) {
    errors.push({
      field: "initialInvestment",
      message: "Initial investment must not be negative.",
    });
  }

  if (
    typeof input.regularContribution !== "number" ||
    Number.isNaN(input.regularContribution) ||
    !Number.isFinite(input.regularContribution)
  ) {
    errors.push({
      field: "regularContribution",
      message: "Regular contribution must be a finite number.",
    });
  } else if (input.regularContribution < 0) {
    errors.push({
      field: "regularContribution",
      message: "Regular contribution must not be negative.",
    });
  }

  if (
    typeof input.annualInterestRate !== "number" ||
    Number.isNaN(input.annualInterestRate) ||
    !Number.isFinite(input.annualInterestRate)
  ) {
    errors.push({
      field: "annualInterestRate",
      message: "Annual interest rate must be a finite number.",
    });
  } else if (input.annualInterestRate < 0) {
    errors.push({
      field: "annualInterestRate",
      message: "Annual interest rate must not be negative.",
    });
  }

  if (
    typeof input.investmentYears !== "number" ||
    Number.isNaN(input.investmentYears) ||
    !Number.isFinite(input.investmentYears)
  ) {
    errors.push({
      field: "investmentYears",
      message: "Investment years must be a finite number.",
    });
  } else if (input.investmentYears <= 0) {
    errors.push({
      field: "investmentYears",
      message: "Investment years must be greater than zero.",
    });
  }

  if (!(input.contributionFrequency in CONTRIBUTION_PERIODS_PER_YEAR)) {
    errors.push({
      field: "contributionFrequency",
      message: `Unsupported contribution frequency: ${String(input.contributionFrequency)}`,
    });
  }

  if (!(input.compoundingFrequency in COMPOUNDING_PERIODS_PER_YEAR)) {
    errors.push({
      field: "compoundingFrequency",
      message: `Unsupported compounding frequency: ${String(input.compoundingFrequency)}`,
    });
  }

  return errors;
}

interface TimelineEvent {
  time: number;
  type: "compound" | "contribute";
}

function buildEventTimeline(
  investmentYears: number,
  compoundsPerYear: number,
  periodsPerYear: number
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  const compoundInterval = 1 / compoundsPerYear;
  const contributionInterval = 1 / periodsPerYear;

  let compoundTime = compoundInterval;
  while (compoundTime < investmentYears - 1e-12) {
    events.push({ time: compoundTime, type: "compound" });
    compoundTime += compoundInterval;
  }

  let contributionTime = contributionInterval;
  while (contributionTime <= investmentYears + 1e-12) {
    events.push({ time: contributionTime, type: "contribute" });
    contributionTime += contributionInterval;
  }

  events.push({ time: investmentYears, type: "compound" });

  events.sort((a, b) => a.time - b.time || (a.type === "compound" ? -1 : 1));

  return events;
}

function buildTimeline(
  input: CompoundInterestInput
): TimelinePoint[] {
  const periodsPerYear =
    CONTRIBUTION_PERIODS_PER_YEAR[input.contributionFrequency];
  const compoundsPerYear =
    COMPOUNDING_PERIODS_PER_YEAR[input.compoundingFrequency];

  const r = input.annualInterestRate / 100;
  const ratePerPeriod = r / compoundsPerYear;

  const events = buildEventTimeline(
    input.investmentYears,
    compoundsPerYear,
    periodsPerYear
  );

  const timeline: TimelinePoint[] = [];

  let balance = input.initialInvestment;
  let cumulativeContributions = 0;
  let cumulativeInterest = 0;
  let currentTime = 0;
  let lastTimelinePeriod = 0;

  timeline.push({
    period: 0,
    timeInYears: 0,
    balance,
    cumulativeContributions,
    cumulativeInterest,
  });

  for (const event of events) {
    if (event.time > currentTime + 1e-12) {
      const elapsed = event.time - currentTime;
      const growthFactor = Math.pow(1 + ratePerPeriod, elapsed * compoundsPerYear);
      const interestAccrued = balance * (growthFactor - 1);
      balance += interestAccrued;
      cumulativeInterest += interestAccrued;
      currentTime = event.time;
    }

    if (event.type === "contribute") {
      balance += input.regularContribution;
      cumulativeContributions += input.regularContribution;
    }

    lastTimelinePeriod++;
    timeline.push({
      period: lastTimelinePeriod,
      timeInYears: currentTime,
      balance,
      cumulativeContributions,
      cumulativeInterest,
    });
  }

  return timeline;
}

export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const timeline = buildTimeline(input);
  const lastPoint = timeline[timeline.length - 1];

  const futureValue = lastPoint.balance;
  const totalContributions = lastPoint.cumulativeContributions;
  const totalPrincipal = input.initialInvestment + totalContributions;
  const totalInterest = futureValue - totalPrincipal;

  const compoundsPerYear =
    COMPOUNDING_PERIODS_PER_YEAR[input.compoundingFrequency];
  const r = input.annualInterestRate / 100;
  const effectiveAnnualRate =
    input.annualInterestRate > 0
      ? (Math.pow(1 + r / compoundsPerYear, compoundsPerYear) - 1) * 100
      : 0;

  return {
    futureValue,
    initialInvestment: input.initialInvestment,
    totalContributions,
    totalPrincipal,
    totalInterest,
    effectiveAnnualRate,
    timeline,
    assumptions: {
      contributionTiming: "end-of-period",
    },
  };
}
