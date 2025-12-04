import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { OrderWithDetails } from '../types';

/**
 * Get recent orders with details
 * Supports filtering by status
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit = '10000' } = req.query;
    const connection = await pool.getConnection();

    let query = `
      SELECT 
        o.id AS order_id,
        c.name AS customer_name,
        c.email AS customer_email,
        o.status,
        o.created_at,
        SUM(oi.quantity * oi.unit_price) AS total_amount,
        COUNT(oi.id) AS items_count
      FROM Orders o
      INNER JOIN Customers c ON o.customer_id = c.id
      LEFT JOIN OrderItems oi ON o.id = oi.order_id
    `;

    const params: (string | number)[] = [];

    if (status && typeof status === 'string') {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += `
      GROUP BY o.id, c.name, c.email, o.status, o.created_at
      ORDER BY o.created_at DESC
      LIMIT ?;
    `;

    params.push(parseInt(String(limit)));

    const [rows] = await connection.query<RowDataPacket[]>(query, params);
    connection.release();

    const orders: OrderWithDetails[] = rows.map((row: any) => ({
      order_id: parseInt(String(row.order_id)),
      customer_name: String(row.customer_name),
      customer_email: String(row.customer_email),
      status: String(row.status),
      created_at: String(row.created_at),
      total_amount: parseFloat(String(row.total_amount)) || 0,
      items_count: parseInt(String(row.items_count)) || 0,
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get order by ID with full details
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    const orderQuery = `
      SELECT 
        o.id,
        o.customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        o.status,
        o.created_at
      FROM Orders o
      INNER JOIN Customers c ON o.customer_id = c.id
      WHERE o.id = ?;
    `;

    const itemsQuery = `
      SELECT 
        oi.id,
        oi.product_id,
        p.name AS product_name,
        p.category,
        oi.quantity,
        oi.unit_price,
        (oi.quantity * oi.unit_price) AS item_total
      FROM OrderItems oi
      INNER JOIN Products p ON oi.product_id = p.id
      WHERE oi.order_id = ?;
    `;

    const [orderRows] = await connection.query<RowDataPacket[]>(orderQuery, [id]);
    const [itemRows] = await connection.query<RowDataPacket[]>(itemsQuery, [id]);
    connection.release();

    if (orderRows.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const order = {
      ...orderRows[0],
      items: itemRows,
      total_amount: itemRows.reduce((sum, item: any) => sum + parseFloat(String(item.item_total)), 0),
    };

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
