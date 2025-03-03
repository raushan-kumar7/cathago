import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { connectDB } from "./config/index.js";
import models from "./models/index.js"

connectDB()
  .then(() => {
    models.sequelize.sync().then(() => {
      console.log("Database & Tables created!")
    })
    app.listen(process.env.PORT || 3600, () => {
      console.log(
        `Server is running on port http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("Sqlite DB connection failed", error);
  });