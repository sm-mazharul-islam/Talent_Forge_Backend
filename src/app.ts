import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import our new property routes mapping
import propertyRoutes from "./routes/property.routes.js";
import authRouter from "./routes/auth.route.js";
import applicationRoutes from "./routes/application.route";
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Lumina Space API is running smoothly.",
  });
});

// Register the modular Property API routes under the /api/properties prefix 👇
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRouter);
app.use("/api/applications", applicationRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      error: { message: err.message || "Internal Server Error" },
    });
  },
);

export default app;
