import express from "express";
import bodyParser from "body-parser";
import mainRoutes from "./routes";
import { errorMiddleware } from "./middleware/error-middleware";
import { PORT } from "./utils/env-util";

const app = express();

app.use(bodyParser.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/", mainRoutes);

app.use(errorMiddleware);

const port = PORT ? Number(PORT) : 3000;
app.listen(port, () => { 
	console.log(`Server listening on port ${port}`);
});
