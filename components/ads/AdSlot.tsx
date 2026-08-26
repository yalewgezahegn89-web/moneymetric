import type { AdPlacement } from "@/config/monetization";

export type { AdPlacement };

export interface AdSlotProps {
  /** The placement position for this ad slot */
  placement: AdPlacement;
  /** Additional CSS classes for layout */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Whether ads are enabled (defaults to false) */
  enabled?: boolean;
}

/**
 * Provider-independent AdSlot component.
 *
 * Renders a placeholder when ads are disabled.
 * When a provider adapter is implemented, this component
 * will delegate to the provider's ad unit rendering.
 *
 * @see docs/architecture/monetization-architecture.md
 */
export function AdSlot({
  placement,
  className = "",
  label,
  enabled = false,
}: AdSlotProps) {
  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`ad-slot ad-slot--${placement} flex items-center justify-center bg-gray-100 ${className}`}
      role="complementary"
      aria-label={label ?? `Advertisement (${placement})`}
      data-ad-placement={placement}
    >
      <span className="text-xs text-gray-400">
        Advertisement
      </span>
    </div>
  );
}