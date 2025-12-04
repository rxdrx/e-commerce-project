import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import KPICard from '@/components/KPICard';
import SalesChart from '@/components/SalesChart';
import { analyticsService } from '@/services/api';
import { KPIData, SalesOverTime } from '@/types';

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [salesData, setSalesData] = useState<SalesOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpisData, salesOverTime] = await Promise.all([
          analyticsService.getKPIs(),
          analyticsService.getSalesOverTime(),
        ]);

        setKpis(kpisData);
        setSalesData(salesOverTime);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Welcome to your e-commerce analytics dashboard</p>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Total Revenue"
              value={kpis.total_revenue}
              format="currency"
              icon={DollarSign}
            />
            <KPICard
              title="Total Orders"
              value={kpis.total_orders}
              format="number"
              icon={ShoppingCart}
            />
            <KPICard
              title="New Customers"
              value={kpis.new_customers}
              format="number"
              icon={Users}
            />
            <KPICard
              title="Net Profit"
              value={kpis.net_profit}
              format="currency"
              icon={TrendingUp}
            />
          </div>
        )}

        {/* Sales Chart */}
        {salesData.length > 0 && <SalesChart data={salesData} />}
      </div>
    </Layout>
  );
}
