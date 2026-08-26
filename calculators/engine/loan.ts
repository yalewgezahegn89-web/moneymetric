import type {
  LoanInput,
  LoanValidationError,
  LoanResult,
  LoanTimelinePoint,
  PaymentFrequency,
} from "./types";
import { PAYMENTS_PER_YEAR } from "./types";

export function validateLoanInput(input: LoanInput): LoanValidationError[] {
  const errors: LoanValidationError[] = [];

  // Validate loanAmount
  if (
    typeof input.loanAmount !== "number" ||
    Number.isNaN(input.loanAmount) ||
    !Number.isFinite(input.loanAmount)
  ) {
    errors.push({ field: "loanAmount", message: "Loan amount must be a valid number." });
  } else if (input.loanAmount < 0) {
    errors.push({ field: "loanAmount", message: "Loan amount cannot be negative." });
  }

  // Validate annualInterestRate
  if (
    typeof input.annualInterestRate !== "number" ||
    Number.isNaN(input.annualInterestRate) ||
    !Number.isFinite(input.annualInterestRate)
  ) {
    errors.push({ field: "annualInterestRate", message: "Interest rate must be a valid number." });
  } else if (input.annualInterestRate < 0) {
    errors.push({ field: "annualInterestRate", message: "Interest rate cannot be negative." });
  }

  // Validate loanTermYears
  if (
    typeof input.loanTermYears !== "number" ||
    Number.isNaN(input.loanTermYears) ||
    !Number.isFinite(input.loanTermYears)
  ) {
    errors.push({ field: "loanTermYears", message: "Loan term must be a valid number." });
  } else if (input.loanTermYears <= 0) {
    errors.push({ field: "loanTermYears", message: "Loan term must be greater than zero." });
  }

  // Validate paymentFrequency
  if (
    typeof input.paymentFrequency !== "string" ||
    !(input.paymentFrequency in PAYMENTS_PER_YEAR)
  ) {
    errors.push({ field: "paymentFrequency", message: "Invalid payment frequency." });
  }

  // Validate payment count is integer (only if other validations pass)
  if (errors.length === 0) {
    const paymentsPerYear = PAYMENTS_PER_YEAR[input.paymentFrequency as PaymentFrequency];
    const paymentCount = input.loanTermYears * paymentsPerYear;
    const roundedCount = Math.round(paymentCount);
    const tolerance = 1e-10;

    if (Math.abs(paymentCount - roundedCount) > tolerance) {
      errors.push({
        field: "loanTermYears",
        message: "Loan term must result in a whole number of payments.",
      });
    }
  }

  return errors;
}

function buildAmortizationTimeline(
  loanAmount: number,
  regularPayment: number,
  periodicRate: number,
  numberOfPayments: number
): LoanTimelinePoint[] {
  const timeline: LoanTimelinePoint[] = [];
  let balance = loanAmount;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let paymentNumber = 1; paymentNumber <= numberOfPayments; paymentNumber++) {
    const interestPaid = balance * periodicRate;
    let paymentAmount: number;
    let principalPaid: number;

    // Final payment adjustment
    if (paymentNumber === numberOfPayments) {
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
      paymentNumber,
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

export function calculateLoan(input: LoanInput): LoanResult {
  const { loanAmount, annualInterestRate, loanTermYears, paymentFrequency } = input;
  const paymentsPerYear = PAYMENTS_PER_YEAR[paymentFrequency];
  const numberOfPayments = Math.round(loanTermYears * paymentsPerYear);

  // Zero loan case
  if (loanAmount === 0) {
    return {
      loanAmount: 0,
      regularPayment: 0,
      paymentFrequency,
      paymentsPerYear,
      numberOfPayments,
      totalPayments: 0,
      totalInterest: 0,
      annualInterestRate,
      loanTermYears,
      timeline: [],
    };
  }

  const periodicRate = annualInterestRate / 100 / paymentsPerYear;

  // Calculate regular payment
  let regularPayment: number;
  if (annualInterestRate === 0) {
    regularPayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + periodicRate, numberOfPayments);
    regularPayment = loanAmount * ((periodicRate * factor) / (factor - 1));
  }

  // Build amortization timeline
  const timeline = buildAmortizationTimeline(
    loanAmount,
    regularPayment,
    periodicRate,
    numberOfPayments
  );

  // Calculate totals from timeline
  let totalPayments = 0;
  let totalInterest = 0;
  for (const point of timeline) {
    totalPayments += point.paymentAmount;
    totalInterest += point.interestPaid;
  }

  return {
    loanAmount,
    regularPayment,
    paymentFrequency,
    paymentsPerYear,
    numberOfPayments,
    totalPayments,
    totalInterest,
    annualInterestRate,
    loanTermYears,
    timeline,
  };
}