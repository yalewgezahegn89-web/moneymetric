"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TimelinePoint } from "@/calculators/engine/types";
import { formatCurrency } from "@/lib/formatting";
import { getTickInterval } from "@/lib/chart";

interface GrowthChartProps {
  timeline: TimelinePoint[];
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: number;
}) {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
      <p className="text-sm font-medium text-gray-900">Year {label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 text-sm text-gray-600">
          {entry.dataKey === "balance" && `Balance: ${formatCurrency(entry.value)}`}
          {entry.dataKey === "cumulativeContributions" && `Contributions: ${formatCurrency(entry.value)}`}
          {entry.dataKey === "cumulativeInterest" && `Interest: ${formatCurrency(entry.value)}`}
        </p>
      ))}
    </div>
  );
}

export function GrowthChart({
  timeline,
  futureValue,
  totalContributions,
  totalInterest,
}: GrowthChartProps) {
  if (timeline.length === 0) return null;

  const maxYear = timeline[timeline.length - 1]!.timeInYears;
  const interval = getTickInterval(maxYear);
  const ticks: number[] = [];
  for (let y = 0; y <= maxYear + interval * 0.01; y += interval) {
    ticks.push(Math.round(y * 100) / 100);
  }

  const chartData = timeline.map((point) => ({
    year: Math.round(point.timeInYears * 10) / 10,
    balance: Math.round(point.balance * 100) / 100,
    cumulativeContributions: Math.round(point.cumulativeContributions * 100) / 100,
    cumulativeInterest: Math.round(point.cumulativeInterest * 100) / 100,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Growth Over Time</h3>
      <p className="mt-1 text-sm text-gray-500 sr-only">
        Chart showing investment growth over the selected period
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Over the selected period, the projected balance grows to{" "}
        {formatCurrency(futureValue)}, including{" "}
        {formatCurrency(totalContributions)} in contributions and{" "}
        {formatCurrency(totalInterest)} in estimated interest.
      </p>

      <div className="mt-4 h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              type="number"
              domain={[0, maxYear]}
              ticks={ticks}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              label={{
                value: "Years",
                position: "insideBottomRight",
                offset: -5,
                style: { fontSize: 12, fill: "#6B7280" },
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => {
                if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                return `$${value}`;
              }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value: string) => {
                if (value === "balance") return "Total Balance";
                if (value === "cumulativeContributions") return "Contributions";
                if (value === "cumulativeInterest") return "Interest";
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#111827"
              strokeWidth={2}
              fill="url(#colorBalance)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="cumulativeInterest"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#colorInterest)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="cumulativeContributions"
              stroke="#6B7280"
              strokeWidth={2}
              fill="url(#colorContributions)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
