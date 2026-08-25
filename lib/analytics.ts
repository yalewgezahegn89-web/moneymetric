export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export function trackEvent(): void {
  // Placeholder: analytics integration will be added later
}
