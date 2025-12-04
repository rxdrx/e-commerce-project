import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { KPIData, SalesOverTime, TopPerformer } from '../types';

/**
 * Get Key Performance Indicators (KPIs)
 * Returns: Total Revenue, ARPU (Average Revenue Per User), Retention Rate
 */
export const getKPIs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '12months' } = req.query;
    const connection = await pool.getConnection();

    // Convert period to days
    let days = 365;
    if (period === '7days') days = 7;
    else if (period === '1month') days = 30;
    else if (period === '3months') days = 90;
    else if (period === '6months') days = 180;
    else if (period === '9months') days = 270;
    else if (period === '12months') days = 365;

    // Complex SQL query to calculate multiple KPIs with trends
    const query = `
      WITH CurrentPeriod AS (
        SELECT 
          o.id AS order_id,
          o.customer_id,
          o.status,
          o.created_at,
          SUM(oi.quantity * oi.unit_price) AS order_total,
          SUM(oi.quantity * p.cost) AS order_cost
        FROM Orders o
        INNER JOIN OrderItems oi ON o.id = oi.order_id
        INNER JOIN Products p ON oi.product_id = p.id
        WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
          AND o.status = 'Completed'
        GROUP BY o.id, o.customer_id, o.status, o.created_at
      ),
      PreviousPeriod AS (
        SELECT 
          o.id AS order_id,
          o.customer_id,
          o.status,
          o.created_at,
          SUM(oi.quantity * oi.unit_price) AS order_total,
          SUM(oi.quantity * p.cost) AS order_cost
        FROM Orders o
        INNER JOIN OrderItems oi ON o.id = oi.order_id
        INNER JOIN Products p ON oi.product_id = p.id
        WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
          AND o.created_at < DATE_SUB(CURDATE(), INTERVAL ? DAY)
          AND o.status = 'Completed'
        GROUP BY o.id, o.customer_id, o.status, o.created_at
      ),
      CurrentMetrics AS (
        SELECT 
          SUM(order_total) AS total_revenue,
          SUM(order_total - order_cost) AS net_profit,
          COUNT(DISTINCT order_id) AS total_orders,
          COUNT(DISTINCT customer_id) AS unique_customers
        FROM CurrentPeriod
      ),
      PreviousMetrics AS (
        SELECT 
          SUM(order_total) AS total_revenue,
          SUM(order_total - order_cost) AS net_profit,
          COUNT(DISTINCT order_id) AS total_orders,
          COUNT(DISTINCT customer_id) AS unique_customers
        FROM PreviousPeriod
      ),
      CustomerRetention AS (
        SELECT 
          customer_id,
          COUNT(order_id) AS order_count
        FROM CurrentPeriod
        GROUP BY customer_id
      ),
      RetentionRate AS (
        SELECT 
          COUNT(CASE WHEN order_count > 1 THEN 1 END) AS returning_customers,
          COUNT(*) AS total_customers_with_orders
        FROM CustomerRetention
      ),
      NewCustomers AS (
        SELECT COUNT(*) AS new_customers_count
        FROM Customers
        WHERE signup_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      )
      SELECT 
        COALESCE(cm.total_revenue, 0) AS total_revenue,
        COALESCE(cm.net_profit, 0) AS net_profit,
        COALESCE(cm.total_orders, 0) AS total_orders,
        COALESCE(cm.unique_customers, 0) AS unique_customers,
        COALESCE(cm.total_revenue / NULLIF(cm.unique_customers, 0), 0) AS arpu,
        COALESCE((rr.returning_customers / NULLIF(rr.total_customers_with_orders, 0)) * 100, 0) AS retention_rate,
        COALESCE(nc.new_customers_count, 0) AS new_customers,
        COALESCE(pm.total_revenue, 0) AS prev_total_revenue,
        COALESCE(pm.net_profit, 0) AS prev_net_profit,
        COALESCE(pm.total_orders, 0) AS prev_total_orders,
        COALESCE(pm.unique_customers, 0) AS prev_unique_customers
      FROM CurrentMetrics cm
      CROSS JOIN PreviousMetrics pm
      CROSS JOIN RetentionRate rr
      CROSS JOIN NewCustomers nc;
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [days, days * 2, days, days]);
    connection.release();

    if (rows.length === 0) {
      res.status(404).json({ error: 'No data found' });
      return;
    }

    const currentRevenue = parseFloat(String(rows[0].total_revenue)) || 0;
    const prevRevenue = parseFloat(String(rows[0].prev_total_revenue)) || 0;
    const currentOrders = parseInt(String(rows[0].total_orders)) || 0;
    const prevOrders = parseInt(String(rows[0].prev_total_orders)) || 0;
    const currentCustomers = parseInt(String(rows[0].unique_customers)) || 0;
    const prevCustomers = parseInt(String(rows[0].prev_unique_customers)) || 0;
    const currentProfit = parseFloat(String(rows[0].net_profit)) || 0;
    const prevProfit = parseFloat(String(rows[0].prev_net_profit)) || 0;

    const calculateTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const kpis: KPIData = {
      total_revenue: currentRevenue,
      arpu: parseFloat(String(rows[0].arpu)) || 0,
      retention_rate: parseFloat(String(rows[0].retention_rate)) || 0,
      total_orders: currentOrders,
      new_customers: parseInt(String(rows[0].new_customers)) || 0,
      net_profit: currentProfit,
      average_order_value: currentRevenue / (currentOrders || 1),
      total_customers: currentCustomers,
      profit_margin: currentProfit / (currentRevenue || 1),
      customer_retention_rate: (parseFloat(String(rows[0].retention_rate)) || 0) / 100,
      revenue_trend: calculateTrend(currentRevenue, prevRevenue),
      orders_trend: calculateTrend(currentOrders, prevOrders),
      customers_trend: calculateTrend(currentCustomers, prevCustomers),
      profit_trend: calculateTrend(currentProfit, prevProfit),
    };

    res.json(kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get sales data over time (monthly aggregation)
 * Returns sales grouped by month/year for charting
 */
export const getSalesOverTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '12months' } = req.query;
    const connection = await pool.getConnection();

    // Convert period to days
    let days = 365;
    if (period === '7days') days = 7;
    else if (period === '1month') days = 30;
    else if (period === '3months') days = 90;
    else if (period === '6months') days = 180;
    else if (period === '9months') days = 270;
    else if (period === '12months') days = 365;

    // Raw SQL with GROUP BY and date functions
    const query = `
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m-%d') AS period,
        YEAR(o.created_at) AS year,
        MONTH(o.created_at) AS month,
        SUM(oi.quantity * oi.unit_price) AS total_sales,
        COUNT(DISTINCT o.id) AS order_count
      FROM Orders o
      INNER JOIN OrderItems oi ON o.id = oi.order_id
      WHERE o.status = 'Completed'
        AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY 
        DATE_FORMAT(o.created_at, '%Y-%m-%d'),
        YEAR(o.created_at),
        MONTH(o.created_at)
      ORDER BY period ASC;
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [days]);
    connection.release();

    const salesData: SalesOverTime[] = rows.map((row: any) => ({
      period: String(row.period),
      year: parseInt(String(row.year)),
      month: parseInt(String(row.month)),
      total_sales: parseFloat(String(row.total_sales)),
      order_count: parseInt(String(row.order_count)),
    }));

    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales over time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get top performing products
 * Returns top 5 products by revenue with profit margins
 * Uses JOINs, GROUP BY, and aggregate functions
 */
export const getTopPerformers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    // Complex SQL with JOINs, GROUP BY, and calculated fields
    const query = `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.category,
        p.cost,
        p.price,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        (p.price - p.cost) AS profit_margin,
        ((p.price - p.cost) / p.cost * 100) AS profit_margin_percentage
      FROM Products p
      INNER JOIN OrderItems oi ON p.id = oi.product_id
      INNER JOIN Orders o ON oi.order_id = o.id
      WHERE o.status = 'Completed'
      GROUP BY 
        p.id,
        p.name,
        p.category,
        p.cost,
        p.price
      ORDER BY total_revenue DESC
      LIMIT 5;
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query);
    connection.release();

    const topPerformers: TopPerformer[] = rows.map((row) => ({
      product_id: parseInt(row.product_id),
      product_name: row.product_name,
      category: row.category,
      total_quantity_sold: parseInt(row.total_quantity_sold),
      total_revenue: parseFloat(row.total_revenue),
      cost: parseFloat(row.cost),
      price: parseFloat(row.price),
      profit_margin: parseFloat(row.profit_margin),
      profit_margin_percentage: parseFloat(row.profit_margin_percentage),
    }));

    res.json(topPerformers);
  } catch (error) {
    console.error('Error fetching top performers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
