
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoutes from "./routes/generate.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "quickmp3-server" });
});

app.use("/api/generate", generateRoutes);

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`[quickmp3] server listening on http://localhost:${port}`);
});
