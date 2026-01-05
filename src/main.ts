import express from "express";
import gachaRoutes from "./routes/gachaRoutes";
import profileRoutes from "./routes/profileRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import gameRoutes from "./routes/gameRoutes";
import voucherRoutes from "./routes/voucherRoutes";
import eventRoutes from "./routes/eventRoutes";
import itemRoutes from "./routes/itemRoutes";
import { errorMiddleware } from "./middleware/error-middleware";
import config from "./config";

const app = express();

// Enable CORS for Android app
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Register all routes
app.use("/api", profileRoutes);
app.use("/api", transactionRoutes);
app.use("/api", gameRoutes);
app.use("/api", voucherRoutes);
app.use("/api", eventRoutes);
app.use("/api", itemRoutes);
app.use("/api", gachaRoutes);

app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
  console.log(`API endpoints available at http://localhost:${config.PORT}/api`);
});
