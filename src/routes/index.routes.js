import { Router } from "express";
import {
  renderDashboard,
  renderLandingPage,
} from "../controllers/home.controller.js";
import { authenticate, checkAuth } from "../middleware/auth.middleware.js";
import authRouter from "./auth.routes.js";
import docsRouter from "./document.routes.js";
import scanRouter from "./scan.routes.js";
import settingRouter from "./setting.routes.js";
import creditRouter from "./credit.routes.js";

const idxRouter = Router();

idxRouter.route("/").get(renderLandingPage);

idxRouter.use(checkAuth);

// Home routes
idxRouter.route("/dashboard").get(authenticate, renderDashboard);

// Auth routes
idxRouter.use("/auth", authRouter);
idxRouter.use("/documents", docsRouter);
idxRouter.use("/scans", scanRouter);
idxRouter.use("/users", settingRouter);
idxRouter.use("/credit-request", creditRouter);

export default idxRouter;