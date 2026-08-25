# Calculator Architecture

## Overview

The calculator system is designed with strict separation between business logic and presentation.

## Layers

### 1. Calculator Engine (`calculators/engine/`)

Pure TypeScript functions that perform financial calculations. These functions:
- Take inputs as plain objects.
- Return results as plain objects.
- Have no dependency on React, Next.js, or any UI framework.
- Are independently testable.

### 2. Calculator Types (`calculators/types.ts`)

Defines the shape of every calculator:
- `CalculatorMeta` - Title, description, slug, category, keywords.
- `CalculatorInput` - Input field definitions with validation rules.
- `CalculatorResult` - Output field definitions with formatted values.
- `Calculator` - The complete calculator definition including its `calculate` function.

### 3. Calculator Registry (`calculators/registry.ts`)

The central source of truth for all calculators:
- `calculatorRegistry` - Array of registered calculators.
- `getCalculatorBySlug(slug)` - Find a calculator by URL slug.
- `getCalculatorsByCategory(category)` - Filter by category.
- `getCalculatorsByCountry(country)` - Filter by supported country.
- `registerCalculator(calculator)` - Add a new calculator to the registry.

### 4. UI Components (`components/calculators/`)

Render calculator inputs and results:
- `CalculatorCard` - Card display for listing pages.
- Form components (to be added) for input collection.
- Result display components (to be added).

## Adding a New Calculator

1. Create a calculation function in `calculators/engine/`.
2. Define the calculator's meta, inputs, and results in `calculators/types.ts`.
3. Register it in `calculators/registry.ts`.
4. Create any required UI components in `components/calculators/`.
5. Add unit tests in `tests/unit/calculators/`.

## Country Support

Each calculator declares which countries it supports via `supportedCountries`.
Country-specific defaults, min/max values, and step sizes are defined in `CalculatorInput.countrySpecific`.
