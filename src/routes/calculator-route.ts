import express from 'express';
import { getCalculatorPageData, calculatePrice } from '../controllers/calculator-controller';

const router = express.Router();

router.get('/calculator/data', getCalculatorPageData);

router.post('/calculator/convert', calculatePrice);

export default router;