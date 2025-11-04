import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from "./routes/user/user.route";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/user/cart.route";
import emailRoutes from "./routes/email.route";
import adminDashboardRoutes from "./routes/admin/adminDashboard.route";
import adminProductManagementRoutes from "./routes/admin/adminProductManagement.route"
import userDashboardRoutes from "./routes/user/userDashboard.route";
import adminOrderManagementRoutes from "./routes/admin/adminOrderManagement.route"
import CategoryRoutes from "./routes/category.route"
import OrderRoutes from "./routes/user/order.route"
import PaymentRoutes from "./routes/admin/payment.route"
import { setupSwagger } from "./config/swagger";
import { setupAdminDashboardSwagger } from "./config/swagger/admin/adminDashboard.swagger";
import { setupAdminProductManagementSwagger } from "./config/swagger/admin/adminProductManagement.swagger";
import { setupUserDashboardSwagger } from "./config/swagger/user/user.swagger";
import { setupAdminOrderManagementSwagger } from "./config/swagger/admin/adminOrderManagement.swagger";
import { notFoundHandler } from "./middlewares/notFound.middlerware";
import { errorHandler } from "./middlewares/error.middleware";
import { setupUserOrderSwagger } from "./config/swagger/user/order.swager";
import bodyParser from "body-parser";
import { setupPaymentManagementSwagger } from "./config/swagger/admin/payment.swagger";
import rateLimit from "express-rate-limit";

const app = express();

const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 200, // 200 requests ต่อ 10 นาที ต่อ IP
  message: "Too many requests from this IP, please try again later.",
});

app.use(globalLimiter);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);
app.use("/api/admin-product-management", adminProductManagementRoutes);
app.use("/api/admin-order-management", adminOrderManagementRoutes)
app.use("/api/user-dashboard", userDashboardRoutes);
app.use("/api/categories", CategoryRoutes)
app.use("/api/user-orders", OrderRoutes)
app.use("/api/payment", PaymentRoutes)
// Swagger
setupSwagger(app);
setupAdminDashboardSwagger(app);
setupUserDashboardSwagger(app);
setupAdminProductManagementSwagger(app);
setupAdminOrderManagementSwagger(app);
setupUserOrderSwagger(app);
setupPaymentManagementSwagger(app);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
  console.log("Swagger docs available at http://localhost:3000/api-docs");
});


export default app;
