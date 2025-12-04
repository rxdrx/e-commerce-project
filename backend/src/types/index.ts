export interface Customer {
  id: number;
  name: string;
  email: string;
  region: string;
  signup_date: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  cost: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: string;
}

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

export interface OrderWithDetails {
  order_id: number;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  total_amount: number;
  items_count: number;
}
