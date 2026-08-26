import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { calculatorRegistry, getAllCategories, getCalculatorsByCategory } from "@/calculators/registry";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Calculators",
  "Browse all MoneyMetric financial calculators.",
  "/calculators"
);

export default function CalculatorsPage() {
  const categories = getAllCategories();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Calculators
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Simple, accurate financial calculators for everyday decisions.
        </p>
        
        {calculatorRegistry.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {calculatorRegistry.map((calc) => (
                <CalculatorCard
                  key={calc.meta.slug}
                  title={calc.meta.title}
                  description={calc.meta.description}
                  href={`/calculators/${calc.meta.slug}`}
                />
              ))}
            </div>

            {categories.length > 0 && (
              <div className="mt-12 border-t border-gray-100 pt-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Browse by Category
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/categories#${category.toLowerCase()}`}
                      className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                    >
                      {category}
                      <span className="ml-2 text-gray-400">
                        ({getCalculatorsByCategory(category).length})
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">
              Calculators are coming soon.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              We&apos;re building a collection of simple, accurate financial
              tools.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
