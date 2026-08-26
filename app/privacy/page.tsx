import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "MoneyMetric privacy policy. Learn how we handle data, cookies, and your privacy.",
};

export default function PrivacyPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500">
            Last updated: August 2026
          </p>

          <div className="mt-8 space-y-6 text-base text-gray-600">
            <h2 className="text-xl font-semibold text-gray-900">
              Information We Collect
            </h2>

            <h3 className="text-lg font-medium text-gray-900">
              Calculator Inputs
            </h3>
            <p>
              When you use MoneyMetric calculators, you enter numerical values
              such as loan amounts, interest rates, and time periods. These
              inputs are processed locally in your browser and are not sent to
              our servers or stored by MoneyMetric.
            </p>

            <h3 className="text-lg font-medium text-gray-900">
              Information You Provide Directly
            </h3>
            <p>
              If you contact us through a contact form or email, we may receive
              information you provide, such as your name, email address, and the
              content of your message. This information is used only to respond
              to your inquiry.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              How We Use Information
            </h2>
            <p>
              Calculator inputs are used solely to perform calculations in your
              browser. We do not store, track, or analyze individual calculator
              usage.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Cookies</h2>
            <p>
              MoneyMetric does not currently use cookies for analytics,
              advertising, or user tracking. If cookies are introduced in the
              future, this policy will be updated accordingly.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Analytics and Advertising
            </h2>
            <p>
              MoneyMetric does not currently use analytics services or serve
              advertisements. If these services are introduced in the future,
              this policy will be updated to reflect how data is handled.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Third-Party Services
            </h2>
            <p>
              MoneyMetric currently uses no third-party services that collect
              user data. If third-party services are added in the future, this
              policy will be updated.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p>
              We take reasonable measures to protect any information you provide
              directly to us. However, no method of electronic transmission or
              storage is completely secure.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Data Retention
            </h2>
            <p>
              We retain information you provide to us only as long as necessary
              to respond to your inquiry or as required by law. Calculator inputs
              are not retained because they are not collected.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have rights regarding
              personal information we hold about you. Please contact us to
              discuss any concerns about your data.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will
              be posted on this page with an updated revision date.
            </p>

            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p>
              For questions about this privacy policy, please visit our{" "}
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