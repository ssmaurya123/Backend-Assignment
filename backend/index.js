import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
dotenv.config({}); // Load environment variables from .env file

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies from requests
app.use(cookieParser());

// Even though corsoptions not needed here but after connecting frontend browser need it otherwise it will show error in console that is why i have added it her for safety purpose
const corsOptions = {
  origin: "http//localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

//API-routes

app.use("/api/v1/user", userRoute); // User-related routes
app.use("/api/v1/admin", adminRoute); // Admin-related routes

// Starting the server and connecting to the database

app.listen(PORT, (error) => {
  connectDB();
  console.log(`Server Started at PORT ${PORT}`);
});
