"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalculatorSeoContent as CalculatorSeoContentType } from "@/content/types";
import { getCalculatorBySlug } from "@/calculators/registry";
import { getGuideBySlug } from "@/content/guides/registry";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
      {children}
    </h2>
  );
}

function SectionProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
      {children}
    </div>
  );
}

function FormulaBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6">
      <p className="font-mono text-sm leading-relaxed text-gray-800 sm:text-base">
        {children}
      </p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 sm:text-base"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <span className="ml-4 flex-shrink-0 text-gray-400" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-sm leading-relaxed text-gray-600 sm:text-base">
          {answer}
        </div>
      )}
    </div>
  );
}

export function CalculatorSeoSections({
  content,
}: {
  content: CalculatorSeoContentType;
}) {
  const relatedCalculators = content.relatedCalculatorSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((calc): calc is NonNullable<typeof calc> => calc !== null);

  const relatedGuides = (content.relatedGuideSlugs ?? [])
    .map((slug) => getGuideBySlug(slug))
    .filter((guide): guide is NonNullable<typeof guide> => guide !== null);

  return (
    <div className="mt-16 space-y-12 border-t border-gray-100 pt-12">
      <section>
        <SectionHeading>How It Works</SectionHeading>
        <SectionProse>{content.howItWorks}</SectionProse>
      </section>

      <section>
        <SectionHeading>Formula</SectionHeading>
        <FormulaBlock>{content.formula}</FormulaBlock>
      </section>

      <section>
        <SectionHeading>Example</SectionHeading>
        <SectionProse>{content.example}</SectionProse>
      </section>

      <section>
        <SectionHeading>Understanding Your Results</SectionHeading>
        <SectionProse>{content.interpretation}</SectionProse>
      </section>

      <section>
        <SectionHeading>Assumptions and Limitations</SectionHeading>
        <SectionProse>{content.assumptions}</SectionProse>
      </section>

      {content.faqs.length > 0 && (
        <section>
          <SectionHeading>Frequently Asked Questions</SectionHeading>
          <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4 sm:px-6">
            {content.faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section>
          <SectionHeading>Learn More</SectionHeading>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                  {guide.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedCalculators.length > 0 && (
        <section>
          <SectionHeading>Related Calculators</SectionHeading>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedCalculators.map((calculator) => (
              <Link
                key={calculator.meta.slug}
                href={`/calculators/${calculator.meta.slug}`}
                className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600">
                  {calculator.meta.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {calculator.meta.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}