"use client";

import { useState } from "react";
import { calculateCompoundInterest, validateCompoundInterestInput } from "@/calculators/engine/compound-interest";
import type { CompoundInterestInput, CompoundInterestResult, CompoundInterestValidationError } from "@/calculators/engine/types";
import { formatCurrency, formatPercent } from "@/lib/formatting";
import { GrowthChart } from "./GrowthChart";

const DEFAULTS: CompoundInterestInput = {
  initialInvestment: 10000,
  regularContribution: 500,
  contributionFrequency: "monthly",
  annualInterestRate: 7,
  compoundingFrequency: "monthly",
  investmentYears: 20,
};

export function CompoundInterestCalculator() {
  const [inputs, setInputs] = useState<CompoundInterestInput>(DEFAULTS);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [errors, setErrors] = useState<CompoundInterestValidationError[]>([]);

  function getFieldError(field: string): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleChange(
    field: keyof CompoundInterestInput,
    value: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function handleNumericChange(
    field: keyof CompoundInterestInput,
    value: string
  ) {
    const parsed = value === "" ? NaN : parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: parsed,
    }));
    setErrors((prev) => prev.filter((e) => e.field !== field));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateCompoundInterestInput(inputs);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    const calculationResult = calculateCompoundInterest(inputs);
    setResult(calculationResult);
    setErrors([]);
  }

  function handleReset() {
    setInputs(DEFAULTS);
    setResult(null);
    setErrors([]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <label htmlFor="initialInvestment" className="block text-sm font-medium text-gray-700">
            Initial Investment
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="initialInvestment"
              type="number"
              value={Number.isNaN(inputs.initialInvestment) ? "" : inputs.initialInvestment}
              onChange={(e) => handleNumericChange("initialInvestment", e.target.value)}
              min={0}
              step={100}
              placeholder="10000"
              className={`block w-full rounded-lg border py-2.5 pl-7 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                getFieldError("initialInvestment")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={getFieldError("initialInvestment") ? "initialInvestment-error" : undefined}
              aria-invalid={!!getFieldError("initialInvestment")}
            />
          </div>
          {getFieldError("initialInvestment") && (
            <p id="initialInvestment-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("initialInvestment")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="regularContribution" className="block text-sm font-medium text-gray-700">
            Regular Contribution
          </label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="regularContribution"
              type="number"
              value={Number.isNaN(inputs.regularContribution) ? "" : inputs.regularContribution}
              onChange={(e) => handleNumericChange("regularContribution", e.target.value)}
              min={0}
              step={50}
              placeholder="500"
              className={`block w-full rounded-lg border py-2.5 pl-7 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                getFieldError("regularContribution")
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              aria-describedby={getFieldError("regularContribution") ? "regularContribution-error" : undefined}
              aria-invalid={!!getFieldError("regularContribution")}
            />
          </div>
          {getFieldError("regularContribution") && (
            <p id="regularContribution-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("regularContribution")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contributionFrequency" className="block text-sm font-medium text-gray-700">
            Contribution Frequency
          </label>
          <select
            id="contributionFrequency"
            value={inputs.contributionFrequency}
            onChange={(e) => handleChange("contributionFrequency", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
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
              placeholder="7"
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
          <label htmlFor="compoundingFrequency" className="block text-sm font-medium text-gray-700">
            Compounding Frequency
          </label>
          <select
            id="compoundingFrequency"
            value={inputs.compoundingFrequency}
            onChange={(e) => handleChange("compoundingFrequency", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 py-2.5 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="annually">Annually</option>
            <option value="semi-annually">Semi-annually</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <div>
          <label htmlFor="investmentYears" className="block text-sm font-medium text-gray-700">
            Investment Period (Years)
          </label>
          <input
            id="investmentYears"
            type="number"
            value={Number.isNaN(inputs.investmentYears) ? "" : inputs.investmentYears}
            onChange={(e) => handleNumericChange("investmentYears", e.target.value)}
            min={0.01}
            step={1}
            placeholder="20"
            className={`mt-1 block w-full rounded-lg border py-2.5 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
              getFieldError("investmentYears")
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            aria-describedby={getFieldError("investmentYears") ? "investmentYears-error" : undefined}
            aria-invalid={!!getFieldError("investmentYears")}
          />
          {getFieldError("investmentYears") && (
            <p id="investmentYears-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {getFieldError("investmentYears")}
            </p>
          )}
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
          <ResultCard result={result} />
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

function ResultCard({ result }: { result: CompoundInterestResult }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">Estimated Future Value</p>
      <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {formatCurrency(result.futureValue)}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Initial Investment</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.initialInvestment)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Contributions</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.totalContributions)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Interest</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Effective Annual Rate</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatPercent(result.effectiveAnnualRate, 2)}
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <GrowthChart
          timeline={result.timeline}
          futureValue={result.futureValue}
          totalContributions={result.totalContributions}
          totalInterest={result.totalInterest}
        />
      </div>

      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-medium text-gray-500">Assumptions</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>Contributions occur at the end of each contribution period.</li>
          <li>Daily compounding uses 365 days per year.</li>
          <li>Results are mathematical estimates and may not reflect actual investment returns.</li>
          <li>Taxes, fees, inflation, and market losses are not included.</li>
        </ul>
      </div>
    </div>
  );
}
