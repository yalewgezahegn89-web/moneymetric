# Monetization Architecture

## Overview

MoneyMetric uses a provider-independent monetization foundation that allows future ads and revenue features to be introduced without damaging calculator UX, page performance, accessibility, SEO, or layout stability.

## Architecture Principles

1. **Provider Independence**: The UI knows only about `AdSlot`, not about ad providers
2. **Default Off**: Ads are disabled by default (`adsEnabled: false`)
3. **Placement Safety**: Strict rules prevent ads from interrupting calculator flow
4. **Performance First**: No ad-provider scripts load while `adsEnabled = false`
5. **Accessibility**: All ad slots include proper ARIA semantics

## Configuration

### Monetization Config (`config/monetization.ts`)

```typescript
export type AdPlacement =
  | "top"
  | "after-result"
  | "content-middle"
  | "sidebar"
  | "bottom";
```

| Placement | Description | Calculator Safe | Content Safe |
|-----------|-------------|-----------------|--------------|
| `top` | Top of page | No | Yes |
| `after-result` | After calculator result | Yes | No |
| `content-middle` | Between content sections | No | Yes |
| `sidebar` | Desktop sidebar | No | Yes |
| `bottom` | Bottom of page | Yes | Yes |

### Default Configuration

```typescript
export const defaultMonetizationConfig: MonetizationConfig = {
  adsEnabled: false,
  placements: {
    top: { enabled: true, responsive: { mobile: true, tablet: true, desktop: true } },
    "after-result": { enabled: true, responsive: { mobile: true, tablet: true, desktop: true } },
    "content-middle": { enabled: true, responsive: { mobile: true, tablet: true, desktop: true } },
    sidebar: { enabled: true, responsive: { mobile: false, tablet: true, desktop: true } },
    bottom: { enabled: true, responsive: { mobile: true, tablet: true, desktop: true } },
  },
};
```

## AdSlot Component (`components/ads/AdSlot.tsx`)

### Props

```typescript
export interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  label?: string;
  enabled?: boolean; // defaults to false
}
```

### Behavior

- When `enabled = false` (default): Returns `null` (no rendering)
- When `enabled = true`: Renders placeholder with proper semantics

### Accessibility

- `role="complementary"` on container
- `aria-label` identifies the ad slot
- `data-ad-placement` for provider integration

## Placement Rules

### Calculator Pages

**NEVER place an ad:**
- Between form inputs
- Between Calculate and Result
- Between primary result and first supporting metrics
- Inside validation messages

**Safe placements:**
- `after-result`: After chart/key information, before assumptions
- `bottom`: End of page

### Content Pages (Guides)

**Safe placements:**
- `content-middle`: Between content sections
- `bottom`: End of page
- `sidebar`: Desktop only (becomes `content-middle` on mobile)

## Responsive Behavior

| Placement | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| `top` | ✓ | ✓ | ✓ |
| `after-result` | ✓ | ✓ | ✓ |
| `content-middle` | ✓ | ✓ | ✓ |
| `sidebar` | ✗ | ✓ | ✓ |
| `bottom` | ✓ | ✓ | ✓ |

**Sidebar rule:** On mobile, sidebar placement becomes a normal in-content placement or is disabled.

## Layout Stability

- Ad slots reserve predictable space when enabled
- No visually intrusive empty boxes when ads are disabled
- Development mode may render placeholders for testing

## Provider Integration (Future)

When an ad provider is selected:

1. Create provider adapter in `components/ads/providers/`
2. Update `AdSlot` to render provider's ad unit
3. Add provider configuration to `config/`
4. Implement ad loading, error handling, and fallback states

## SEO Impact

- Monetization components do not alter canonical URLs
- Monetization components do not alter metadata
- Monetization components do not alter indexation
- Monetization components do not alter structured data
- Ad content is clearly distinguishable from editorial content

## Performance Impact

- While `adsEnabled = false`: Zero client-side overhead
- No ad-provider scripts loaded
- No third-party scripts added
- When ads enabled: Provider scripts loaded asynchronously