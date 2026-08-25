import type {
  MortgageInput,
  MortgageResult,
  MortgageValidationError,
  MortgageTimelinePoint,
} from "./types";
import { PAYMENTS_PER_YEAR } from "./types";

export function validateMortgageInput(
  input: MortgageInput
): MortgageValidationError[] {
  const errors: MortgageValidationError[] = [];

  if (
    typeof input.homePrice !== "number" ||
    Number.isNaN(input.homePrice) ||
    !Number.isFinite(input.homePrice)
  ) {
    errors.push({
      field: "homePrice",
      message: "Home price must be a finite number.",
    });
  } else if (input.homePrice < 0) {
    errors.push({
      field: "homePrice",
      message: "Home price must not be negative.",
    });
  }

  if (
    typeof input.downPayment !== "number" ||
    Number.isNaN(input.downPayment) ||
    !Number.isFinite(input.downPayment)
  ) {
    errors.push({
      field: "downPayment",
      message: "Down payment must be a finite number.",
    });
  } else if (input.downPayment < 0) {
    errors.push({
      field: "downPayment",
      message: "Down payment must not be negative.",
    });
  } else if (
    typeof input.homePrice === "number" &&
    Number.isFinite(input.homePrice) &&
    input.homePrice >= 0 &&
    input.downPayment > input.homePrice
  ) {
    errors.push({
      field: "downPayment",
      message: "Down payment must not exceed home price.",
    });
  }

  if (
    typeof input.annualInterestRate !== "number" ||
    Number.isNaN(input.annualInterestRate) ||
    !Number.isFinite(input.annualInterestRate)
  ) {
    errors.push({
      field: "annualInterestRate",
      message: "Interest rate must be a finite number.",
    });
  } else if (input.annualInterestRate < 0) {
    errors.push({
      field: "annualInterestRate",
      message: "Interest rate must not be negative.",
    });
  }

  if (
    typeof input.loanTermYears !== "number" ||
    Number.isNaN(input.loanTermYears) ||
    !Number.isFinite(input.loanTermYears)
  ) {
    errors.push({
      field: "loanTermYears",
      message: "Loan term must be a finite number.",
    });
  } else if (input.loanTermYears <= 0) {
    errors.push({
      field: "loanTermYears",
      message: "Loan term must be greater than zero.",
    });
  }

  if (!(input.paymentFrequency in PAYMENTS_PER_YEAR)) {
    errors.push({
      field: "paymentFrequency",
      message: `Unsupported payment frequency: ${String(input.paymentFrequency)}`,
    });
  }

  if (
    errors.length === 0 &&
    typeof input.loanTermYears === "number" &&
    Number.isFinite(input.loanTermYears) &&
    input.loanTermYears > 0 &&
    input.paymentFrequency in PAYMENTS_PER_YEAR
  ) {
    const paymentsPerYear = PAYMENTS_PER_YEAR[input.paymentFrequency];
    const paymentCount = input.loanTermYears * paymentsPerYear;
    const rounded = Math.round(paymentCount);
    if (Math.abs(paymentCount - rounded) > 1e-10) {
      errors.push({
        field: "loanTermYears",
        message: "Loan term produces a non-integer number of payments.",
      });
    }
  }

  return errors;
}

function buildAmortizationTimeline(
  loanAmount: number,
  periodicRate: number,
  numberOfPayments: number,
  regularPayment: number
): MortgageTimelinePoint[] {
  if (loanAmount === 0) return [];

  const timeline: MortgageTimelinePoint[] = [];
  let balance = loanAmount;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let n = 1; n <= numberOfPayments; n++) {
    const interestPaid = balance * periodicRate;

    let paymentAmount: number;
    let principalPaid: number;

    if (n === numberOfPayments) {
      paymentAmount = balance + interestPaid;
      principalPaid = balance;
    } else {
      paymentAmount = regularPayment;
      principalPaid = paymentAmount - interestPaid;
    }

    balance = Math.max(0, balance - principalPaid);
    cumulativePrincipal += principalPaid;
    cumulativeInterest += interestPaid;

    timeline.push({
      paymentNumber: n,
      paymentAmount,
      principalPaid,
      interestPaid,
      remainingBalance: balance,
      cumulativePrincipal,
      cumulativeInterest,
    });
  }

  return timeline;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const paymentsPerYear = PAYMENTS_PER_YEAR[input.paymentFrequency];
  const numberOfPayments = Math.round(input.loanTermYears * paymentsPerYear);
  const loanAmount = input.homePrice - input.downPayment;

  if (loanAmount === 0) {
    return {
      homePrice: input.homePrice,
      downPayment: input.downPayment,
      loanAmount: 0,
      regularPayment: 0,
      paymentFrequency: input.paymentFrequency,
      paymentsPerYear,
      numberOfPayments: 0,
      totalPayments: 0,
      totalInterest: 0,
      annualInterestRate: input.annualInterestRate,
      loanTermYears: input.loanTermYears,
      timeline: [],
    };
  }

  const periodicRate = input.annualInterestRate / 100 / paymentsPerYear;

  let regularPayment: number;

  if (input.annualInterestRate === 0) {
    regularPayment = loanAmount / numberOfPayments;
  } else {
    const i = periodicRate;
    const N = numberOfPayments;
    const factor = Math.pow(1 + i, N);
    regularPayment = loanAmount * ((i * factor) / (factor - 1));
  }

  const timeline = buildAmortizationTimeline(
    loanAmount,
    periodicRate,
    numberOfPayments,
    regularPayment
  );

  let totalPayments = 0;
  let totalInterest = 0;
  for (const point of timeline) {
    totalPayments += point.paymentAmount;
    totalInterest += point.interestPaid;
  }

  return {
    homePrice: input.homePrice,
    downPayment: input.downPayment,
    loanAmount,
    regularPayment,
    paymentFrequency: input.paymentFrequency,
    paymentsPerYear,
    numberOfPayments,
    totalPayments,
    totalInterest,
    annualInterestRate: input.annualInterestRate,
    loanTermYears: input.loanTermYears,
    timeline,
  };
}
