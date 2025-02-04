import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "../router/userRoute";
import employeeRoute from "../router/employeeRoute";
import adminRoute from "../router/adminRoute";
import eventRoute from "../router/eventRoute";
import cookieParser from "cookie-parser";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRoute);

app.use("/employee", employeeRoute);

app.use("/admin", adminRoute);

app.use("/event", eventRoute);

export default app;
