// server/src/index.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import { MAX_IMAGE_UPLOAD_MB } from "./config/upload.js";
import { fileURLToPath } from "url";

// Routers
import hotelsRouter from "./routes/hotels.js";
import destinationsRouter from "./routes/destinations.js";
import authRouter from "./routes/auth.js";
import bookingsRouter from "./routes/bookings.js";
import managerAuthRouter from "./routes/manager/auth.js";
import managerHotelsRouter from "./routes/manager/hotels.js";
import managerRoomsRouter from "./routes/manager/rooms.js";
import managerBookingsRouter from "./routes/manager/bookings.js";
import managerGeocodeRouter from "./routes/manager/geocode.js";
import managerPayoutAccountRouter from "./routes/manager/payout-account.js";
import managerStatsRouter from "./routes/manager/stats.js";
import adminAuthRouter from "./routes/admin/auth.js";
import adminHotelsRouter from "./routes/admin/hotels.js";
import adminBookingsRouter from "./routes/admin/bookings.js";
import adminUsersRouter from "./routes/admin/users.js";
import adminStatsRouter from "./routes/admin/stats.js";
import adminDestinationsRouter from "./routes/admin/destinations.js";
import aiRouter from "./routes/ai.js";

// Prisma
import { prisma } from "./db/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

/* ================= GLOBAL MIDDLEWARE (ONCE) ================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

/* ================= STATIC UPLOADS – allow frontend to embed images ================= */
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
app.use(
  "/uploads",
  cors({ origin: "*" }),
  express.static(path.join(__dirname, "../uploads"))
);

/* ================= HEALTH ================= */
app.get("/", (_req, res) => res.send("API is running"));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/db-check", async (_req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ ok: true, time: result[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/* ================= ROUTES ================= */
app.use("/auth", authRouter);
app.use("/hotels", hotelsRouter);
app.use("/destinations", destinationsRouter);
app.use("/bookings", bookingsRouter);
app.use("/ai", aiRouter);

app.use("/manager/auth", managerAuthRouter);
app.use("/manager/hotels", managerHotelsRouter);
app.use("/manager/rooms", managerRoomsRouter);
app.use("/manager/bookings", managerBookingsRouter);
app.use("/manager/geocode", managerGeocodeRouter);
app.use("/manager/payout-account", managerPayoutAccountRouter);
app.use("/manager/stats", managerStatsRouter);

app.use("/admin/auth", adminAuthRouter);
app.use("/admin/hotels", adminHotelsRouter);
app.use("/admin/bookings", adminBookingsRouter);
app.use("/admin/users", adminUsersRouter);
app.use("/admin/stats", adminStatsRouter);
app.use("/admin/destinations", adminDestinationsRouter);

/* ================= ERROR HANDLING (multer / uploads) ================= */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: `One or more images exceed ${MAX_IMAGE_UPLOAD_MB}MB.`,
      });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err?.code === "INVALID_IMAGE_UPLOAD") {
    return res.status(400).json({ error: err.message });
  }
  if (typeof err?.message === "string" && err.message.includes("Only JPG")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  const status = Number(err?.status || err?.statusCode) || 500;
  res.status(status).json({ error: err?.message || "Server error" });
});

/* ================= START ================= */
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
