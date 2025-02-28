import express from "express";
import { setLogger } from "./middleware/logger.middleware.js";
import { setSecurity } from "./middleware/security.middleware.js";
import { setCsrf } from "./middleware/csrf.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middlewares
setLogger(app);
setSecurity(app);
//setCsrf(app);

// Routes import
import csrfRouter from "./routes/csrf.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

// Routes Declaration
app.use("/api/v1/csrf", csrfRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

export { app };