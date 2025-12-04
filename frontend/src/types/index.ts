export interface KPIData {
  total_revenue: number;
  arpu: number;
  retention_rate: number;
  total_orders: number;
  new_customers: number;
  net_profit: number;
  average_order_value: number;
  total_customers: number;
  profit_margin: number;
  customer_retention_rate: number;
  revenue_trend: number;
  orders_trend: number;
  customers_trend: number;
  profit_trend: number;
}

export interface SalesOverTime {
  period: string;
  year: number;
  month: number;
  total_sales: number;
  order_count: number;
}

// Alias for compatibility
export type SalesData = SalesOverTime;

export interface TopPerformer {
  product_id: number;
  product_name: string;
  category: string;
  total_quantity_sold: number;
  total_revenue: number;
  cost: number;
  price: number;
  profit_margin: number;
  profit_margin_percentage: number;
}

// Alias for compatibility
export type Product = TopPerformer;

export interface OrderWithDetails {
  order_id: number;
  customer_name: string;
  customer_email: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  total_amount: number;
  items_count: number;
}
