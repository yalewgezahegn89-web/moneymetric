import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MoneyMetric — simple, accurate financial calculators and money tools for everyday decisions.",
};

export default function AboutPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About MoneyMetric
          </h1>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <p>
              MoneyMetric provides simple, accurate financial calculators and
              money tools for everyday decisions. Our goal is to help people
              understand their finances through clear, transparent calculation
              tools.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              What We Provide
            </h2>
            <p>
              MoneyMetric offers a growing collection of financial calculators,
              including tools for compound interest, mortgage estimation, and
              loan analysis. Each calculator is built with explicit mathematical
              models, documented assumptions, and transparent limitations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Our Approach
            </h2>
            <p>
              We believe financial tools should be honest about what they can
              and cannot do. Every MoneyMetric calculator:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uses published mathematical formulas</li>
              <li>Documents its assumptions clearly</li>
              <li>Shows results as estimates, not guarantees</li>
              <li>Is tested against independent calculations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              What We Are Not
            </h2>
            <p>
              MoneyMetric is not a financial advisor, lender, broker, or
              investment platform. Our calculators provide educational estimates
              based on the assumptions documented for each tool. They do not
              constitute financial advice, lending offers, or investment
              recommendations.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Transparency
            </h2>
            <p>
              We are committed to clarity. Each calculator&apos;s{" "}
              <Link
                href="/methodology"
                className="text-gray-900 underline underline-offset-2 hover:text-gray-700"
              >
                methodology
              </Link>{" "}
              is publicly documented, and every tool includes clear assumptions
              about what is and is not included in its calculations.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}