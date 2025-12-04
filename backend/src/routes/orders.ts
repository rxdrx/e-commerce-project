import { Router } from 'express';
import { getOrders, getOrderById } from '../controllers/ordersController';

const router = Router();

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Public
 */
router.get('/', (req, res) => void getOrders(req, res));

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:id', (req, res) => void getOrderById(req, res));

export default router;
