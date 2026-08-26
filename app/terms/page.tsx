import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "MoneyMetric terms of use. Read our terms and conditions for using this site.",
};

export default function TermsPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Use
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 2026
          </p>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <h2 className="text-xl font-semibold text-gray-900">
              Acceptance of Terms
            </h2>
            <p>
              By using MoneyMetric, you agree to these terms of use. If you do
              not agree, please do not use the site.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Use of the Site
            </h2>
            <p>
              MoneyMetric provides financial calculators and educational tools
              for informational purposes. You may use the site for personal,
              non-commercial purposes.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Calculator Estimates
            </h2>
            <p>
              All calculator results are estimates based on the mathematical
              models and documented assumptions for each tool. Results are not
              financial advice, lending offers, investment recommendations, or
              guarantees of any kind.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Informational and Educational Nature
            </h2>
            <p>
              MoneyMetric is an informational and educational resource. The
              calculators and content are designed to help users understand
              financial concepts and explore scenarios. They are not substitutes
              for professional financial advice.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              User Responsibility
            </h2>
            <p>
              You are responsible for the accuracy of information you enter into
              calculators. Results depend entirely on the inputs you provide and
              the assumptions documented for each tool.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Limitations and Accuracy
            </h2>
            <p>
              MoneyMetric aims to provide accurate calculations based on
              published mathematical formulas. However, real-world financial
              products may involve additional factors, fees, rules, and
              conventions not captured by our models.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Intellectual Property
            </h2>
            <p>
              All content, design, code, and calculations on MoneyMetric are
              owned by or licensed to MoneyMetric. You may not reproduce,
              distribute, or create derivative works without permission.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Acceptable Use
            </h2>
            <p>
              You agree not to misuse the site, attempt to access it
              unauthorized, or use it for any unlawful purpose.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Limitation of Liability
            </h2>
            <p>
              MoneyMetric is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for any damages arising from your use
              of the site or reliance on calculator results.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Changes to Terms
            </h2>
            <p>
              We may update these terms from time to time. Changes will be
              posted on this page with an updated revision date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              For questions about these terms, please visit our{" "}
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