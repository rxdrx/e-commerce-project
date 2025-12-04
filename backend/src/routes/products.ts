import { Router } from 'express';
import { getProducts, getCategories } from '../controllers/productsController';
import { getTopPerformers } from '../controllers/analyticsController';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', (req, res) => void getProducts(req, res));

/**
 * @route   GET /api/products/categories
 * @desc    Get product categories
 * @access  Public
 */
router.get('/categories', (req, res) => void getCategories(req, res));

/**
 * @route   GET /api/products/top-performers
 * @desc    Get top 5 performing products
 * @access  Public
 */
router.get('/top-performers', (req, res) => void getTopPerformers(req, res));

export default router;
