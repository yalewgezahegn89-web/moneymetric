# SEO Architecture

## Approach

MoneyMetric uses Next.js App Router's built-in SEO capabilities with a programmatic metadata generation system.

## Metadata Generation

### Page Metadata
- `lib/seo.ts` provides `generatePageMetadata()` for static pages.
- Each route page exports a `metadata` object.

### Calculator Metadata
- `generateCalculatorMetadata()` creates SEO-optimized metadata for each calculator.
- Titles follow the pattern: `{Calculator Name} | MoneyMetric`.
- Descriptions are pulled from the calculator's `meta.description`.
- Keywords come from `meta.keywords`.

### Structured Data
- `generateBreadcrumbSchema()` generates JSON-LD breadcrumb schema.
- Additional schema types (FAQ, HowTo) will be added as content grows.

## URL Structure

- `/calculators` - Calculator listing page.
- `/calculators/{slug}` - Individual calculator pages (dynamic route).
- `/categories` - Category listing.
- `/categories/{slug}` - Category pages.
- `/guides` - Guide listing.
- `/guides/{slug}` - Individual guides.

## Canonical URLs

Every page sets a canonical URL via `alternates.canonical` to prevent duplicate content issues.

## Open Graph

All pages include Open Graph metadata for social sharing:
- `og:title`
- `og:description`
- `og:url`
- `og:site_name`
- `og:type` (website for pages, article for guides)

## Future Enhancements

- Sitemap generation (`/sitemap.xml`).
- Robots.txt configuration.
- FAQ schema for calculators with common questions.
- HowTo schema for guides.
- Hreflang tags for multi-language support.
