export type ContributionFrequency = "monthly" | "quarterly" | "annually";

export type CompoundingFrequency =
  | "annually"
  | "semi-annually"
  | "quarterly"
  | "monthly"
  | "daily";

export interface CompoundInterestInput {
  initialInvestment: number;
  regularContribution: number;
  contributionFrequency: ContributionFrequency;
  annualInterestRate: number;
  compoundingFrequency: CompoundingFrequency;
  investmentYears: number;
}

export interface CompoundInterestValidationError {
  field: string;
  message: string;
}

export interface CompoundInterestResult {
  futureValue: number;
  initialInvestment: number;
  totalContributions: number;
  totalPrincipal: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  timeline: TimelinePoint[];
  assumptions: {
    contributionTiming: "end-of-period";
  };
}

export interface TimelinePoint {
  period: number;
  timeInYears: number;
  balance: number;
  cumulativeContributions: number;
  cumulativeInterest: number;
}

export const CONTRIBUTION_PERIODS_PER_YEAR: Record<ContributionFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

export const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  annually: 1,
  "semi-annually": 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

// --- Mortgage Types ---

export type PaymentFrequency = "monthly" | "biweekly" | "weekly";

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualInterestRate: number;
  loanTermYears: number;
  paymentFrequency: PaymentFrequency;
}

export interface MortgageValidationError {
  field: string;
  message: string;
}

export interface MortgageTimelinePoint {
  paymentNumber: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface MortgageResult {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  regularPayment: number;
  paymentFrequency: PaymentFrequency;
  paymentsPerYear: number;
  numberOfPayments: number;
  totalPayments: number;
  totalInterest: number;
  annualInterestRate: number;
  loanTermYears: number;
  timeline: MortgageTimelinePoint[];
}

export const PAYMENTS_PER_YEAR: Record<PaymentFrequency, number> = {
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

// --- Loan Types ---

export interface LoanInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  paymentFrequency: PaymentFrequency;
}

export interface LoanValidationError {
  field: string;
  message: string;
}

export interface LoanTimelinePoint {
  paymentNumber: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface LoanResult {
  loanAmount: number;
  regularPayment: number;
  paymentFrequency: PaymentFrequency;
  paymentsPerYear: number;
  numberOfPayments: number;
  totalPayments: number;
  totalInterest: number;
  annualInterestRate: number;
  loanTermYears: number;
  timeline: LoanTimelinePoint[];
}
