import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getGuideBySlug } from "@/content/guides/registry";
import { getCalculatorBySlug } from "@/calculators/registry";
import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { Container } from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return generatePageMetadata(guide.title, guide.description, `/guides/${slug}`);
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedCalculator = getCalculatorBySlug(guide.relatedCalculatorSlug);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <section className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Container>
        <nav className="mb-6 text-xs text-gray-400" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <li>
              <Link href="/" className="hover:text-gray-600">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/guides" className="hover:text-gray-600">Guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-gray-600">
              {guide.title}
            </li>
          </ol>
        </nav>

        <article className="mx-auto max-w-3xl">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {guide.intro}
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Last updated: {guide.lastUpdated}
            </p>
          </header>

          <div className="mt-10 space-y-10">
            {guide.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 max-w-3xl space-y-4 text-base leading-relaxed text-gray-600">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-4 list-disc pl-6 space-y-2 text-base text-gray-600">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.callout && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    {section.callout}
                  </div>
                )}
              </section>
            ))}

            {relatedCalculator && (
              <section className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Try the Calculator
                </h2>
                <p className="mt-2 text-gray-600">
                  Put what you&apos;ve learned into practice with the{" "}
                  <Link
                    href={`/calculators/${relatedCalculator.meta.slug}`}
                    className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
                  >
                    {relatedCalculator.meta.title}
                  </Link>
                  .
                </p>
                <Link
                  href={`/calculators/${relatedCalculator.meta.slug}`}
                  className="mt-4 inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Try the {relatedCalculator.meta.title}
                </Link>
              </section>
            )}

            {guide.faqs.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  Frequently Asked Questions
                </h2>
                <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                  {guide.faqs.map((faq, index) => (
                    <div key={index} className="p-4 sm:p-6">
                      <h3 className="text-base font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <footer className="mt-12 border-t border-gray-100 pt-8">
            <Link
              href="/guides"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              &larr; Back to all guides
            </Link>
          </footer>
        </article>
      </Container>
    </section>
  );
}