import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { getAllCategories, getCalculatorsByCategory } from "@/calculators/registry";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Categories",
  "Browse MoneyMetric calculators by category.",
  "/categories"
);

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Categories
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse our financial calculators organized by category.
        </p>
        
        {categories.length > 0 ? (
          <div className="mt-8 space-y-12">
            {categories.map((category) => {
              const categoryCalculators = getCalculatorsByCategory(category);
              return (
                <section key={category} id={category.toLowerCase()}>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {category}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {category === "Savings" && "Calculate how your savings and investments can grow over time."}
                    {category === "Loans" && "Estimate payments and understand the cost of borrowing."}
                    {!["Savings", "Loans"].includes(category) && `${categoryCalculators.length} calculator${categoryCalculators.length !== 1 ? "s" : ""} available.`}
                  </p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categoryCalculators.map((calc) => (
                      <CalculatorCard
                        key={calc.meta.slug}
                        title={calc.meta.title}
                        description={calc.meta.description}
                        href={`/calculators/${calc.meta.slug}`}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">
              Categories will appear here once calculators are registered.
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-gray-100 pt-8">
          <Link
            href="/calculators"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            &larr; View all calculators
          </Link>
        </div>
      </Container>
    </section>
  );
}
