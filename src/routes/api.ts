import express from "express";
import { getCalculatorData } from "../controllers/calculator-controller";
import { calculatePrice } from "../controllers/priceCalculatorController";

export const apiRouter = express.Router();

apiRouter.post('/calculator/convert', calculatePrice);
apiRouter.get("/calculator/data", getCalculatorData);