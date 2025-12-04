import request from 'supertest';
import app from '../index';
import pool from '../config/database';

describe('Orders API', () => {
  afterAll(async () => {
    await pool.end();
  });
  describe('GET /api/orders', () => {
    it('should return list of orders', async () => {
      const response = await request(app).get('/api/orders').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('order_id');
        expect(response.body[0]).toHaveProperty('customer_name');
        expect(response.body[0]).toHaveProperty('status');
        expect(response.body[0]).toHaveProperty('total_amount');
      }
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/api/orders')
        .query({ status: 'Completed' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((order: any) => {
        expect(order.status).toBe('Completed');
      });
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/api/orders')
        .query({ limit: '10' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details for valid ID', async () => {
      // First get an order to have a valid ID
      const ordersResponse = await request(app).get('/api/orders').query({ limit: '1' });
      
      if (ordersResponse.body.length > 0) {
        const orderId = ordersResponse.body[0].order_id;
        const response = await request(app).get(`/api/orders/${orderId}`).expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('customer_name');
        expect(response.body).toHaveProperty('items');
        expect(Array.isArray(response.body.items)).toBe(true);
      }
    });

    it('should return 400 for invalid ID', async () => {
      await request(app).get('/api/orders/invalid').expect(400);
    });
  });
});
