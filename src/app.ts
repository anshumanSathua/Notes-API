import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import limiter from "./middlewares/rateLimitMiddleware";
import { swaggerUi, swaggerSpec } from "./swaggerConfig";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (_req, res) => {
  res.send("Notes API is running.....");
});

export default app;
