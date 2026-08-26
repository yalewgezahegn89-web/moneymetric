import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getAllGuides } from "@/content/guides/registry";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata(
  "Guides",
  "Financial guides and money tips from MoneyMetric.",
  "/guides"
);

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Guides
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Learn how financial concepts work and how to use our calculators effectively.
        </p>

        {guides.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {guide.description}
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  Last updated: {guide.lastUpdated}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">
              Guides will be published here.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
