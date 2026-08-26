import type { Guide } from "../types";
import { compoundInterestGuide } from "./compound-interest";
import { mortgageAmortizationGuide } from "./mortgage-amortization";

const guideRegistry: Record<string, Guide> = {
  "how-compound-interest-works": compoundInterestGuide,
  "how-mortgage-amortization-works": mortgageAmortizationGuide,
};

export function getGuideBySlug(slug: string): Guide | undefined {
  return guideRegistry[slug];
}

export function getAllGuideSlugs(): string[] {
  return Object.keys(guideRegistry);
}

export function getAllGuides(): Guide[] {
  return Object.values(guideRegistry);
}