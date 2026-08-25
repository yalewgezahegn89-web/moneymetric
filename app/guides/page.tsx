import { Container } from "@/components/ui/Container";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Guides",
  "Financial guides and money tips from MoneyMetric.",
  "/guides"
);

export default function GuidesPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Guides
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Financial guides and money tips.
        </p>
        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Guides will be published here.
          </p>
        </div>
      </Container>
    </section>
  );
}
