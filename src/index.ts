import { config } from "dotenv";
config();
import app from "./framework/config/app";
import connectDB from "./framework/config/db";

connectDB();
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Server is runninggg...");
});
