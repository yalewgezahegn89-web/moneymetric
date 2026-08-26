"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MortgageResult } from "@/calculators/engine/types";
import { formatCurrency } from "@/lib/formatting";

interface AmortizationChartProps {
  result: MortgageResult;
}

function getTickInterval(loanTermYears: number): number {
  if (loanTermYears <= 1) return 0.25;
  if (loanTermYears <= 3) return 0.5;
  if (loanTermYears <= 5) return 1;
  if (loanTermYears <= 10) return 2;
  if (loanTermYears <= 20) return 5;
  if (loanTermYears <= 30) return 5;
  if (loanTermYears <= 50) return 10;
  return 10;
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
          {entry.dataKey === "remainingBalance" &&
            `Remaining balance: ${formatCurrency(entry.value)}`}
        </p>
      ))}
    </div>
  );
}

export function AmortizationChart({ result }: AmortizationChartProps) {
  if (result.timeline.length === 0) return null;

  const { timeline, loanAmount, totalInterest, totalPayments, loanTermYears, paymentsPerYear } = result;

  const interval = getTickInterval(loanTermYears);
  const ticks: number[] = [];
  for (let y = 0; y <= loanTermYears + interval * 0.01; y += interval) {
    ticks.push(Math.round(y * 100) / 100);
  }

  const chartData = timeline.map((point) => ({
    year: Math.round((point.paymentNumber / paymentsPerYear) * 10) / 10,
    remainingBalance: Math.round(point.remainingBalance * 100) / 100,
  }));

  const firstBalance = timeline[0]!.remainingBalance + timeline[0]!.principalPaid;
  const lastBalance = timeline[timeline.length - 1]!.remainingBalance;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Mortgage Balance Over Time
      </h3>
      <p className="mt-1 text-sm text-gray-500 sr-only">
        Chart showing remaining mortgage balance decreasing over the loan term
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Your remaining mortgage balance decreases from{" "}
        {formatCurrency(firstBalance)} to {formatCurrency(lastBalance)} over{" "}
        {loanTermYears} year{loanTermYears !== 1 ? "s" : ""} under the selected
        assumptions.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Loan Amount
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
            {formatCurrency(loanAmount)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Total Interest
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
            {formatCurrency(totalInterest)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Total Payments
          </p>
          <p className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
            {formatCurrency(totalPayments)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMortgageBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#111827" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#111827" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              type="number"
              domain={[0, loanTermYears]}
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
            <Area
              type="monotone"
              dataKey="remainingBalance"
              stroke="#111827"
              strokeWidth={2.5}
              fill="url(#colorMortgageBalance)"
              dot={false}
              activeDot={{ r: 4, fill: "#111827" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
