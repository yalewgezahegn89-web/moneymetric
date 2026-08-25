import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CalculatorCard } from "@/components/calculators/CalculatorCard";
import { calculatorRegistry } from "@/calculators/registry";

export default function HomePage() {
  const published = calculatorRegistry.filter(
    (c) => c.meta.slug,
  );

  return (
    <>
      <section className="bg-gray-50 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Make Better Money Decisions
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simple, accurate financial calculators and money tools for
              everyday decisions.
            </p>
            <div className="mt-10">
              <Link
                href="/calculators"
                className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Browse Calculators
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Popular Calculators
          </h2>
          {published.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {published.map((calc) => (
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
    </>
  );
}
