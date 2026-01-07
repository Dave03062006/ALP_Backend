import express from "express";
import { getCalculatorData } from "../controllers/calculator-controller";
import { calculatePrice } from "../controllers/priceCalculatorController";
import { CurrencyController } from "../controllers/currencyController";

export const apiRouter = express.Router();

apiRouter.post('/currency/convert', calculatePrice);
apiRouter.get('/currency-rates', CurrencyController.getRates);
apiRouter.get("/calculator/data", getCalculatorData);