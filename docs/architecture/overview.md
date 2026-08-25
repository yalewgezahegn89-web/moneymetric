# MoneyMetric Architecture Overview

## Project Structure

```
moneymetric/
├── app/                  # Next.js App Router pages and layouts
├── calculators/          # Calculator engine, types, and registry
├── components/           # Reusable UI components
│   ├── navigation/       # Header, footer, and navigation components
│   ├── home/             # Homepage-specific components
│   ├── ui/               # Generic UI primitives
│   ├── calculators/      # Calculator display components
│   └── ads/              # Ad placement components
├── config/               # Site configuration, navigation, countries
├── lib/                  # Utility functions (currency, SEO, formatting)
├── content/              # Static content (guides, categories)
├── docs/                 # Architecture documentation
└── tests/                # Test suites (unit, integration, e2e)
```

## Core Principles

1. **Separation of Concerns**: Calculator logic is completely separate from UI components.
2. **No Duplication**: Each calculator is defined once in the registry; UI consumes it.
3. **Server-First**: Components are Server Components by default; client interactivity is explicit.
4. **SEO-First**: Metadata is generated programmatically; semantic HTML is used throughout.
5. **Mobile-First**: All layouts and components are designed for mobile first, then enhanced.
6. **Accessibility**: ARIA attributes, semantic markup, and keyboard navigation from the start.
7. **Multi-Country**: Currency, locale, and formatting are abstracted and country-aware.

## Key Layers

### Calculator Engine (`calculators/`)
- `types.ts` - Defines Calculator, CalculatorInput, CalculatorResult, and CalculatorMeta interfaces.
- `engine/` - Pure calculation functions (no React, no UI).
- `registry.ts` - Central registry of all calculators, with query functions.

### UI Layer (`components/`)
- Consumes calculator definitions from the registry.
- Renders forms, results, and visualizations.
- Never contains financial formulas or business logic.

### Configuration (`config/`)
- `site.ts` - Brand identity, metadata, and URLs.
- `navigation.ts` - Site navigation structure.
- `countries.ts` - Country definitions, currencies, and locale settings.

### Utilities (`lib/`)
- Currency formatting and conversion.
- Localization helpers.
- SEO metadata generation.
- Analytics event tracking (placeholder).

### Monetization (`components/ads/`)
- `AdSlot` component with position-based rendering.
- No ad provider is connected; the component is a placeholder for future integration.
- Ad slots are never hardcoded into page content.
