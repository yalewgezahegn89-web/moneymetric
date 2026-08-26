import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "MoneyMetric methodology. Learn how our calculators work, our approach to accuracy, and our commitment to transparency.",
};

export default function MethodologyPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Methodology
          </h1>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <p>
              MoneyMetric aims to provide clear, reproducible estimates based on
              documented mathematical models. This page explains our approach to
              building trustworthy financial calculators.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              1. Inputs
            </h2>
            <p>
              Each calculator accepts specific inputs relevant to its purpose.
              Inputs are validated to ensure they are valid numbers within
              acceptable ranges. Invalid inputs produce clear error messages
              rather than incorrect results.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              2. Validation
            </h2>
            <p>
              Before any calculation runs, inputs are checked for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Valid numeric values (no NaN or Infinity)</li>
              <li>Non-negative amounts where required</li>
              <li>Positive time periods</li>
              <li>Valid payment frequencies</li>
              <li>Integer payment counts where required</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              3. Pure Calculation Engines
            </h2>
            <p>
              Financial calculations are performed by pure TypeScript functions
              with no dependencies on UI frameworks, browser APIs, or external
              services. This separation ensures:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Calculations are deterministic and reproducible</li>
              <li>Engines can be tested independently</li>
              <li>No side effects or external state</li>
              <li>Mathematical logic is isolated from presentation</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              4. Precision
            </h2>
            <p>
              Calculations maintain full floating-point precision throughout.
              Intermediate values are not rounded. Rounding occurs only for
              display purposes, and the display rounding is consistent across
              all results.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              5. Results
            </h2>
            <p>
              Results are presented as clearly labeled estimates. Each result
              includes the information necessary for users to understand what
              the numbers represent and what assumptions underlie them.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              6. Documented Assumptions
            </h2>
            <p>
              Every calculator includes a clearly visible assumptions section
              that explains:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>What the calculator includes</li>
              <li>What the calculator excludes</li>
              <li>Limitations of the mathematical model</li>
              <li>Real-world factors not captured</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              7. Testing
            </h2>
            <p>
              Each calculator engine is tested against independently verified
              expected values. Tests cover:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reference scenarios with known correct answers</li>
              <li>Edge cases (zero values, extreme inputs)</li>
              <li>Mathematical identities and invariants</li>
              <li>Validation of error handling</li>
              <li>Payment frequency variations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              Calculator Trust
            </h2>
            <p>
              MoneyMetric calculators are built with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Explicit mathematical models</li>
              <li>Input validation</li>
              <li>Automated tests</li>
              <li>Documented assumptions</li>
              <li>Transparent limitations</li>
            </ul>
            <p>
              We aim to provide clear, reproducible estimates based on the
              documented assumptions for each calculator. We do not claim
              perfection or guarantee accuracy for all possible use cases.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Calculator Pages
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="/calculators/compound-interest"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  Compound Interest Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/mortgage"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/loan"
                  className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
                >
                  Loan Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}