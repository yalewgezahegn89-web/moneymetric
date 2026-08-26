/**
 * Monetization configuration for MoneyMetric.
 *
 * This is a provider-independent configuration layer.
 * Ad provider integration is handled separately via adapter pattern.
 */

export type AdPlacement =
  | "top"
  | "after-result"
  | "content-middle"
  | "sidebar"
  | "bottom";

export interface PlacementConfig {
  /** Whether this placement is active */
  enabled: boolean;
  /** Responsive behavior per breakpoint */
  responsive: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

export interface MonetizationConfig {
  /** Global ads enabled flag */
  adsEnabled: boolean;
  /** Per-placement configuration */
  placements: Record<AdPlacement, PlacementConfig>;
}

const defaultPlacementConfig: PlacementConfig = {
  enabled: true,
  responsive: {
    mobile: true,
    tablet: true,
    desktop: true,
  },
};

const sidebarConfig: PlacementConfig = {
  enabled: true,
  responsive: {
    mobile: false,
    tablet: true,
    desktop: true,
  },
};

export const defaultMonetizationConfig: MonetizationConfig = {
  adsEnabled: false,
  placements: {
    top: defaultPlacementConfig,
    "after-result": defaultPlacementConfig,
    "content-middle": defaultPlacementConfig,
    sidebar: sidebarConfig,
    bottom: defaultPlacementConfig,
  },
};

/**
 * Calculator-safe placement rules.
 * These placements are safe to use in calculator pages.
 */
export const calculatorSafePlacements: AdPlacement[] = [
  "after-result",
  "bottom",
];

/**
 * Content page safe placements.
 * Guide pages may use these placements.
 */
export const contentSafePlacements: AdPlacement[] = [
  "content-middle",
  "bottom",
  "sidebar",
];

/**
 * placements that must NEVER appear in calculator pages.
 */
export const calculatorUnsafePlacements: AdPlacement[] = [
  "top",
];

/**
 * Check if a placement is safe for calculator pages.
 */
export function isCalculatorSafePlacement(placement: AdPlacement): boolean {
  return calculatorSafePlacements.includes(placement);
}

/**
 * Check if a placement is safe for content pages.
 */
export function isContentSafePlacement(placement: AdPlacement): boolean {
  return contentSafePlacements.includes(placement);
}