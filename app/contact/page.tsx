import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MoneyMetric. Contact information for questions and feedback.",
};

export default function ContactPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact
          </h1>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <p>
              We welcome your questions, feedback, and suggestions for
              improving MoneyMetric.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              How to Reach Us
            </h2>
            <p>
              For general inquiries, feature requests, or to report an issue
              with any of our calculators, please reach out through our public
              contact channel.
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-medium text-gray-900">
                Contact Channel
              </p>
              <p className="mt-2 text-sm text-gray-600">
                A public contact method will be configured before launch. Until
                then, please use the feedback mechanisms available on the site.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              What We Can Help With
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Questions about how our calculators work</li>
              <li>Reporting incorrect or unexpected calculation results</li>
              <li>Suggesting new calculator features or tools</li>
              <li>General feedback about the site</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">
              What We Cannot Provide
            </h2>
            <p>
              MoneyMetric does not provide financial advice, lending services,
              investment recommendations, or professional consultations. Our
              tools are educational resources only.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}