import "./config/env.js";
import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import projectRouter from "./routes/projectsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import productRouter from "./routes/productRoutes.js";
import { initSocket } from "./socket/socket.js";
import messageRouter from "./routes/messageRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";

connectDB();

const PORT = process.env.PORT;
const app = express();

// middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/uploads", express.static("uploads"));
app.use("/exports", express.static("exports"));
app.use("/api/messages", messageRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/orders", orderRouter);
app.use("/api/subscriptions", subscriptionRouter);

app.use(errorHandler);

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});