export interface FaqItem {
  question: string;
  answer: string;
}

export interface CalculatorSeoContent {
  slug: string;
  intro: string;
  howItWorks: string;
  formula: string;
  example: string;
  interpretation: string;
  assumptions: string;
  faqs: FaqItem[];
  relatedCalculatorSlugs: string[];
  relatedGuideSlugs?: string[];
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  callout?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  relatedCalculatorSlug: string;
  intro: string;
  sections: GuideSection[];
  faqs: FaqItem[];
  relatedGuideSlugs: string[];
  lastUpdated: string;
}