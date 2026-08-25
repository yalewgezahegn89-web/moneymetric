import { Container } from "@/components/ui/Container";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { calculatorRegistry } from "@/calculators/registry";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Calculators",
  "Browse all MoneyMetric financial calculators.",
  "/calculators"
);

export default function CalculatorsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Calculators
        </h1>
        {calculatorRegistry.length > 0 ? (
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
