export function calculateChange(
  currentValue: number,
  previousValue: number
): string {
  if (previousValue === 0) return "+100%"; // If previous value was 0, we consider it a 100% increase
  const change = ((currentValue - previousValue) / previousValue) * 100;
  return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
}
