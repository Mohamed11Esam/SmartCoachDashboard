import { useEffect, useState } from 'react';
import { DollarSign, Users, Activity, UserPlus } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { NewUsersChart } from '../../components/charts/NewUsersChart';
import { PageSpinner } from '../../components/ui/Spinner';
import { getDashboardStats, getRevenueData, getNewUsersData } from './api';
import type { DashboardStats, ChartDataPoint } from '../../types';

export function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [usersData, setUsersData] = useState<ChartDataPoint[]>([]);
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [s, r, u] = await Promise.all([
        getDashboardStats(),
        getRevenueData(period),
        getNewUsersData(period),
      ]);
      setStats(s);
      setRevenueData(r);
      setUsersData(u);
      setLoading(false);
    };
    load();
  }, [period]);

  if (loading || !stats) return <PageSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary text-sm">Welcome back, here's your overview</p>
        </div>
        <div className="flex bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              period === '7d'
                ? 'bg-accent text-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              period === '30d'
                ? 'bg-accent text-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueChange}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Subscriptions"
          value={stats.totalSubscriptions.toLocaleString()}
          change={stats.subscriptionsChange}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change={stats.activeUsersChange}
          icon={<Activity className="w-5 h-5" />}
        />
        <StatCard
          title="New Users"
          value={stats.newUsers.toLocaleString()}
          change={stats.newUsersChange}
          icon={<UserPlus className="w-5 h-5" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <NewUsersChart data={usersData} />
      </div>
    </div>
  );
}
