import type { Calculator, CalculatorResult } from "./types";
import type { CompoundInterestInput } from "./engine/types";
import type { MortgageInput } from "./engine/types";
import { calculateCompoundInterest } from "./engine/compound-interest";
import { calculateMortgage } from "./engine/mortgage";

const compoundInterestCalculator: Calculator = {
  meta: {
    title: "Compound Interest Calculator",
    description:
      "Calculate compound interest and estimate how your initial investment and regular contributions could grow over time.",
    slug: "compound-interest",
    category: "Savings",
    keywords: [
      "compound interest calculator",
      "investment growth",
      "savings calculator",
      "compound interest",
    ],
  },
  inputs: [
    {
      name: "initialInvestment",
      label: "Initial Investment",
      type: "number",
      placeholder: "10000",
      min: 0,
      step: 100,
      required: true,
      defaultValue: 10000,
    },
    {
      name: "regularContribution",
      label: "Regular Contribution",
      type: "number",
      placeholder: "500",
      min: 0,
      step: 50,
      required: true,
      defaultValue: 500,
    },
    {
      name: "contributionFrequency",
      label: "Contribution Frequency",
      type: "select",
      required: true,
      defaultValue: "monthly",
      options: [
        { label: "Monthly", value: "monthly" },
        { label: "Quarterly", value: "quarterly" },
        { label: "Annually", value: "annually" },
      ],
    },
    {
      name: "annualInterestRate",
      label: "Annual Interest Rate",
      type: "number",
      placeholder: "7",
      min: 0,
      max: 100,
      step: 0.1,
      required: true,
      defaultValue: 7,
    },
    {
      name: "compoundingFrequency",
      label: "Compounding Frequency",
      type: "select",
      required: true,
      defaultValue: "monthly",
      options: [
        { label: "Annually", value: "annually" },
        { label: "Semi-annually", value: "semi-annually" },
        { label: "Quarterly", value: "quarterly" },
        { label: "Monthly", value: "monthly" },
        { label: "Daily", value: "daily" },
      ],
    },
    {
      name: "investmentYears",
      label: "Investment Period (Years)",
      type: "number",
      placeholder: "20",
      min: 0.01,
      step: 1,
      required: true,
      defaultValue: 20,
    },
  ],
  supportedCountries: ["US", "CA", "GB", "AU"],
  calculate: (inputs: Record<string, number | string | boolean>): CalculatorResult[] => {
    const engineInput: CompoundInterestInput = {
      initialInvestment: Number(inputs.initialInvestment),
      regularContribution: Number(inputs.regularContribution),
      contributionFrequency: inputs.contributionFrequency as CompoundInterestInput["contributionFrequency"],
      annualInterestRate: Number(inputs.annualInterestRate),
      compoundingFrequency: inputs.compoundingFrequency as CompoundInterestInput["compoundingFrequency"],
      investmentYears: Number(inputs.investmentYears),
    };

    const result = calculateCompoundInterest(engineInput);

    return [
      {
        label: "Future Value",
        value: result.futureValue,
        field: { name: "futureValue", label: "Future Value", type: "currency" },
      },
      {
        label: "Initial Investment",
        value: result.initialInvestment,
        field: { name: "initialInvestment", label: "Initial Investment", type: "currency" },
      },
      {
        label: "Total Contributions",
        value: result.totalContributions,
        field: { name: "totalContributions", label: "Total Contributions", type: "currency" },
      },
      {
        label: "Total Interest",
        value: result.totalInterest,
        field: { name: "totalInterest", label: "Total Interest", type: "currency" },
      },
      {
        label: "Effective Annual Rate",
        value: result.effectiveAnnualRate,
        field: { name: "effectiveAnnualRate", label: "Effective Annual Rate", type: "percent", decimals: 2 },
      },
    ];
  },
};

const mortgageCalculator: Calculator = {
  meta: {
    title: "Mortgage Calculator",
    description:
      "Estimate your mortgage principal and interest payment, total interest, and amortization over the life of the loan.",
    slug: "mortgage",
    category: "Loans",
    keywords: [
      "mortgage calculator",
      "home loan calculator",
      "mortgage payment",
      "amortization",
      "principal and interest",
    ],
  },
  inputs: [
    {
      name: "homePrice",
      label: "Home Price",
      type: "number",
      placeholder: "400000",
      min: 0,
      step: 1000,
      required: true,
      defaultValue: 400000,
    },
    {
      name: "downPayment",
      label: "Down Payment",
      type: "number",
      placeholder: "80000",
      min: 0,
      step: 1000,
      required: true,
      defaultValue: 80000,
    },
    {
      name: "annualInterestRate",
      label: "Annual Interest Rate",
      type: "number",
      placeholder: "6.5",
      min: 0,
      max: 100,
      step: 0.1,
      required: true,
      defaultValue: 6.5,
    },
    {
      name: "loanTermYears",
      label: "Loan Term (Years)",
      type: "number",
      placeholder: "30",
      min: 1,
      step: 1,
      required: true,
      defaultValue: 30,
    },
    {
      name: "paymentFrequency",
      label: "Payment Frequency",
      type: "select",
      required: true,
      defaultValue: "monthly",
      options: [
        { label: "Monthly", value: "monthly" },
        { label: "Biweekly", value: "biweekly" },
        { label: "Weekly", value: "weekly" },
      ],
    },
  ],
  supportedCountries: ["US", "CA", "GB", "AU"],
  calculate: (inputs: Record<string, number | string | boolean>): CalculatorResult[] => {
    const engineInput: MortgageInput = {
      homePrice: Number(inputs.homePrice),
      downPayment: Number(inputs.downPayment),
      annualInterestRate: Number(inputs.annualInterestRate),
      loanTermYears: Number(inputs.loanTermYears),
      paymentFrequency: inputs.paymentFrequency as MortgageInput["paymentFrequency"],
    };

    const result = calculateMortgage(engineInput);

    const frequencyLabel: Record<string, string> = {
      monthly: "month",
      biweekly: "biweekly period",
      weekly: "week",
    };
    const periodLabel = frequencyLabel[result.paymentFrequency] ?? "month";

    return [
      {
        label: `Estimated Principal & Interest`,
        value: result.regularPayment,
        field: {
          name: "regularPayment",
          label: `Payment per ${periodLabel}`,
          type: "currency",
          suffix: ` / ${periodLabel}`,
        },
      },
      {
        label: "Loan Amount",
        value: result.loanAmount,
        field: { name: "loanAmount", label: "Loan Amount", type: "currency" },
      },
      {
        label: "Total Payments",
        value: result.totalPayments,
        field: { name: "totalPayments", label: "Total Payments", type: "currency" },
      },
      {
        label: "Total Interest",
        value: result.totalInterest,
        field: { name: "totalInterest", label: "Total Interest", type: "currency" },
      },
      {
        label: "Number of Payments",
        value: result.numberOfPayments,
        field: { name: "numberOfPayments", label: "Number of Payments", type: "number" },
      },
    ];
  },
};

export const calculatorRegistry: Calculator[] = [compoundInterestCalculator, mortgageCalculator];

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return calculatorRegistry.find((c) => c.meta.slug === slug);
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculatorRegistry.filter((c) => c.meta.category === category);
}

export function getCalculatorsByCountry(country: string): Calculator[] {
  return calculatorRegistry.filter((c) => c.supportedCountries.includes(country as never));
}

export function getAllCalculatorSlugs(): string[] {
  return calculatorRegistry.map((c) => c.meta.slug);
}

export function getAllCategories(): string[] {
  return [...new Set(calculatorRegistry.map((c) => c.meta.category))];
}

export function registerCalculator(calculator: Calculator): void {
  calculatorRegistry.push(calculator);
}
