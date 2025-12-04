import request from 'supertest';
import app from '../index';
import pool from '../config/database';

describe('Analytics API', () => {
  afterAll(async () => {
    await pool.end();
  });
  describe('GET /api/analytics/kpis', () => {
    it('should return KPI data with default period', async () => {
      const response = await request(app).get('/api/analytics/kpis').expect(200);

      expect(response.body).toHaveProperty('total_revenue');
      expect(response.body).toHaveProperty('total_orders');
      expect(response.body).toHaveProperty('total_customers');
      expect(response.body).toHaveProperty('profit_margin');
      expect(response.body).toHaveProperty('revenue_trend');
      expect(typeof response.body.total_revenue).toBe('number');
    });

    it('should return KPI data for 7 days period', async () => {
      const response = await request(app)
        .get('/api/analytics/kpis')
        .query({ period: '7days' })
        .expect(200);

      expect(response.body).toHaveProperty('total_revenue');
      expect(response.body).toHaveProperty('revenue_trend');
    });

    it('should return KPI data for 3 months period', async () => {
      const response = await request(app)
        .get('/api/analytics/kpis')
        .query({ period: '3months' })
        .expect(200);

      expect(response.body).toHaveProperty('total_revenue');
    });
  });

  describe('GET /api/analytics/sales-over-time', () => {
    it('should return sales data', async () => {
      const response = await request(app).get('/api/analytics/sales-over-time').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('period');
        expect(response.body[0]).toHaveProperty('total_sales');
        expect(response.body[0]).toHaveProperty('order_count');
      }
    });

    it('should return sales data for specific period', async () => {
      const response = await request(app)
        .get('/api/analytics/sales-over-time')
        .query({ period: '1month' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
