// Builds the Express app (middleware + routes). server.js starts it.
// Keeping these separate lets tests import the app without opening a port.
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import apiRoutes from "./routes/index.js";

const app = express();

if (env.TRUST_PROXY) app.set("trust proxy", env.TRUST_PROXY);

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? "*" : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: "100kb" }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
