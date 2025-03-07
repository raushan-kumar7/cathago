// import { Router } from "express";
// import {
//   createDocScan,
//   renderScanDetails,
//   renderScanForm,
//   renderScanList,
//   downloadScanReport,
//   exportScanHistory,
//   downloadScanDocument
// } from "../controllers/scan.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const scanRouter = Router();

// scanRouter.use(authenticate);

// // Scan routes
// scanRouter.route("/").get(renderScanList);
// scanRouter.route("/new").get(renderScanForm);
// scanRouter.route("/").post(createDocScan);
// scanRouter.route("/:id").get(renderScanDetails);
// scanRouter.route("/:id/download").get(downloadScanReport);
// scanRouter.route("/history/export").get(exportScanHistory);
// scanRouter.route("/:id/documentation").get(downloadScanDocument);

// export default scanRouter;


import { Router } from "express";
import {
  createDocScan,
  renderScanDetails,
  renderScanForm,
  renderScanList,
  downloadScanReport,
  exportScanHistory,
  downloadScanDocument,
} from "../controllers/scan.controller.js";
import { renderAIScan, renderAIScanDetails, downloadAIScanReport, createNewAIScan } from "../controllers/ai_scan.controller.js"
import { authenticate } from "../middleware/auth.middleware.js";

const scanRouter = Router();

scanRouter.use(authenticate);

// Regular Scan routes
scanRouter.route("/").get(renderScanList);
scanRouter.route("/new").get(renderScanForm);
scanRouter.route("/").post(createDocScan);
scanRouter.route("/:id").get(renderScanDetails);
scanRouter.route("/:id/download").get(downloadScanReport);
scanRouter.route("/history/export").get(exportScanHistory);
scanRouter.route("/:id/documentation").get(downloadScanDocument);

// AI Scan routes
scanRouter.route("/ai/new").get(renderAIScan);
scanRouter.route("/ai").post(createNewAIScan);
scanRouter.route("/ai/:id").get(renderAIScanDetails);
scanRouter.route("/ai/:id/download").get(downloadAIScanReport);

export default scanRouter;