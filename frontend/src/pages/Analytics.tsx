import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SalesChart from '../components/SalesChart';
import { SalesData, KPIData } from '../types';
import { getKPIs, getSalesOverTime } from '../services/api';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Percent } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

export default function Analytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<
    '7days' | '1month' | '3months' | '6months' | '9months' | '12months'
  >('12months');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [kpis, sales] = await Promise.all([getKPIs(period), getSalesOverTime(period)]);
        setKpiData(kpis);
        setSalesData(sales);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalyticsData();
  }, [period]);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !kpiData) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-red-600">{error || 'No data available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${kpiData.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: kpiData.revenue_trend,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Average Order Value',
      value: `$${kpiData.average_order_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: kpiData.orders_trend,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Total Customers',
      value: kpiData.total_customers.toLocaleString(),
      trend: kpiData.customers_trend,
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Profit Margin',
      value: `${(kpiData.profit_margin * 100).toFixed(1)}%`,
      trend: kpiData.profit_trend,
      icon: <Percent className="h-6 w-6" />,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive insights into your business performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPeriod('7days')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '7days'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod('1month')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '1month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setPeriod('3months')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '3months'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setPeriod('6months')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '6months'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setPeriod('9months')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '9months'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              9 Months
            </button>
            <button
              onClick={() => setPeriod('12months')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                period === '12months'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              12 Months
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.color}`}>{stat.icon}</div>
                <div className="flex items-center gap-1 text-sm">
                  {stat.trend >= 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">{stat.trend.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-600">
                        {Math.abs(stat.trend).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Sales Trend - Last{' '}
            {period === '7days'
              ? '7 Days'
              : period === '1month'
                ? '1 Month'
                : period === '3months'
                  ? '3 Months'
                  : period === '6months'
                    ? '6 Months'
                    : period === '9months'
                      ? '9 Months'
                      : '12 Months'}
          </h2>
          <SalesChart data={salesData} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold text-gray-900">
                  {kpiData.total_orders.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Retention</span>
                <span className="font-semibold text-gray-900">
                  {(kpiData.customer_retention_rate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Per User</span>
                <span className="font-semibold text-gray-900">
                  ${(kpiData.total_revenue / kpiData.total_customers).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-gray-900">3.2%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[32%] bg-green-500"></div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[94%] bg-blue-500"></div>
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-600">Order Fulfillment</span>
                  <span className="font-semibold text-gray-900">87%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[87%] bg-orange-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
