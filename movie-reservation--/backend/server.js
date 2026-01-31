import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import showtimeRoutes from "./routes/showtimeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/showtime", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
