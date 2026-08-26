import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "MoneyMetric disclaimer. Important information about the limitations of our calculators and tools.",
};

export default function DisclaimerPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Disclaimer
          </h1>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <h2 className="text-xl font-semibold text-gray-900">
              Calculator Estimates
            </h2>
            <p>
              All MoneyMetric calculators provide estimates only. Results are
              calculated based on the mathematical formulas and documented
              assumptions for each tool. They are not guarantees of future
              performance or actual outcomes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Not Lender Quotes
            </h2>
            <p>
              Calculator results do not constitute lending offers, rate quotes,
              or commitments from any financial institution. Actual loan terms,
              interest rates, fees, and approval decisions are determined by
              lenders based on their own criteria and applicable regulations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Not Financial Advice
            </h2>
            <p>
              MoneyMetric calculators are educational tools. They do not provide
              financial advice, investment recommendations, tax guidance, or
              professional consultations. Consult a qualified financial
              advisor for personalized advice.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              User Inputs
            </h2>
            <p>
              Calculator results depend entirely on the values you enter. Inaccurate
              or incomplete inputs will produce inaccurate results. You are
              responsible for verifying that your inputs reflect your actual
              situation.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Real-World Variations
            </h2>
            <p>
              Actual financial products may differ from calculator estimates due
              to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Taxes and insurance</li>
              <li>Origination fees and closing costs</li>
              <li>Lender-specific rules and conventions</li>
              <li>Jurisdiction-specific regulations</li>
              <li>Market conditions and rate changes</li>
              <li>Individual creditworthiness</li>
              <li>Additional fees not captured in our models</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              Investment Projections
            </h2>
            <p>
              Compound interest calculations show hypothetical projections based
              on the assumed rate of return. Actual investment returns vary and
              may be negative. Past performance does not guarantee future
              results.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Assumptions
            </h2>
            <p>
              Each calculator documents its specific assumptions. Review the
              assumptions section on each calculator page to understand what is
              and is not included in the calculations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              For questions about our calculators or methodology, please visit
              our{" "}
              <Link
                href="/methodology"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
              >
                methodology page
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
              >
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}