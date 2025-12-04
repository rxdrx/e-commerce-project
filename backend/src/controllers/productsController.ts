import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';

/**
 * Get all products with optional filtering
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const connection = await pool.getConnection();

    let query = 'SELECT * FROM Products';
    const params: string[] = [];

    if (category && typeof category === 'string') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY name ASC;';

    const [rows] = await connection.query<RowDataPacket[]>(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get product categories
 */
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    const query = `
      SELECT 
        category,
        COUNT(*) AS product_count,
        AVG(price) AS avg_price
      FROM Products
      GROUP BY category
      ORDER BY category ASC;
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
