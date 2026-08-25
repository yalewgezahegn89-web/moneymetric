export type AdSlotPosition = "header" | "sidebar" | "in-content" | "footer" | "mobile-sticky";

export interface AdSlotProps {
  position: AdSlotPosition;
  className?: string;
  label?: string;
}

export function AdSlot({ position, className = "", label }: AdSlotProps) {
  return (
    <div
      className={`ad-slot ad-slot--${position} flex items-center justify-center bg-gray-100 ${className}`}
      role="complementary"
      aria-label={label ?? `Advertisement (${position})`}
      data-ad-position={position}
    >
      <span className="text-xs text-gray-400">
        Advertisement
      </span>
    </div>
  );
}
