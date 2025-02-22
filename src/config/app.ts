import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import refreshTokenRoute from "../framework/router/refreshTokenRoute";
import adminRouter from "../routes/admin.routes";
import employeeRouter from "../routes/employee.routes";
import userRouter from "../routes/user.routes";

const app = express();

app.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
  methods: ["PUT", "GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

app.use(cors(corsOptions));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit:'50mb',extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);

app.use("/employee", employeeRouter);//finished

app.use("/admin", adminRouter); //finished

app.use("/refreshToken", refreshTokenRoute);

export default app;
