import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C6F135" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C6F135" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis
            dataKey="name"
            stroke="#666666"
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
          />
          <YAxis
            stroke="#666666"
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#222222',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#C6F135"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
