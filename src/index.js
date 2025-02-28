import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./config/index.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3600, () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("Sqlite DB connection failed", error);
  });