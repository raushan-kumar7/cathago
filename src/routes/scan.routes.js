import { Router } from "express";
import {
  createDocScan,
  renderScanDetails,
  renderScanForm,
  renderScanList,
} from "../controllers/scan.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const scanRouter = Router();

scanRouter.use(authenticate);

// Scan routes
scanRouter.route("/").get(renderScanList);
scanRouter.route("/new").get(renderScanForm);
scanRouter.route("/").post(createDocScan);
scanRouter.route("/:id").get(renderScanDetails);

export default scanRouter;