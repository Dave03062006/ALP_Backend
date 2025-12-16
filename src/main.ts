import express from "express";
import gachaRoutes from "./routes/gachaRoutes";
import { errorMiddleware } from "./middleware/error-middleware";
import config from "./config";

const app = express();

app.use(express.json());

app.use("/api", gachaRoutes);

app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
