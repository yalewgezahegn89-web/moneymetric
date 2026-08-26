import type { CalculatorSeoContent } from "./types";
import { compoundInterestContent } from "./calculators/compound-interest";
import { mortgageContent } from "./calculators/mortgage";

const contentRegistry: Record<string, CalculatorSeoContent> = {
  "compound-interest": compoundInterestContent,
  mortgage: mortgageContent,
};

export function getCalculatorSeoContent(
  slug: string
): CalculatorSeoContent | undefined {
  return contentRegistry[slug];
}