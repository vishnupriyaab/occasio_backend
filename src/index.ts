import { config } from "dotenv";
config();
import app from "./config/app";
import connectDB from "./config/db";

connectDB();
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Server is runninggg...");
});
