import { Router } from 'express';
import { getKPIs, getSalesOverTime } from '../controllers/analyticsController';

const router = Router();

/**
 * @route   GET /api/analytics/kpis
 * @desc    Get Key Performance Indicators
 * @access  Public
 */
router.get('/kpis', (req, res) => void getKPIs(req, res));

/**
 * @route   GET /api/analytics/sales-over-time
 * @desc    Get sales data aggregated by month
 * @access  Public
 */
router.get('/sales-over-time', (req, res) => void getSalesOverTime(req, res));

export default router;
