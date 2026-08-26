/**
 * Returns a sensible tick interval for chart axes based on the time span.
 * Pure utility with no React or UI dependencies.
 */
export function getTickInterval(years: number): number {
  if (years <= 1) return 0.25;
  if (years <= 3) return 0.5;
  if (years <= 5) return 1;
  if (years <= 10) return 2;
  if (years <= 20) return 5;
  if (years <= 30) return 5;
  if (years <= 50) return 10;
  return 10;
}

/**
 * Generates tick values for a chart axis from 0 to maxYear.
 */
export function generateTicks(maxYear: number, interval?: number): number[] {
  const tickInterval = interval ?? getTickInterval(maxYear);
  const ticks: number[] = [];
  for (let y = 0; y <= maxYear + tickInterval * 0.01; y += tickInterval) {
    ticks.push(Math.round(y * 100) / 100);
  }
  return ticks;
}