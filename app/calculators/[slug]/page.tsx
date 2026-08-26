import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCalculatorBySlug } from "@/calculators/registry";
import { getCalculatorSeoContent } from "@/content/registry";
import { generateCalculatorMetadata, generateBreadcrumbSchema } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { CalculatorSeoSections } from "@/components/calculators/CalculatorSeoContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return {};
  return generateCalculatorMetadata(calculator.meta);
}

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  "compound-interest": CompoundInterestCalculator,
  mortgage: MortgageCalculator,
};

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  const CalculatorComponent = CALCULATOR_COMPONENTS[slug];
  const seoContent = getCalculatorSeoContent(slug);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    { name: calculator.meta.title, path: `/calculators/${slug}` },
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
              <Link href="/calculators" className="hover:text-gray-600">Calculators</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-gray-600">
              {calculator.meta.title}
            </li>
          </ol>
        </nav>

        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {calculator.meta.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {seoContent?.intro ?? calculator.meta.description}
          </p>

          <div className="mt-10">
            {CalculatorComponent ? (
              <CalculatorComponent />
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-gray-500">Calculator coming soon.</p>
              </div>
            )}
          </div>

          {seoContent && <CalculatorSeoSections content={seoContent} />}
        </div>
      </Container>
    </section>
  );
}
