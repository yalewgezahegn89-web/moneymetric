import { Container } from "@/components/ui/Container";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Search",
  "Search MoneyMetric calculators and guides.",
  "/search",
  { noindex: true }
);

export default function SearchPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Search
        </h1>
        <div className="mt-8">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search calculators and guides..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Search results will appear here.
          </p>
        </div>
      </Container>
    </section>
  );
}
