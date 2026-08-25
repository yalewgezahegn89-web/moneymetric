import type { CountryCode } from "@/config/countries";

export interface CalculatorInput {
  name: string;
  label: string;
  type: "number" | "select" | "boolean";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  required?: boolean;
  defaultValue?: number | string | boolean;
  countrySpecific?: Partial<Record<CountryCode, { default?: number; min?: number; max?: number; step?: number }>>;
}

export interface CalculatorField {
  name: string;
  label: string;
  type: "number" | "currency" | "percent" | "select" | "boolean";
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export interface CalculatorResult {
  label: string;
  value: number;
  field: CalculatorField;
  description?: string;
}

export interface CalculatorMeta {
  title: string;
  description: string;
  slug: string;
  category: string;
  keywords: string[];
  icon?: string;
}

export interface Calculator {
  meta: CalculatorMeta;
  inputs: CalculatorInput[];
  supportedCountries: CountryCode[];
  calculate: (inputs: Record<string, number | string | boolean>, country: CountryCode) => CalculatorResult[];
}
