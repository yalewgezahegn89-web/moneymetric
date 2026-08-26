"use client";

import { useState, lazy, Suspense } from "react";
import { calculateMortgage, validateMortgageInput } from "@/calculators/engine/mortgage";
import type { MortgageInput, MortgageResult, MortgageValidationError } from "@/calculators/engine/types";
import { formatCurrency } from "@/lib/formatting";
import { useCurrencyInput } from "@/hooks/useCurrencyInput";

const AmortizationChart = lazy(() =>
  import("./AmortizationChart").then((mod) => ({ default: mod.AmortizationChart }))
);

const DEFAULTS: MortgageInput = {
  homePrice: 400000,
  downPayment: 80000,
  annualInterestRate: 6.5,
  loanTermYears: 30,
  paymentFrequency: "monthly",
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "month",
  biweekly: "biweekly period",
  weekly: "week",
};

export function MortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInput>(DEFAULTS);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [errors, setErrors] = useState<MortgageValidationError[]>([]);
  
  const homePriceInput = useCurrencyInput(DEFAULTS.homePrice);
  const downPaymentInput = useCurrencyInput(DEFAULTS.downPayment);

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleCurrencyChange(
    field: "homePrice" | "downPayment",
    displayValue: string
  ) {
    const input = field === "homePrice" ? homePriceInput : downPaymentInput;
    input.handleChange(displayValue);
    setInputs((prev) => ({
      ...prev,
      [field]: input.numericValue,
    }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function handleNumericChange(
    field: keyof MortgageInput,
    value: string
  ) {
    const parsed = value === "" ? NaN : parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: parsed,
    }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function handleChange(
    field: keyof MortgageInput,
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateMortgageInput(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    const calculationResult = calculateMortgage(inputs);
    setResult(calculationResult);
    setErrors([]);
  }

  function handleReset() {
    setInputs(DEFAULTS);
    homePriceInput.reset(DEFAULTS.homePrice);
    downPaymentInput.reset(DEFAULTS.downPayment);
    setResult(null);
    setErrors([]);
  }

  const periodLabel = FREQUENCY_LABELS[inputs.paymentFrequency as string] ?? "month";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="homePrice" className="block text-sm font-medium text-gray-700">
            Home Price
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="homePrice"
              type="text"
              inputMode="numeric"
              value={homePriceInput.displayValue}
              onChange={(e) => handleCurrencyChange("homePrice", e.target.value)}
              min={0}
              step={1000}
              placeholder="400,000"
              className={`block w-full rounded-lg border py-2.5 pl-7 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                getFieldError("homePrice")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={getFieldError("homePrice") ? "homePrice-error" : undefined}
              aria-invalid={!!getFieldError("homePrice")}
            />
          </div>
          {getFieldError("homePrice") && (
            <p id="homePrice-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("homePrice")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">
            Down Payment
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="downPayment"
              type="text"
              inputMode="numeric"
              value={downPaymentInput.displayValue}
              onChange={(e) => handleCurrencyChange("downPayment", e.target.value)}
              min={0}
              step={1000}
              placeholder="80,000"
              className={`block w-full rounded-lg border py-2.5 pl-7 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                getFieldError("downPayment")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={getFieldError("downPayment") ? "downPayment-error" : undefined}
              aria-invalid={!!getFieldError("downPayment")}
            />
          </div>
          {getFieldError("downPayment") && (
            <p id="downPayment-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("downPayment")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="annualInterestRate" className="block text-sm font-medium text-gray-700">
            Annual Interest Rate
          </label>
          <div className="mt-1 relative">
            <input
              id="annualInterestRate"
              type="number"
              value={Number.isNaN(inputs.annualInterestRate) ? "" : inputs.annualInterestRate}
              onChange={(e) => handleNumericChange("annualInterestRate", e.target.value)}
              min={0}
              max={100}
              step={0.1}
              placeholder="6.5"
              className={`block w-full rounded-lg border py-2.5 pl-4 pr-8 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                getFieldError("annualInterestRate")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={getFieldError("annualInterestRate") ? "annualInterestRate-error" : undefined}
              aria-invalid={!!getFieldError("annualInterestRate")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
          {getFieldError("annualInterestRate") && (
            <p id="annualInterestRate-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("annualInterestRate")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="loanTermYears" className="block text-sm font-medium text-gray-700">
            Loan Term (Years)
          </label>
          <input
            id="loanTermYears"
            type="number"
            value={Number.isNaN(inputs.loanTermYears) ? "" : inputs.loanTermYears}
            onChange={(e) => handleNumericChange("loanTermYears", e.target.value)}
            min={1}
            step={1}
            placeholder="30"
            className={`mt-1 block w-full rounded-lg border py-2.5 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
              getFieldError("loanTermYears")
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            aria-describedby={getFieldError("loanTermYears") ? "loanTermYears-error" : undefined}
            aria-invalid={!!getFieldError("loanTermYears")}
          />
          {getFieldError("loanTermYears") && (
            <p id="loanTermYears-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("loanTermYears")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700">
            Payment Frequency
          </label>
          <select
            id="paymentFrequency"
            value={inputs.paymentFrequency}
            onChange={(e) => handleChange("paymentFrequency", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Biweekly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Reset
          </button>
        </div>
      </form>

      <div>
        {result ? (
          <ResultCard result={result} periodLabel={periodLabel} />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">
              Enter your values and click Calculate to see results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ result, periodLabel }: { result: MortgageResult; periodLabel: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">Estimated Principal &amp; Interest</p>
      <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {formatCurrency(result.regularPayment)}
        <span className="text-lg font-medium text-gray-500"> / {periodLabel}</span>
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:gap-y-5">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Loan Amount</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.loanAmount)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Payments</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.totalPayments)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Interest</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Number of Payments</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {result.numberOfPayments.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <Suspense fallback={<div className="h-72 sm:h-80 animate-pulse rounded-lg bg-gray-100" />}>
          <AmortizationChart result={result} />
        </Suspense>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-500">Assumptions</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>This estimate covers principal and interest only.</li>
          <li>Property taxes, homeowner&apos;s insurance, PMI, HOA fees, and other costs are not included.</li>
          <li>Payment frequency uses the selected nominal periodic-payment model.</li>
          <li>Actual lender calculations may differ because of lender-specific or jurisdiction-specific conventions.</li>
          <li>Results are estimates and should not be considered a lender quote.</li>
        </ul>
      </div>
    </div>
  );
}
