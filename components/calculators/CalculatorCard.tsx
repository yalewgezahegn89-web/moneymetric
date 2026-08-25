import Link from "next/link";

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
}

export function CalculatorCard({
  title,
  description,
  href,
}: CalculatorCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-gray-200 p-6 transition-all hover:border-gray-300 hover:shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
