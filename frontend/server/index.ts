import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getClaims } from "./routes/claims";
import { getAssets } from "./routes/assets";
import { postIngest } from "./routes/ingest";
import { getRecommendation } from "./routes/dss";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health & demo
  app.get("/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/demo", handleDemo);

  // FRA Atlas mock APIs
  app.post("/ingest", postIngest);
  app.get("/claims", getClaims);
  app.get("/assets", getAssets);
  app.get("/dss/recommend/:claim_id", getRecommendation);

  return app;
}
