import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface NewUsersChartProps {
  data: ChartDataPoint[];
}

export function NewUsersChart({ data }: NewUsersChartProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">New Users</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
          <XAxis
            dataKey="name"
            stroke="#666666"
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
          />
          <YAxis
            stroke="#666666"
            tick={{ fill: '#A0A0A0', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#222222',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            formatter={(value: number | undefined) => [value ?? 0, 'Users']}
          />
          <Bar
            dataKey="value"
            fill="#C6F135"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
