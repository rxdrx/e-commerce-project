import request from 'supertest';
import app from '../index';
import pool from '../config/database';

describe('Products API', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/products', () => {
    it('should return list of products', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('price');
      }
    });

    it('should filter products by category', async () => {
      // First, get all products to find a valid category
      const allProducts = await request(app).get('/api/products').expect(200);
      
      if (allProducts.body.length > 0) {
        const category = allProducts.body[0].category;
        
        const response = await request(app)
          .get('/api/products')
          .query({ category })
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((product: any) => {
          expect(product.category).toBe(category);
        });
      }
    });

    it('should return products sorted by name', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Check if sorted alphabetically by name
      for (let i = 0; i < response.body.length - 1; i++) {
        expect(response.body[i].name.localeCompare(response.body[i + 1].name)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return list of categories with statistics', async () => {
      const response = await request(app).get('/api/products/categories').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('product_count');
        expect(response.body[0]).toHaveProperty('avg_price');
        expect(typeof response.body[0].product_count).toBe('number');
        // avg_price comes as string from MySQL, check it exists and is numeric
        expect(response.body[0].avg_price).toBeDefined();
        expect(parseFloat(response.body[0].avg_price)).toBeGreaterThan(0);
      }
    });

    it('should return categories sorted alphabetically', async () => {
      const response = await request(app).get('/api/products/categories').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      // Check if sorted alphabetically by category
      for (let i = 0; i < response.body.length - 1; i++) {
        expect(response.body[i].category.localeCompare(response.body[i + 1].category)).toBeLessThanOrEqual(0);
      }
    });
  });
});
