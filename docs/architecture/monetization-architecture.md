# Monetization Architecture

## Ad System

MoneyMetric uses a component-based ad placement system.

### AdSlot Component

The `AdSlot` component (`components/ads/AdSlot.tsx`) renders advertisement placeholders:

- `position` - Where the ad appears: `header`, `sidebar`, `in-content`, `footer`, `mobile-sticky`.
- `className` - Additional CSS classes for layout.
- `label` - Accessible label for screen readers.

### Position Types

| Position | Description |
|---|---|
| `header` | Top of page, below navigation |
| `sidebar` | Desktop sidebar, below main content on mobile |
| `in-content` | Between content sections |
| `footer` | Bottom of page |
| `mobile-sticky` | Fixed to bottom of viewport on mobile |

### Rules

1. **Never hardcoded**: Ad slots are always rendered as `<AdSlot>` components.
2. **Placed at layout level**: Pages receive ad slot placement through layout composition, not inline.
3. **No provider coupling**: The component renders a placeholder; ad provider integration is a separate concern.
4. **Responsive**: Different ad sizes and positions for mobile vs desktop.
5. **Accessible**: All ad slots include `role="complementary"` and `aria-label`.

## Affiliate System (Future)

- Affiliate links will be managed through a configuration layer.
- Links will be clearly disclosed per FTC guidelines.
- Affiliate content will be separated from editorial content.

## Ad Provider Integration (Future)

When an ad provider is selected:
1. Create a provider adapter in `components/ads/providers/`.
2. Update `AdSlot` to render the provider's ad unit.
3. Add provider configuration to `config/`.
4. Implement ad loading, error handling, and fallback states.
