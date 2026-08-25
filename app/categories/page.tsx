import { Container } from "@/components/ui/Container";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Categories",
  "Browse MoneyMetric calculators by category.",
  "/categories"
);

export default function CategoriesPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Categories
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse calculators by category.
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Category listings will appear here once calculators are registered.
          </p>
        </div>
      </Container>
    </section>
  );
}
